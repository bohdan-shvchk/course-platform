import { createAdminClient } from '@/lib/supabase/admin'
import { RegistrationsTable } from '@/components/admin/registrations-table'

export default async function RegistrationsPage() {
  const db = createAdminClient()

  const { data } = await db
    .from('registrations')
    .select('id, email, full_name, status, created_at')
    .order('created_at', { ascending: false })

  const formatted = (data ?? []).map(r => ({
    id: r.id,
    email: r.email,
    fullName: r.full_name,
    status: r.status as 'pending' | 'paid',
    createdAt: r.created_at,
  }))

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>
          Заявки
        </h1>
      </div>
      <RegistrationsTable registrations={formatted} />
    </div>
  )
}
