'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Невірний email або пароль')
      setLoading(false)
      return
    }

    router.push('/course')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        autoComplete="email"
      />

      <div className="input-wrapper">
        <label className="input-label">Пароль</label>
        <div style={{ position: 'relative' }}>
          <input
            className="input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            style={{ paddingRight: 'var(--space-10)' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            style={{
              position: 'absolute',
              right: 'var(--space-3)',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-danger)',
          background: 'var(--color-danger-subtle)',
          border: '1px solid var(--color-danger)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3)',
        }}>
          {error}
        </p>
      )}

      <Button type="submit" loading={loading} size="md" style={{ width: '100%', marginTop: 'var(--space-2)' }}>
        Увійти
      </Button>
    </form>
  )
}
