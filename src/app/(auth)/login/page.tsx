import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg-base)',
      padding: 'var(--space-4)',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h1 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-2)',
          }}>
            Вхід до платформи
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Введіть свої дані для входу
          </p>
        </div>
        <div className="card">
          <div className="card-body">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
