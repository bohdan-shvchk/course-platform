import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { UserMenu } from './user-menu'
import type { SessionUser } from '@/types'

interface Props { user: SessionUser }

export function TopBar({ user }: Props) {
  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: 'var(--topbar-height)',
      background: 'var(--color-bg-base)',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-6)',
      zIndex: 50,
    }}>
      <Link href="/course" style={{
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--color-text-primary)',
        textDecoration: 'none',
      }}>
        Платформа курсів
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        {user.role === 'admin' && (
          <Link href="/admin" className="btn btn-ghost btn-sm">
            Адмін
          </Link>
        )}
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  )
}
