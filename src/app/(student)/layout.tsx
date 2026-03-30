import { TopBar } from '@/components/layout/top-bar'
import type { SessionUser } from '@/types'

const mockUser: SessionUser = { id: 'mock', email: 'admin@course.local', role: 'admin', fullName: 'Адмін' }

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>
      <TopBar user={mockUser} />
      <main style={{ paddingTop: 'var(--topbar-height)' }}>
        {children}
      </main>
    </div>
  )
}
