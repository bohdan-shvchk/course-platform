import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const db = createAdminClient()

  const { data: last } = await db.from('modules').select('position').order('position', { ascending: false }).limit(1).single()
  const position = (last?.position ?? 0) + 1

  const { data, error } = await db.from('modules').insert({
    id: crypto.randomUUID(),
    title: body.title,
    description: body.description ?? null,
    position,
    is_published: false,
    updated_at: new Date().toISOString(),
  }).select('id').single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id })
}
