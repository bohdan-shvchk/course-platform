import { RegisterForm } from '@/components/auth/register-form'

export default function RegisterPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg-base)', padding: 'var(--space-4)',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
            Реєстрація
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            Залиште заявку — після підтвердження оплати ви отримаєте доступ до курсу
          </p>
        </div>
        <div className="card">
          <div className="card-body">
            <RegisterForm />
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          Вже маєте доступ? <a href="/login" style={{ color: 'var(--color-accent-text)', textDecoration: 'none' }}>Увійти</a>
        </p>
      </div>
    </div>
  )
}
