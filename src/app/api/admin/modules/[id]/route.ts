import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const db = createAdminClient()

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (body.isPublished !== undefined) update.is_published = body.isPublished
  if (body.title !== undefined) update.title = body.title
  if (body.description !== undefined) update.description = body.description
  if (body.position !== undefined) update.position = body.position

  const { error } = await db.from('modules').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = createAdminClient()

  const { error } = await db.from('modules').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
