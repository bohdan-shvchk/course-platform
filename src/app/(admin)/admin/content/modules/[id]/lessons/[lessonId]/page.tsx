import { createAdminClient } from '@/lib/supabase/admin'
import { LessonForm } from '@/components/admin/lesson-form'
import { notFound } from 'next/navigation'

export default async function EditLessonPage({ params }: { params: Promise<{ id: string; lessonId: string }> }) {
  const { id, lessonId } = await params
  const db = createAdminClient()

  const [{ data: mod }, { data: lesson }] = await Promise.all([
    db.from('modules').select('id, title').eq('id', id).single(),
    db.from('lessons').select('id, title, description, video_id, video_library_id, video_duration').eq('id', lessonId).single(),
  ])

  if (!mod || !lesson) notFound()

  return (
    <div style={{ maxWidth: 'var(--content-max-width)', margin: '0 auto' }}>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
        {mod.title}
      </p>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-8)' }}>
        Редагувати урок
      </h1>
      <LessonForm
        moduleId={mod.id}
        id={lesson.id}
        title={lesson.title}
        description={lesson.description ?? ''}
        videoId={lesson.video_id ?? ''}
        videoLibraryId={lesson.video_library_id ?? ''}
        videoDuration={lesson.video_duration ?? null}
      />
    </div>
  )
}
