import { createAdminClient } from '@/lib/supabase/admin'
import { StudentsTable } from '@/components/admin/students-table'

export default async function StudentsPage() {
  const db = createAdminClient()

  const { data: students } = await db
    .from('users')
    .select('id, email, full_name, created_at, enrollments(enrolled_at, expires_at)')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  const { count: totalLessons } = await db
    .from('lessons')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)

  const { data: progressData } = await db
    .from('lesson_progress')
    .select('user_id')
    .eq('is_completed', true)

  const progressByUser = new Map<string, number>()
  for (const p of progressData ?? []) {
    progressByUser.set(p.user_id, (progressByUser.get(p.user_id) ?? 0) + 1)
  }

  const formatted = (students ?? []).map(s => ({
    id: s.id, email: s.email, fullName: s.full_name, createdAt: s.created_at,
    enrollment: (() => {
      const e = Array.isArray(s.enrollments) ? s.enrollments[0] ?? null : s.enrollments
      if (!e) return null
      return { enrolledAt: e.enrolled_at, expiresAt: e.expires_at }
    })(),
    completedCount: progressByUser.get(s.id) ?? 0,
  }))

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>Студенти</h1>
      </div>
      <StudentsTable students={formatted} totalLessons={totalLessons ?? 0} />
    </div>
  )
}
