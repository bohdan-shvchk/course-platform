import { createAdminClient } from '@/lib/supabase/admin'
import { LessonForm } from '@/components/admin/lesson-form'
import { notFound } from 'next/navigation'

export default async function NewLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = createAdminClient()

  const { data: mod } = await db.from('modules').select('id, title').eq('id', id).single()
  if (!mod) notFound()

  return (
    <div style={{ maxWidth: 'var(--content-max-width)', margin: '0 auto' }}>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
        {mod.title}
      </p>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-8)' }}>
        Новий урок
      </h1>
      <LessonForm moduleId={mod.id} />
    </div>
  )
}
