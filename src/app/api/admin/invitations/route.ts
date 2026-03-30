import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateToken } from '@/lib/utils'
import { z } from 'zod'

const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createAdminClient()
  const { data: dbUser } = await db.from('users').select('role').eq('id', user.id).single()
  if (dbUser?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid email' }, { status: 400 })

  const token = generateToken(32)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  await db.from('invitations').insert({ id: crypto.randomUUID(), token, email: parsed.data.email, created_by: user.id, expires_at: expiresAt })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
  return NextResponse.json({ inviteUrl: `${baseUrl}/invite/${token}` })
}
