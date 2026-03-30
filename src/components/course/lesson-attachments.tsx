import { FileText, Download } from 'lucide-react'
import { formatBytes } from '@/lib/utils'

interface Attachment {
  id: string; filename: string; mimeType: string; sizeBytes: bigint; position: number
}
interface Props { attachments: Attachment[] }

export function LessonAttachments({ attachments }: Props) {
  return (
    <div style={{ marginTop: 'var(--space-8)' }}>
      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
        Матеріали до уроку
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {attachments.map(file => (
          <a
            key={file.id}
            href={`/api/attachments/${file.id}`}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              transition: 'background var(--duration-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-muted)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-bg-subtle)')}
          >
            <FileText size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
              {file.filename}
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              {formatBytes(Number(file.sizeBytes))}
            </span>
            <Download size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
          </a>
        ))}
      </div>
    </div>
  )
}
