import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg-base)', textAlign: 'center', padding: 'var(--space-4)',
    }}>
      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
        404
      </h1>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
        Сторінку не знайдено
      </p>
      <Link href="/course" className="btn btn-secondary btn-md" style={{ textDecoration: 'none' }}>
        На головну
      </Link>
    </div>
  )
}
