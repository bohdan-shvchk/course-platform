'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

interface Props { token: string; email: string }

export function InviteForm({ token, email }: Props) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) { setError('Пароль має бути не менше 8 символів'); return }
    if (password !== confirm) { setError('Паролі не співпадають'); return }

    setLoading(true)
    const res = await fetch('/api/auth/invite/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Помилка. Спробуйте ще раз.')
      setLoading(false)
      return
    }

    router.push('/course')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={{
        padding: 'var(--space-3)',
        background: 'var(--color-bg-muted)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-secondary)',
      }}>
        {email}
      </div>

      <div className="input-wrapper">
        <label className="input-label">Пароль</label>
        <div style={{ position: 'relative' }}>
          <input
            className="input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Мінімум 8 символів"
            required
            style={{ paddingRight: 'var(--space-10)' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            style={{
              position: 'absolute', right: 'var(--space-3)', top: '50%',
              transform: 'translateY(-50%)', background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center',
            }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <Input
        label="Підтвердіть пароль"
        type="password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        placeholder="Повторіть пароль"
        required
      />

      {error && (
        <p style={{
          fontSize: 'var(--text-sm)', color: 'var(--color-danger)',
          background: 'var(--color-danger-subtle)', border: '1px solid var(--color-danger)',
          borderRadius: 'var(--radius-md)', padding: 'var(--space-3)',
        }}>
          {error}
        </p>
      )}

      <Button type="submit" loading={loading} style={{ width: '100%', marginTop: 'var(--space-2)' }}>
        Активувати акаунт
      </Button>
    </form>
  )
}
