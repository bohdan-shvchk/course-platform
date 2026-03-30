import { createAdminClient } from '@/lib/supabase/admin'
import { CourseSidebar } from '@/components/course/course-sidebar'

export default async function CourseLayout({ children }: { children: React.ReactNode }) {
  const db = createAdminClient()

  const { data: modules } = await db
    .from('modules')
    .select('id, title, position, is_published, lessons(id, title, position, is_published, video_duration, video_thumbnail)')
    .eq('is_published', true)
    .order('position')

  const progressMap = new Map()

  const formattedModules = (modules ?? []).map(m => ({
    ...m,
    isPublished: m.is_published,
    lessons: (m.lessons as any[])
      .filter(l => l.is_published)
      .sort((a, b) => a.position - b.position)
      .map(l => ({ ...l, isPublished: l.is_published, videoDuration: l.video_duration, videoThumbnail: l.video_thumbnail }))
  }))

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--topbar-height))' }}>
      <CourseSidebar modules={formattedModules} progressMap={progressMap} />
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--color-bg-base)' }}>
        {children}
      </main>
    </div>
  )
}
