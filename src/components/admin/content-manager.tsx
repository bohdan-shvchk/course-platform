'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, Video, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDuration } from '@/lib/utils'

interface Lesson {
  id: string; title: string; position: number
  isPublished: boolean; hasVideo: boolean; videoDuration: number | null
}
interface Module {
  id: string; title: string; description: string | null
  position: number; isPublished: boolean; lessons: Lesson[]
}

interface Props { modules: Module[] }

export function ContentManager({ modules: initial }: Props) {
  const router = useRouter()
  const [modules, setModules] = useState(initial)
  const [openModules, setOpenModules] = useState<Set<string>>(new Set(initial.map(m => m.id)))

  const toggle = (id: string) => {
    setOpenModules(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function togglePublishModule(id: string, current: boolean) {
    await fetch(`/api/admin/modules/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !current }),
    })
    setModules(prev => prev.map(m => m.id === id ? { ...m, isPublished: !current } : m))
  }

  async function togglePublishLesson(moduleId: string, lessonId: string, current: boolean) {
    await fetch(`/api/admin/lessons/${lessonId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !current }),
    })
    setModules(prev => prev.map(m => m.id === moduleId
      ? { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, isPublished: !current } : l) }
      : m
    ))
  }

  async function deleteModule(id: string) {
    if (!confirm('Видалити модуль і всі його уроки?')) return
    await fetch(`/api/admin/modules/${id}`, { method: 'DELETE' })
    setModules(prev => prev.filter(m => m.id !== id))
  }

  async function deleteLesson(moduleId: string, lessonId: string) {
    if (!confirm('Видалити урок?')) return
    await fetch(`/api/admin/lessons/${lessonId}`, { method: 'DELETE' })
    setModules(prev => prev.map(m => m.id === moduleId
      ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
      : m
    ))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Кнопка нового модуля */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button size="sm" onClick={() => router.push('/admin/content/modules/new')}>
          <Plus size={14} />
          Новий модуль
        </Button>
      </div>

      {modules.length === 0 && (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Модулів ще немає. Створіть перший модуль.
          </div>
        </div>
      )}

      {modules.map(mod => (
        <div key={mod.id} className="card">
          {/* Module header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
            padding: 'var(--space-4) var(--space-5)',
            borderBottom: openModules.has(mod.id) ? '1px solid var(--color-border)' : 'none',
          }}>
            <button onClick={() => toggle(mod.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', flexShrink: 0 }}>
              {openModules.has(mod.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>
                  {mod.title}
                </span>
                <Badge variant={mod.isPublished ? 'success' : 'default'}>
                  {mod.isPublished ? 'Опублікований' : 'Чорновик'}
                </Badge>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
                {mod.lessons.length} уроків
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <Button variant="ghost" size="sm" onClick={() => togglePublishModule(mod.id, mod.isPublished)}>
                {mod.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/content/modules/${mod.id}`)}>
                <Pencil size={14} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteModule(mod.id)}>
                <Trash2 size={14} style={{ color: 'var(--color-danger)' }} />
              </Button>
            </div>
          </div>

          {/* Lessons */}
          {openModules.has(mod.id) && (
            <div>
              {mod.lessons.map((lesson, i) => (
                <div key={lesson.id} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                  padding: 'var(--space-3) var(--space-5) var(--space-3) var(--space-10)',
                  borderTop: i === 0 ? 'none' : '1px solid var(--color-border)',
                  background: 'var(--color-bg-base)',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                        {lesson.title}
                      </span>
                      <Badge variant={lesson.isPublished ? 'success' : 'default'}>
                        {lesson.isPublished ? 'Опублікований' : 'Чорновик'}
                      </Badge>
                      {lesson.hasVideo && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                          <Video size={12} />
                          {lesson.videoDuration ? formatDuration(lesson.videoDuration) : 'Відео'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                    <Button variant="ghost" size="sm" onClick={() => togglePublishLesson(mod.id, lesson.id, lesson.isPublished)}>
                      {lesson.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/content/modules/${mod.id}/lessons/${lesson.id}`)}>
                      <Pencil size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteLesson(mod.id, lesson.id)}>
                      <Trash2 size={14} style={{ color: 'var(--color-danger)' }} />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Додати урок */}
              <div style={{ padding: 'var(--space-3) var(--space-5) var(--space-3) var(--space-10)', borderTop: mod.lessons.length > 0 ? '1px solid var(--color-border)' : 'none' }}>
                <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/content/modules/${mod.id}/lessons/new`)}>
                  <Plus size={14} />
                  Додати урок
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
