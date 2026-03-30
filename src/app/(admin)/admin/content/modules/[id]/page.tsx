import { createAdminClient } from '@/lib/supabase/admin'
import { ModuleForm } from '@/components/admin/module-form'
import { notFound } from 'next/navigation'

export default async function EditModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = createAdminClient()

  const { data: mod } = await db.from('modules').select('id, title, description').eq('id', id).single()
  if (!mod) notFound()

  return (
    <div style={{ maxWidth: 'var(--content-max-width)', margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-8)' }}>
        Редагувати модуль
      </h1>
      <ModuleForm id={mod.id} title={mod.title} description={mod.description ?? ''} />
    </div>
  )
}
