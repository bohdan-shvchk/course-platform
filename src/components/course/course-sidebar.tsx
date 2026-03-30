'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight, Check, Lock, Play, Clock } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import type { LessonStatus } from '@/types'

interface Lesson {
  id: string; title: string; position: number
  isPublished: boolean; videoDuration: number | null; videoThumbnail: string | null
}
interface Module {
  id: string; title: string; position: number; isPublished: boolean; lessons: Lesson[]
}
interface Props {
  modules: Module[]
  progressMap: Map<string, { isCompleted: boolean; watchSeconds: number }>
}

function getLessonStatus(
  lessonId: string,
  lessonIndex: number,
  moduleIndex: number,
  modules: Module[],
  progressMap: Map<string, { isCompleted: boolean; watchSeconds: number }>
): LessonStatus {
  const progress = progressMap.get(lessonId)
  if (progress?.isCompleted) return 'done'

  // Перевіряємо чи всі попередні уроки завершені
  for (let mi = 0; mi <= moduleIndex; mi++) {
    const mod = modules[mi]
    const lessonLimit = mi === moduleIndex ? lessonIndex : mod.lessons.length
    for (let li = 0; li < lessonLimit; li++) {
      const prevLesson = mod.lessons[li]
      const prevProgress = progressMap.get(prevLesson.id)
      if (!prevProgress?.isCompleted) return 'locked'
    }
  }

  if (progress?.watchSeconds && progress.watchSeconds > 0) return 'progress'
  return 'idle'
}

export function CourseSidebar({ modules, progressMap }: Props) {
  const pathname = usePathname()
  const [openModules, setOpenModules] = useState<Set<string>>(() => {
    const set = new Set<string>()
    if (modules.length > 0) set.add(modules[0].id)
    return set
  })

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const completedLessons = [...progressMap.values()].filter(p => p.isCompleted).length
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const toggle = (id: string) => {
    setOpenModules(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      flexShrink: 0,
      borderRight: '1px solid var(--color-border)',
      background: 'var(--color-bg-subtle)',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Прогрес */}
      <div style={{ padding: 'var(--space-5) var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-medium)' }}>
            Прогрес курсу
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            {completedLessons}/{totalLessons}
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
          {progressPercent}% завершено
        </p>
      </div>

      {/* Модулі */}
      <nav style={{ flex: 1 }}>
        {modules.map((mod, mi) => {
          const isOpen = openModules.has(mod.id)
          const modCompleted = mod.lessons.filter(l => progressMap.get(l.id)?.isCompleted).length
          return (
            <div key={mod.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <button
                onClick={() => toggle(mod.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', gap: 'var(--space-2)',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)',
                    color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {mod.title}
                  </p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    {modCompleted}/{mod.lessons.length} уроків
                  </p>
                </div>
                <span style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}>
                  {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
              </button>

              {isOpen && (
                <div style={{ paddingBottom: 'var(--space-1)' }}>
                  {mod.lessons.map((lesson, li) => {
                    const status = getLessonStatus(lesson.id, li, mi, modules, progressMap)
                    const isActive = pathname === `/course/${lesson.id}`
                    const isLocked = status === 'locked'

                    const content = (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                        padding: 'var(--space-2) var(--space-4) var(--space-2) var(--space-6)',
                        background: isActive ? 'var(--color-accent-subtle)' : 'transparent',
                        cursor: isLocked ? 'default' : 'pointer',
                        opacity: isLocked ? 0.6 : 1,
                        borderLeft: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                        transition: 'background var(--duration-fast)',
                      }}>
                        {/* Статус іконка */}
                        <div className={`lesson-status lesson-status-${status}`}>
                          {status === 'done' && <Check size={10} color="white" strokeWidth={3} />}
                          {status === 'locked' && <Lock size={8} style={{ color: 'var(--color-text-muted)' }} />}
                          {status === 'progress' && <Play size={8} style={{ color: 'var(--color-accent)' }} />}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontSize: 'var(--text-sm)',
                            color: isActive ? 'var(--color-accent-text)' : 'var(--color-text-primary)',
                            fontWeight: isActive ? 'var(--font-medium)' : 'var(--font-normal)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {lesson.title}
                          </p>
                          {lesson.videoDuration && (
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                              <Clock size={10} />
                              {formatDuration(lesson.videoDuration)}
                            </p>
                          )}
                        </div>
                      </div>
                    )

                    return isLocked ? (
                      <div key={lesson.id}>{content}</div>
                    ) : (
                      <Link key={lesson.id} href={`/course/${lesson.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                        {content}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
