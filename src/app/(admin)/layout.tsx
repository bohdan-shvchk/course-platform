import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { TopBar } from '@/components/layout/top-bar'
import type { SessionUser } from '@/types'

const mockUser: SessionUser = { id: 'mock', email: 'admin@course.local', role: 'admin', fullName: 'Адмін' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>
      <TopBar user={mockUser} />
      <div style={{ display: 'flex', paddingTop: 'var(--topbar-height)', minHeight: '100vh' }}>
        <AdminSidebar />
        <main style={{ flex: 1, padding: 'var(--space-8) var(--space-6)', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
