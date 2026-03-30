import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const schema = z.object({
  lessonId: z.string().uuid(),
  watchSeconds: z.number().int().min(0),
  isCompleted: z.boolean(),
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const { lessonId, watchSeconds, isCompleted } = parsed.data
  const db = createAdminClient()

  const { error } = await db.from('lesson_progress').upsert({
    id: crypto.randomUUID(),
    user_id: user.id,
    lesson_id: lessonId,
    watch_seconds: watchSeconds,
    is_completed: isCompleted,
    completed_at: isCompleted ? new Date().toISOString() : null,
    last_watched_at: new Date().toISOString(),
  }, { onConflict: 'user_id,lesson_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
