'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface Props {
  id?: string
  title?: string
  description?: string
}

export function ModuleForm({ id, title: initTitle = '', description: initDesc = '' }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(initTitle)
  const [description, setDescription] = useState(initDesc)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('Назва обовʼязкова'); return }
    setLoading(true)
    setError('')

    let res: Response
    if (id) {
      res = await fetch(`/api/admin/modules/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description: description.trim() || null }),
      })
    } else {
      res = await fetch('/api/admin/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description: description.trim() || null }),
      })
    }

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Помилка збереження')
      setLoading(false)
      return
    }

    router.push('/admin/content')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div className="input-wrapper">
          <label className="input-label">Назва модуля</label>
          <input
            className="input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Наприклад: Вступ до курсу"
            disabled={loading}
          />
        </div>

        <div className="input-wrapper">
          <label className="input-label">Опис <span style={{ color: 'var(--color-text-muted)', fontWeight: 'var(--font-normal)' }}>(необовʼязково)</span></label>
          <textarea
            className="textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Короткий опис модуля..."
            disabled={loading}
          />
        </div>

        {error && <p className="input-error">{error}</p>}
      </div>

      <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
        <Button type="button" variant="secondary" size="md" onClick={() => router.back()} disabled={loading}>
          Скасувати
        </Button>
        <Button type="submit" size="md" disabled={loading}>
          {loading ? 'Збереження...' : id ? 'Зберегти' : 'Створити'}
        </Button>
      </div>
    </form>
  )
}
