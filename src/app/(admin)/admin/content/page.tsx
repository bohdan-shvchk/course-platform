import { createAdminClient } from '@/lib/supabase/admin'
import { ContentManager } from '@/components/admin/content-manager'

export default async function ContentPage() {
  const db = createAdminClient()

  const { data: modules } = await db
    .from('modules')
    .select('id, title, description, position, is_published, lessons(id, title, position, is_published, video_id, video_duration)')
    .order('position')

  const formatted = (modules ?? []).map(m => ({
    id: m.id,
    title: m.title,
    description: m.description,
    position: m.position,
    isPublished: m.is_published,
    lessons: ((m.lessons as any[]) ?? [])
      .sort((a: any, b: any) => a.position - b.position)
      .map((l: any) => ({
        id: l.id,
        title: l.title,
        position: l.position,
        isPublished: l.is_published,
        hasVideo: !!l.video_id,
        videoDuration: l.video_duration,
      }))
  }))

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>
          Контент курсу
        </h1>
      </div>
      <ContentManager modules={formatted} />
    </div>
  )
}
