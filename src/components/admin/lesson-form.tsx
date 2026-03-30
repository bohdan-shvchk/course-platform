'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RichEditor } from '@/components/ui/rich-editor'

interface Props {
  moduleId: string
  id?: string
  title?: string
  description?: string
  videoId?: string
  videoLibraryId?: string
  videoDuration?: number | null
}

export function LessonForm({
  moduleId,
  id,
  title: initTitle = '',
  description: initDesc = '',
  videoId: initVideoId = '',
  videoLibraryId: initLibraryId = '',
}: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(initTitle)
  const [description, setDescription] = useState(initDesc)
  const [videoId, setVideoId] = useState(initVideoId)
  const [videoLibraryId, setVideoLibraryId] = useState(initLibraryId)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('Назва обовʼязкова'); return }
    setLoading(true)
    setError('')

    let res: Response
    if (id) {
      res = await fetch(`/api/admin/lessons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          videoId: videoId.trim() || null,
          videoLibraryId: videoLibraryId.trim() || null,
        }),
      })
    } else {
      res = await fetch('/api/admin/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          title: title.trim(),
          description: description.trim() || null,
          videoId: videoId.trim() || null,
          videoLibraryId: videoLibraryId.trim() || null,
        }),
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
          <label className="input-label">Назва уроку</label>
          <input
            className="input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Наприклад: Що таке JavaScript?"
            disabled={loading}
          />
        </div>

        <div className="input-wrapper">
          <label className="input-label">Опис <span style={{ color: 'var(--color-text-muted)', fontWeight: 'var(--font-normal)' }}>(необовʼязково)</span></label>
          <RichEditor
            value={description}
            onChange={setDescription}
            placeholder="Про що цей урок..."
            disabled={loading}
          />
        </div>

        <div className="input-wrapper">
          <label className="input-label">Bunny Video ID <span style={{ color: 'var(--color-text-muted)', fontWeight: 'var(--font-normal)' }}>(необовʼязково)</span></label>
          <input
            className="input"
            value={videoId}
            onChange={e => setVideoId(e.target.value)}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            disabled={loading}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
          />
          <span className="input-hint">ID відео з Bunny Stream бібліотеки</span>
        </div>

        <div className="input-wrapper">
          <label className="input-label">Bunny Library ID <span style={{ color: 'var(--color-text-muted)', fontWeight: 'var(--font-normal)' }}>(необовʼязково)</span></label>
          <input
            className="input"
            value={videoLibraryId}
            onChange={e => setVideoLibraryId(e.target.value)}
            placeholder="123456"
            disabled={loading}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
          />
          <span className="input-hint">Числовий ID бібліотеки в Bunny Stream</span>
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
