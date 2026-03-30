export type UserRole = 'admin' | 'student'

export interface SessionUser {
  id: string
  email: string
  role: UserRole
  fullName: string | null
}

export interface ModuleWithLessons {
  id: string
  title: string
  description: string | null
  position: number
  isPublished: boolean
  lessons: LessonSummary[]
}

export interface LessonSummary {
  id: string
  title: string
  position: number
  isPublished: boolean
  videoDuration: number | null
  videoThumbnail: string | null
}

export interface LessonDetail extends LessonSummary {
  description: string | null
  videoId: string | null
  videoLibraryId: string | null
  attachments: Attachment[]
}

export interface Attachment {
  id: string
  filename: string
  mimeType: string
  sizeBytes: string
  position: number
}

export type LessonStatus = 'idle' | 'progress' | 'done' | 'locked'

export interface LessonWithStatus extends LessonSummary {
  status: LessonStatus
}

export interface ModuleWithStatus {
  id: string
  title: string
  position: number
  isPublished: boolean
  lessons: LessonWithStatus[]
  completedCount: number
  totalCount: number
}
