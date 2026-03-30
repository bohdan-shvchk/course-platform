import { Lock } from 'lucide-react'
import Link from 'next/link'

interface Props {
  lesson: { title: string; module: { title: string } }
  lockedByLesson: string
}

export function LockedLesson({ lesson, lockedByLesson }: Props) {
  return (
    <div style={{
      maxWidth: 'var(--content-max-width)', margin: '0 auto',
      padding: 'var(--space-8) var(--space-6)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', textAlign: 'center',
    }}>
      <div style={{
        width: '4rem', height: '4rem', borderRadius: 'var(--radius-full)',
        background: 'var(--color-bg-muted)', border: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 'var(--space-6)',
      }}>
        <Lock size={24} style={{ color: 'var(--color-text-muted)' }} />
      </div>

      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
        {lesson.title}
      </h1>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', maxWidth: '360px' }}>
        Щоб переглянути цей урок, спочатку завершіть урок{' '}
        <strong style={{ color: 'var(--color-text-primary)' }}>«{lockedByLesson}»</strong>
      </p>

      <Link href="/course" className="btn btn-secondary btn-md" style={{ textDecoration: 'none' }}>
        Повернутись до курсу
      </Link>
    </div>
  )
}
