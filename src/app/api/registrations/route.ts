import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  fullName: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Невірні дані' }, { status: 400 })

  const db = createAdminClient()
  const { email, fullName } = parsed.data

  const { data: existing } = await db.from('registrations').select('id, status').eq('email', email).single()
  if (existing) {
    if (existing.status === 'paid') return NextResponse.json({ error: 'Цей email вже підтверджений' }, { status: 409 })
    return NextResponse.json({ error: 'Заявка з цим email вже існує' }, { status: 409 })
  }

  const { error } = await db.from('registrations').insert({
    email,
    full_name: fullName,
    status: 'pending',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
