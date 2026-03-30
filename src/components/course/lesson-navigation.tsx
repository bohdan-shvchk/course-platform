import Link from 'next/link'
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react'

interface Lesson { id: string; title: string }
interface Props {
  lessonId: string
  prevLesson: Lesson | null
  nextLesson: Lesson | null
  isNextLocked: boolean
  isCompleted: boolean
}

export function LessonNavigation({ prevLesson, nextLesson, isNextLocked }: Props) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginTop: 'var(--space-10)', paddingTop: 'var(--space-6)',
      borderTop: '1px solid var(--color-border)',
    }}>
      <div>
        {prevLesson ? (
          <Link href={`/course/${prevLesson.id}`} className="btn btn-secondary btn-md" style={{ textDecoration: 'none' }}>
            <ChevronLeft size={16} />
            <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {prevLesson.title}
            </span>
          </Link>
        ) : <div />}
      </div>

      <div>
        {nextLesson && (
          isNextLocked ? (
            <button disabled className="btn btn-secondary btn-md" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
              <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {nextLesson.title}
              </span>
              <Lock size={14} />
            </button>
          ) : (
            <Link href={`/course/${nextLesson.id}`} className="btn btn-primary btn-md" style={{ textDecoration: 'none' }}>
              <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {nextLesson.title}
              </span>
              <ChevronRight size={16} />
            </Link>
          )
        )}
      </div>
    </div>
  )
}
