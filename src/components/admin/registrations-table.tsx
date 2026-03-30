'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle } from 'lucide-react'

interface Registration {
  id: string
  email: string
  fullName: string
  status: 'pending' | 'paid'
  createdAt: string
}

export function RegistrationsTable({ registrations: initial }: { registrations: Registration[] }) {
  const [items, setItems] = useState(initial)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function confirm(id: string) {
    setLoadingId(id)
    setErrors(prev => ({ ...prev, [id]: '' }))

    const res = await fetch(`/api/admin/registrations/${id}/confirm`, { method: 'POST' })
    const data = await res.json()

    if (!res.ok) {
      setErrors(prev => ({ ...prev, [id]: data.error ?? 'Помилка' }))
    } else {
      setItems(prev => prev.map(r => r.id === id ? { ...r, status: 'paid' } : r))
    }
    setLoadingId(null)
  }

  return (
    <div className="card">
      <div className="card-header">
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          {items.length} заявок
        </p>
      </div>

      {items.length === 0 ? (
        <div className="card-body" style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', padding: 'var(--space-12)' }}>
          Заявок ще немає
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {["Ім'я", 'Email', 'Статус', 'Дата', ''].map(h => (
                <th key={h} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 'var(--font-medium)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((r, i) => (
              <tr key={r.id} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--color-border)' }}>
                <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--color-text-primary)' }}>
                  {r.fullName}
                </td>
                <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  {r.email}
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <Badge variant={r.status === 'paid' ? 'success' : 'default'}>
                    {r.status === 'paid' ? 'Оплачено' : 'Зареєстрований'}
                  </Badge>
                </td>
                <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                  {new Date(r.createdAt).toLocaleDateString('uk-UA')}
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  {r.status === 'pending' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-1)' }}>
                      <Button
                        size="sm"
                        loading={loadingId === r.id}
                        onClick={() => confirm(r.id)}
                      >
                        <CheckCircle size={14} />
                        Підтвердити
                      </Button>
                      {errors[r.id] && (
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-danger)' }}>
                          {errors[r.id]}
                        </span>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
