import { createAdminClient } from '@/lib/supabase/admin'
import { InviteForm } from '@/components/auth/invite-form'
import { notFound } from 'next/navigation'

interface Props { params: Promise<{ token: string }> }

export default async function InvitePage({ params }: Props) {
  const { token } = await params
  const db = createAdminClient()

  const { data: invitation } = await db
    .from('invitations')
    .select('id, email, expires_at, used_at')
    .eq('token', token)
    .single()

  const isValid = invitation && !invitation.used_at && new Date(invitation.expires_at) > new Date()
  if (!isValid) notFound()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-base)', padding: 'var(--space-4)' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
            Встановіть пароль
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Запрошення для <strong>{invitation.email}</strong>
          </p>
        </div>
        <div className="card">
          <div className="card-body">
            <InviteForm token={token} email={invitation.email} />
          </div>
        </div>
      </div>
    </div>
  )
}
