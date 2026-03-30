'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import CodeBlock from '@tiptap/extension-code-block'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import {
  Bold, Italic, Strikethrough, Code, List, ListOrdered,
  Heading1, Heading2, Heading3, Minus, Undo, Redo,
} from 'lucide-react'

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  disabled?: boolean
}

export function RichEditor({ value, onChange, placeholder = 'Почніть писати...', disabled }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, bulletList: false, orderedList: false, codeBlock: false }),
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      CodeBlock,
      HorizontalRule,
      Placeholder.configure({ placeholder }),
    ],
    immediatelyRender: false,
    content: value || '',
    editable: !disabled,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        style: 'outline: none; min-height: 200px; padding: 16px; font-size: var(--text-sm); line-height: var(--leading-relaxed); color: var(--color-text-primary);',
      },
    },
  })

  if (!editor) return null

  const tools: { icon: React.ReactNode; action: () => void; active?: boolean; title: string }[] = [
    { icon: <Heading1 size={14} />, title: 'Заголовок 1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
    { icon: <Heading2 size={14} />, title: 'Заголовок 2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
    { icon: <Heading3 size={14} />, title: 'Заголовок 3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
    { icon: <Bold size={14} />, title: 'Жирний', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { icon: <Italic size={14} />, title: 'Курсив', action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { icon: <Strikethrough size={14} />, title: 'Закреслений', action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike') },
    { icon: <Code size={14} />, title: 'Код', action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive('code') },
    { icon: <List size={14} />, title: 'Список', action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
    { icon: <ListOrdered size={14} />, title: 'Нумерований список', action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
    { icon: <Minus size={14} />, title: 'Розділювач', action: () => editor.chain().focus().setHorizontalRule().run() },
    { icon: <Undo size={14} />, title: 'Назад', action: () => editor.chain().focus().undo().run() },
    { icon: <Redo size={14} />, title: 'Вперед', action: () => editor.chain().focus().redo().run() },
  ]

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--color-bg-base)',
      overflow: 'hidden',
      opacity: disabled ? 0.5 : 1,
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '2px',
        padding: 'var(--space-2)',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-bg-subtle)',
      }}>
        {tools.map((tool, i) => (
          <button
            key={i}
            type="button"
            title={tool.title}
            onMouseDown={e => { e.preventDefault(); tool.action() }}
            disabled={disabled}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '28px', height: '28px',
              border: 'none', borderRadius: 'var(--radius-sm)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              background: tool.active ? 'var(--color-bg-muted)' : 'transparent',
              color: tool.active ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              transition: 'background var(--duration-fast), color var(--duration-fast)',
            }}
            onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg-muted)' }}
            onMouseLeave={e => { if (!tool.active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      <style>{`
        .tiptap p { margin: 0 0 0.5em; }
        .tiptap p:last-child { margin-bottom: 0; }
        .tiptap h1 { font-size: var(--text-2xl); font-weight: var(--font-bold); margin: 0.75em 0 0.25em; }
        .tiptap h2 { font-size: var(--text-xl); font-weight: var(--font-semibold); margin: 0.75em 0 0.25em; }
        .tiptap h3 { font-size: var(--text-lg); font-weight: var(--font-semibold); margin: 0.75em 0 0.25em; }
        .tiptap ul, .tiptap ol { padding-left: 1.5em; margin: 0.5em 0; }
        .tiptap li { margin: 0.25em 0; }
        .tiptap code { background: var(--color-bg-muted); padding: 0.1em 0.3em; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.9em; }
        .tiptap pre { background: var(--color-bg-inverse); color: var(--color-text-inverse); padding: var(--space-4); border-radius: var(--radius-md); overflow-x: auto; margin: 0.75em 0; }
        .tiptap pre code { background: none; padding: 0; color: inherit; }
        .tiptap hr { border: none; border-top: 1px solid var(--color-border); margin: 1em 0; }
        .tiptap p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--color-text-muted); pointer-events: none; float: left; height: 0; }
      `}</style>
    </div>
  )
}
