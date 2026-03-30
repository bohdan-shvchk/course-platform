'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, BookOpen, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/admin/registrations', label: 'Заявки', icon: ClipboardList },
  { href: '/admin/students', label: 'Студенти', icon: Users },
  { href: '/admin/content', label: 'Контент', icon: BookOpen },
]

export function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside style={{
      width: 'var(--admin-sidebar-width)',
      flexShrink: 0,
      borderRight: '1px solid var(--color-border)',
      background: 'var(--color-bg-subtle)',
      padding: 'var(--space-4)',
    }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              fontSize: 'var(--text-sm)',
              fontWeight: isActive ? 'var(--font-medium)' : 'var(--font-normal)',
              color: isActive ? 'var(--color-accent-text)' : 'var(--color-text-secondary)',
              background: isActive ? 'var(--color-accent-subtle)' : 'transparent',
              transition: 'background var(--duration-fast), color var(--duration-fast)',
            }}>
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
