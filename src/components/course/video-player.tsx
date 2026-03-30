'use client'

import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  lessonId: string
  userEmail: string
  isCompleted: boolean
}

export function VideoPlayer({ lessonId, userEmail, isCompleted: initialCompleted }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(initialCompleted)
  const [watermarkPos, setWatermarkPos] = useState({ top: '10%', left: '10%' })
  const progressRef = useRef(0)

  // Завантажуємо signed URL
  useEffect(() => {
    fetch(`/api/course/video-token/${lessonId}`)
      .then(r => r.json())
      .then(data => { setSignedUrl(data.url); setLoading(false) })
      .catch(() => setLoading(false))
  }, [lessonId])

  // Переміщення watermark кожні 30 секунд
  useEffect(() => {
    const positions = [
      { top: '8%', left: '8%' },
      { top: '8%', left: '60%' },
      { top: '70%', left: '8%' },
      { top: '70%', left: '60%' },
      { top: '40%', left: '35%' },
    ]
    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % positions.length
      setWatermarkPos(positions[i])
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Трекінг прогресу
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let lastSent = 0
    const handleTimeUpdate = () => {
      const seconds = Math.floor(video.currentTime)
      progressRef.current = seconds

      if (seconds - lastSent >= 10) {
        lastSent = seconds
        const completed = video.duration > 0 && (seconds / video.duration) >= 0.9
        sendProgress(seconds, completed)
        if (completed && !isCompleted) setIsCompleted(true)
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [lessonId, isCompleted])

  async function sendProgress(watchSeconds: number, completed: boolean) {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, watchSeconds, isCompleted: completed }),
    })
  }

  async function markComplete() {
    await sendProgress(progressRef.current, true)
    setIsCompleted(true)
  }

  return (
    <div>
      <div style={{
        position: 'relative',
        background: '#000',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        aspectRatio: '16/9',
      }}>
        {loading ? (
          <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: 0 }} />
        ) : signedUrl ? (
          <video
            ref={videoRef}
            src={signedUrl}
            controls
            controlsList="nodownload"
            onContextMenu={e => e.preventDefault()}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)',
          }}>
            Відео недоступне
          </div>
        )}

        {/* Watermark */}
        {signedUrl && (
          <div style={{
            position: 'absolute',
            top: watermarkPos.top,
            left: watermarkPos.left,
            color: 'rgba(255,255,255,0.25)',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            pointerEvents: 'none',
            userSelect: 'none',
            transition: 'top 0.5s ease, left 0.5s ease',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            whiteSpace: 'nowrap',
          }}>
            {userEmail}
          </div>
        )}
      </div>

      {/* Кнопка завершення */}
      <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end' }}>
        {isCompleted ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            color: 'var(--color-success)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)',
          }}>
            <Check size={16} />
            Урок завершено
          </div>
        ) : (
          <Button variant="secondary" size="sm" onClick={markComplete}>
            <Check size={14} />
            Позначити як завершений
          </Button>
        )}
      </div>
    </div>
  )
}
