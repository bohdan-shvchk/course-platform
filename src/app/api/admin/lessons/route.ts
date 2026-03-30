import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const db = createAdminClient()

  if (!body.moduleId) return NextResponse.json({ error: 'moduleId required' }, { status: 400 })

  const { data: last } = await db.from('lessons').select('position').eq('module_id', body.moduleId).order('position', { ascending: false }).limit(1).single()
  const position = (last?.position ?? 0) + 1

  const { data, error } = await db.from('lessons').insert({
    id: crypto.randomUUID(),
    module_id: body.moduleId,
    title: body.title,
    description: body.description ?? null,
    position,
    is_published: false,
    updated_at: new Date().toISOString(),
  }).select('id').single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id })
}
