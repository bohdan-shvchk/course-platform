'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function RegisterForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!fullName.trim() || !email.trim()) { setError("Заповніть всі поля"); return }
    setLoading(true)
    setError('')

    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), fullName: fullName.trim() }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Помилка'); setLoading(false); return }
    setSuccess(true)
  }

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <div style={{ fontSize: '40px', marginBottom: 'var(--space-4)' }}>✓</div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
          Заявку отримано!
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
          Після підтвердження оплати ви отримаєте лист з посиланням для входу на вказану пошту.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div className="input-wrapper">
        <label className="input-label">Імʼя та прізвище</label>
        <input
          className="input"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          placeholder="Іван Іваненко"
          disabled={loading}
        />
      </div>
      <div className="input-wrapper">
        <label className="input-label">Email</label>
        <input
          className="input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="ivan@example.com"
          disabled={loading}
        />
      </div>
      {error && <p className="input-error">{error}</p>}
      <Button type="submit" size="md" loading={loading} style={{ width: '100%' }}>
        Подати заявку
      </Button>
    </form>
  )
}
