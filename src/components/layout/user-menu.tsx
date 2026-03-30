'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, User } from 'lucide-react'
import type { SessionUser } from '@/types'

interface Props { user: SessionUser }

export function UserMenu({ user }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="btn btn-ghost btn-sm"
        style={{ gap: 'var(--space-2)' }}
      >
        <div style={{
          width: '1.5rem', height: '1.5rem',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-accent-subtle)',
          border: '1px solid var(--color-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--color-accent)',
        }}>
          <User size={12} />
        </div>
        <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.fullName ?? user.email}
        </span>
      </button>

      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
            onClick={() => setOpen(false)}
          />
          <div style={{
            position: 'absolute', right: 0, top: 'calc(100% + var(--space-2))',
            background: 'var(--color-bg-base)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            minWidth: '180px',
            zIndex: 50,
            overflow: 'hidden',
          }}>
            <div style={{
              padding: 'var(--space-3) var(--space-4)',
              borderBottom: '1px solid var(--color-border)',
            }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Увійшли як</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>
                {user.email}
              </p>
            </div>
            <button
              onClick={logout}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-4)',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 'var(--text-sm)', color: 'var(--color-danger)',
                textAlign: 'left',
              }}
            >
              <LogOut size={14} />
              Вийти
            </button>
          </div>
        </>
      )}
    </div>
  )
}
