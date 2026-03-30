import { createAdminClient } from '@/lib/supabase/admin'
import { Users, BookOpen, CheckCircle } from 'lucide-react'

export default async function AdminPage() {
  const db = createAdminClient()

  const [{ count: studentCount }, { count: lessonCount }, { count: completionsCount }] = await Promise.all([
    db.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    db.from('lessons').select('*', { count: 'exact', head: true }).eq('is_published', true),
    db.from('lesson_progress').select('*', { count: 'exact', head: true }).eq('is_completed', true),
  ])

  const { data: recentStudents } = await db
    .from('users')
    .select('id, email, full_name, created_at')
    .eq('role', 'student')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Студентів', value: studentCount ?? 0, icon: Users },
    { label: 'Уроків', value: lessonCount ?? 0, icon: BookOpen },
    { label: 'Завершень', value: completionsCount ?? 0, icon: CheckCircle },
  ]

  return (
    <div>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-8)' }}>
        Дашборд
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card">
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} style={{ color: 'var(--color-accent)' }} />
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)' }}>{value}</p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header">
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>Останні студенти</h2>
        </div>
        <div>
          {(recentStudents ?? []).length === 0 ? (
            <div className="card-body" style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Студентів ще немає</div>
          ) : (recentStudents ?? []).map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4) var(--space-6)', borderTop: i === 0 ? 'none' : '1px solid var(--color-border)' }}>
              <div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{s.full_name ?? s.email}</p>
                {s.full_name && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{s.email}</p>}
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{new Date(s.created_at).toLocaleDateString('uk-UA')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
