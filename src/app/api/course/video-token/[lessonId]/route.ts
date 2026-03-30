import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateSignedUrl } from '@/lib/bunny/signed-url'

export async function GET(req: NextRequest, { params }: { params: Promise<{ lessonId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { lessonId } = await params
  const db = createAdminClient()

  const { data: enrollment } = await db.from('enrollments').select('expires_at').eq('user_id', user.id).single()
  if (!enrollment) return NextResponse.json({ error: 'No access' }, { status: 403 })

  const { data: lesson } = await db.from('lessons').select('video_id, video_library_id').eq('id', lessonId).eq('is_published', true).single()
  if (!lesson?.video_id || !lesson.video_library_id) return NextResponse.json({ error: 'Video not found' }, { status: 404 })

  const url = generateSignedUrl(lesson.video_id, lesson.video_library_id)
  return NextResponse.json({ url })
}
