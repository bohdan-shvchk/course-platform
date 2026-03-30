import { redirect, notFound } from 'next/navigation'
import { getSessionWithRole } from '@/lib/auth/get-session'
import { createAdminClient } from '@/lib/supabase/admin'
import { VideoPlayer } from '@/components/course/video-player'
import { LessonAttachments } from '@/components/course/lesson-attachments'
import { LessonNavigation } from '@/components/course/lesson-navigation'
import { LockedLesson } from '@/components/course/locked-lesson'
import { formatDuration } from '@/lib/utils'
import { Clock } from 'lucide-react'

interface Props { params: Promise<{ lessonId: string }> }

export default async function LessonPage({ params }: Props) {
  const { lessonId } = await params
  const user = await getSessionWithRole()
  if (!user) redirect('/login')

  const db = createAdminClient()

  const { data: enrollment } = await db.from('enrollments').select('id').eq('user_id', user.id).single()
  if (!enrollment) redirect('/login')

  const { data: lesson } = await db
    .from('lessons')
    .select('id, title, description, video_id, video_library_id, video_duration, is_published, module_id, modules(title), attachments(id, filename, mime_type, size_bytes, position)')
    .eq('id', lessonId)
    .eq('is_published', true)
    .single()

  if (!lesson) notFound()

  const { data: modules } = await db
    .from('modules')
    .select('id, lessons(id, title, position, is_published)')
    .eq('is_published', true)
    .order('position')

  const { data: progress } = await db
    .from('lesson_progress')
    .select('lesson_id, is_completed')
    .eq('user_id', user.id)

  const completedIds = new Set((progress ?? []).filter(p => p.is_completed).map(p => p.lesson_id))

  // Перевірка послідовності
  let isLocked = false
  let lockedByLesson = ''
  outer: for (const mod of modules ?? []) {
    const lessons = (mod.lessons as any[]).filter(l => l.is_published).sort((a: any, b: any) => a.position - b.position)
    for (const l of lessons) {
      if (l.id === lessonId) break outer
      if (!completedIds.has(l.id)) { isLocked = true; lockedByLesson = l.title; break outer }
    }
  }

  const allLessons = (modules ?? []).flatMap(m =>
    (m.lessons as any[]).filter(l => l.is_published).sort((a: any, b: any) => a.position - b.position)
  )
  const currentIndex = allLessons.findIndex(l => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
  const isNextLocked = !completedIds.has(lessonId)

  const moduleTitle = (lesson.modules as any)?.title ?? ''
  const attachments = ((lesson.attachments as any[]) ?? []).sort((a: any, b: any) => a.position - b.position)

  if (isLocked) {
    return <LockedLesson lesson={{ title: lesson.title, module: { title: moduleTitle } }} lockedByLesson={lockedByLesson} />
  }

  return (
    <div style={{ maxWidth: 'var(--content-max-width)', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>{moduleTitle}</p>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
        {lesson.title}
      </h1>
      {lesson.video_duration && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginBottom: 'var(--space-6)' }}>
          <Clock size={14} />{formatDuration(lesson.video_duration)}
        </p>
      )}
      {lesson.video_id && (
        <VideoPlayer lessonId={lesson.id} userEmail={user.email} isCompleted={completedIds.has(lessonId)} />
      )}
      {lesson.description && (
        <div style={{ marginTop: 'var(--space-8)', padding: 'var(--space-6)', background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
          <div dangerouslySetInnerHTML={{ __html: lesson.description }} />
        </div>
      )}
      {attachments.length > 0 && <LessonAttachments attachments={attachments} />}
      <LessonNavigation lessonId={lessonId} prevLesson={prevLesson} nextLesson={nextLesson} isNextLocked={isNextLocked} isCompleted={completedIds.has(lessonId)} />
    </div>
  )
}
