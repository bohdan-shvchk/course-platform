import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({ token: z.string().min(1), password: z.string().min(8) })

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const { token, password } = parsed.data
  const db = createAdminClient()

  const { data: invitation } = await db.from('invitations').select('*').eq('token', token).single()
  if (!invitation || invitation.used_at || new Date(invitation.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Запрошення недійсне або прострочене' }, { status: 400 })
  }

  const { data: authUser, error } = await db.auth.admin.createUser({
    email: invitation.email, password, email_confirm: true,
  })
  if (error || !authUser.user) return NextResponse.json({ error: 'Не вдалось створити акаунт' }, { status: 500 })

  const [usersResult, enrollmentsResult] = await Promise.all([
    db.from('users').insert({ id: authUser.user.id, email: invitation.email, role: 'student' }),
    db.from('enrollments').insert({ id: crypto.randomUUID(), user_id: authUser.user.id, invitation_id: invitation.id }),
    db.from('invitations').update({ used_by: authUser.user.id, used_at: new Date().toISOString() }).eq('id', invitation.id),
  ])

  if (usersResult.error || enrollmentsResult.error) {
    return NextResponse.json({ error: 'Не вдалось створити акаунт' }, { status: 500 })
  }

  const supabase = await createClient()
  await supabase.auth.signInWithPassword({ email: invitation.email, password })

  return NextResponse.json({ success: true })
}
