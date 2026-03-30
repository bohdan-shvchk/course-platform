import { ModuleForm } from '@/components/admin/module-form'

export default function NewModulePage() {
  return (
    <div style={{ maxWidth: 'var(--content-max-width)', margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-8)' }}>
        Новий модуль
      </h1>
      <ModuleForm />
    </div>
  )
}
