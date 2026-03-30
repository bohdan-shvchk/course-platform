'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Copy, Check, Trash2 } from 'lucide-react'

interface Student {
  id: string; email: string; fullName: string | null; createdAt: Date
  enrollment: { enrolledAt: Date; expiresAt: Date | null } | null
  completedCount: number
}
interface Props { students: Student[]; totalLessons: number }

export function StudentsTable({ students, totalLessons }: Props) {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteLink, setInviteLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  async function generateInvite() {
    if (!inviteEmail) return
    setLoading(true)
    const res = await fetch('/api/admin/invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail }),
    })
    const data = await res.json()
    if (data.inviteUrl) setInviteLink(data.inviteUrl)
    setLoading(false)
  }

  async function copyLink() {
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function deleteStudent(id: string) {
    if (!confirm('Видалити студента?')) return
    await fetch(`/api/admin/students/${id}`, { method: 'DELETE' })
    window.location.reload()
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            {students.length} студентів
          </p>
          <Button size="sm" onClick={() => { setShowInviteModal(true); setInviteLink(''); setInviteEmail('') }}>
            <UserPlus size={14} />
            Запросити студента
          </Button>
        </div>

        {students.length === 0 ? (
          <div className="card-body" style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', padding: 'var(--space-12)' }}>
            Студентів ще немає. Запросіть першого.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['Студент', 'Доступ', 'Прогрес', 'Зареєстровано', ''].map(h => (
                  <th key={h} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 'var(--font-medium)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.id} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--color-border)' }}>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>
                      {s.fullName ?? s.email}
                    </p>
                    {s.fullName && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{s.email}</p>}
                  </td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <Badge variant={s.enrollment?.expiresAt ? 'warning' : 'success'}>
                      {s.enrollment?.expiresAt ? 'Обмежений' : 'Безстроковий'}
                    </Badge>
                  </td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                      {s.completedCount}/{totalLessons}
                    </span>
                    <div className="progress-track" style={{ marginTop: 'var(--space-1)', width: '80px' }}>
                      <div className="progress-fill" style={{ width: `${totalLessons > 0 ? (s.completedCount / totalLessons) * 100 : 0}%` }} />
                    </div>
                  </td>
                  <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                    {new Date(s.createdAt).toLocaleDateString('uk-UA')}
                  </td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <Button variant="ghost" size="sm" onClick={() => deleteStudent(s.id)}>
                      <Trash2 size={14} style={{ color: 'var(--color-danger)' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowInviteModal(false)} />
          <div className="card" style={{ width: '100%', maxWidth: '420px', zIndex: 101, position: 'relative' }}>
            <div className="card-header">
              <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>
                Запросити студента
              </h2>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <Input
                label="Email студента"
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="student@example.com"
              />
              {!inviteLink ? (
                <Button onClick={generateInvite} loading={loading} style={{ width: '100%' }}>
                  Згенерувати посилання
                </Button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    Надішліть це посилання студенту. Воно дійсне 7 днів.
                  </p>
                  <div style={{
                    display: 'flex', gap: 'var(--space-2)',
                    padding: 'var(--space-3)',
                    background: 'var(--color-bg-muted)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                  }}>
                    <code style={{ flex: 1, fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', wordBreak: 'break-all' }}>
                      {inviteLink}
                    </code>
                    <button onClick={copyLink} className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>
                      {copied ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
