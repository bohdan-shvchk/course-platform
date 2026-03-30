import { redirect } from 'next/navigation'
import { getSessionWithRole } from '@/lib/auth/get-session'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { TopBar } from '@/components/layout/top-bar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionWithRole()
  if (!user || user.role !== 'admin') redirect('/login')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>
      <TopBar user={user} />
      <div style={{ display: 'flex', paddingTop: 'var(--topbar-height)', minHeight: '100vh' }}>
        <AdminSidebar />
        <main style={{ flex: 1, padding: 'var(--space-8) var(--space-6)', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
