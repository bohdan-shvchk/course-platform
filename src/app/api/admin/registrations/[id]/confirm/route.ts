import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateToken } from '@/lib/utils'
import { sendInviteEmail } from '@/lib/email'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = createAdminClient()

  const { data: reg } = await db.from('registrations').select('id, email, full_name, status').eq('id', id).single()
  if (!reg) return NextResponse.json({ error: 'Заявку не знайдено' }, { status: 404 })
  if (reg.status === 'paid') return NextResponse.json({ error: 'Вже підтверджено' }, { status: 409 })

  await db.from('registrations').update({ status: 'paid' }).eq('id', id)

  const token = generateToken(32)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  await db.from('invitations').insert({
    id: crypto.randomUUID(),
    token,
    email: reg.email,
    created_by: process.env.ADMIN_USER_ID!,
    expires_at: expiresAt,
  })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const inviteUrl = `${baseUrl}/invite/${token}`

  try {
    await sendInviteEmail(reg.email, reg.full_name, inviteUrl)
  } catch {
    return NextResponse.json({ error: 'Статус оновлено, але лист не відправлено' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
