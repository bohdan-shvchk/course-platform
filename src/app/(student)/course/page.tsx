import { createAdminClient } from '@/lib/supabase/admin'
import { BookOpen } from 'lucide-react'

export default async function CoursePage() {
  const db = createAdminClient()

  const { data: modules } = await db
    .from('modules')
    .select('id, lessons(id)')
    .eq('is_published', true)

  const totalLessons = (modules ?? []).reduce((acc, m) => acc + (m.lessons as any[]).length, 0)

  return (
    <div style={{ maxWidth: 'var(--content-max-width)', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
          Ласкаво просимо
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>
          Розпочніть навчання
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        {[
          { label: 'Модулів', value: (modules ?? []).length },
          { label: 'Уроків', value: totalLessons },
          { label: 'Завершено', value: `0/${totalLessons}` },
        ].map(stat => (
          <div key={stat.label} className="card">
            <div className="card-body" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)' }}>{stat.value}</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--color-text-primary)' }}>Загальний прогрес</span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>0%</span>
          </div>
          <div className="progress-track" style={{ height: '8px' }}>
            <div className="progress-fill" style={{ width: '0%' }} />
          </div>
        </div>
      </div>

      {totalLessons === 0 && (
        <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
          Курс ще не має опублікованих уроків
        </div>
      )}
    </div>
  )
}
