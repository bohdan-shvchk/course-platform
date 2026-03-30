import { redirect } from 'next/navigation'
import { getSessionWithRole } from '@/lib/auth/get-session'
import { TopBar } from '@/components/layout/top-bar'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionWithRole()
  if (!user) redirect('/login')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>
      <TopBar user={user} />
      <main style={{ paddingTop: 'var(--topbar-height)' }}>
        {children}
      </main>
    </div>
  )
}
