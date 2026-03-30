import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const db = createAdminClient()

  const { data: attachment } = await db
    .from('attachments')
    .select('filename, storage_path, mime_type')
    .eq('id', id)
    .single()

  if (!attachment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: signedUrl } = await db.storage
    .from('attachments')
    .createSignedUrl(attachment.storage_path, 60 * 60)

  if (!signedUrl) return NextResponse.json({ error: 'Could not generate download link' }, { status: 500 })

  return NextResponse.redirect(signedUrl.signedUrl)
}
