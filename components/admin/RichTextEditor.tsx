'use client'

import Image from '@tiptap/extension-image'
import { TableKit } from '@tiptap/extension-table'
import { Placeholder } from '@tiptap/extensions'
import { type Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react'
import { uploadImage } from './upload'

type Panel = 'link' | 'image' | null

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const ICONS: Record<string, ReactNode> = {
  bulletList: (
    <>
      <path d="M9 6h12M9 12h12M9 18h12" />
      <circle cx="4" cy="6" r="1.2" fill="currentColor" />
      <circle cx="4" cy="12" r="1.2" fill="currentColor" />
      <circle cx="4" cy="18" r="1.2" fill="currentColor" />
    </>
  ),
  orderedList: (
    <>
      <path d="M10 6h11M10 12h11M10 18h11" />
      <path d="M3.5 4.5L5 4v4M3.5 11h2l-2 2.5h2M3.5 16.5h2v3h-2M3.5 18h1.6" strokeWidth="1.5" />
    </>
  ),
  quote: <path d="M5 17c2 0 3-1.5 3-4V8H4v5h2M15 17c2 0 3-1.5 3-4V8h-4v5h2" />,
  code: <path d="M8 6l-6 6 6 6M16 6l6 6-6 6" />,
  link: (
    <>
      <path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M4 18l5-5 4 4 3-3 4 4" />
    </>
  ),
  table: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M3 15h18M9 4v16M15 4v16" />
    </>
  ),
  rule: <path d="M4 12h16" />,
  undo: <path d="M9 14L4 9l5-5M4 9h10a6 6 0 010 12h-3" />,
  redo: <path d="M15 14l5-5-5-5M20 9H10a6 6 0 000 12h3" />,
  clear: <path d="M5 5l14 14M7 4h11M12 4l-2.5 9M9 20h5" />,
}

function Glyph({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...stroke}>
      {ICONS[name]}
    </svg>
  )
}

function ToolButton({
  label,
  onClick,
  active = false,
  disabled = false,
  children,
}: {
  label: string
  onClick: () => void
  active?: boolean
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className={`tool${active ? ' is-active' : ''}`}
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      // Keep the text selection in the editor when a toolbar button is pressed.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function normalizeUrl(value: string): string {
  const url = value.trim()
  if (!url || /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url)) return url
  return `https://${url}`
}

/* -------------------------------- link panel ------------------------------- */

function LinkPanel({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const current = editor.getAttributes('link') as { href?: string; target?: string | null; rel?: string | null }
  const hasSelection = !editor.state.selection.empty
  const editing = editor.isActive('link')
  const [href, setHref] = useState(current.href ?? '')
  const [text, setText] = useState('')
  const [newTab, setNewTab] = useState(current.target === '_blank')
  const [nofollow, setNofollow] = useState(/\bnofollow\b/.test(current.rel ?? ''))
  const [sponsored, setSponsored] = useState(/\bsponsored\b/.test(current.rel ?? ''))

  const apply = (event: FormEvent) => {
    event.preventDefault()
    const url = normalizeUrl(href)
    if (!url) return
    const rel = [nofollow && 'nofollow', sponsored && 'sponsored', newTab && 'noopener'].filter(Boolean).join(' ')
    const attrs = { href: url, target: newTab ? '_blank' : null, rel: rel || null }
    if (hasSelection || editing) {
      editor.chain().focus().extendMarkRange('link').setLink(attrs).run()
    } else {
      editor
        .chain()
        .focus()
        .insertContent({ type: 'text', text: text.trim() || url, marks: [{ type: 'link', attrs }] })
        .run()
    }
    onClose()
  }

  return (
    <form className="tool-panel" onSubmit={apply}>
      <label className="a-field">
        <span>URL</span>
        <input
          className="a-input"
          type="text"
          inputMode="url"
          placeholder="https://example.com or /blog/another-post"
          value={href}
          onChange={(event) => setHref(event.target.value)}
          autoFocus
        />
      </label>
      {!hasSelection && !editing && (
        <label className="a-field">
          <span>Link text</span>
          <input className="a-input" type="text" value={text} onChange={(event) => setText(event.target.value)} />
        </label>
      )}
      <div className="a-checks">
        <label>
          <input type="checkbox" checked={newTab} onChange={(event) => setNewTab(event.target.checked)} /> Open in new
          tab
        </label>
        <label>
          <input type="checkbox" checked={nofollow} onChange={(event) => setNofollow(event.target.checked)} /> nofollow
        </label>
        <label>
          <input type="checkbox" checked={sponsored} onChange={(event) => setSponsored(event.target.checked)} />{' '}
          sponsored (affiliate)
        </label>
      </div>
      <div className="a-row">
        <button className="a-btn a-btn-primary" type="submit" disabled={!href.trim()}>
          {editing ? 'Update link' : 'Add link'}
        </button>
        {editing && (
          <button
            className="a-btn"
            type="button"
            onClick={() => {
              editor.chain().focus().extendMarkRange('link').unsetLink().run()
              onClose()
            }}
          >
            Remove link
          </button>
        )}
        <button className="a-btn a-btn-quiet" type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  )
}

/* ------------------------------- image panel ------------------------------- */

function ImagePanel({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setError('')
    try {
      setUrl(await uploadImage(file))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Upload failed.')
    } finally {
      setBusy(false)
    }
  }

  const insert = (event: FormEvent) => {
    event.preventDefault()
    const src = normalizeUrl(url)
    if (!src) return
    editor.chain().focus().setImage({ src, alt: alt.trim() }).run()
    onClose()
  }

  return (
    <form className="tool-panel" onSubmit={insert}>
      <label className="a-field">
        <span>Upload an image (JPG, PNG, WebP, AVIF or GIF)</span>
        <input
          className="a-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          disabled={busy}
          onChange={(event) => onFile(event.target.files?.[0])}
        />
      </label>
      <label className="a-field">
        <span>…or paste an image URL</span>
        <input
          className="a-input"
          type="text"
          inputMode="url"
          placeholder="https://"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
      </label>
      <label className="a-field">
        <span>Alt text (describe the image for search engines and screen readers)</span>
        <input className="a-input" type="text" value={alt} maxLength={200} onChange={(event) => setAlt(event.target.value)} />
      </label>
      {error && <p className="a-error">{error}</p>}
      <div className="a-row">
        <button className="a-btn a-btn-primary" type="submit" disabled={busy || !url.trim()}>
          {busy ? 'Uploading…' : 'Insert image'}
        </button>
        <button className="a-btn a-btn-quiet" type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  )
}

/* --------------------------------- editor --------------------------------- */

export function RichTextEditor({
  initialContent,
  onChange,
  invalid = false,
}: {
  initialContent: string
  onChange: (html: string) => void
  invalid?: boolean
}) {
  const [panel, setPanel] = useState<Panel>(null)
  const [sourceMode, setSourceMode] = useState(false)
  const [source, setSource] = useState('')
  const [notice, setNotice] = useState('')
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const editorRef = useRef<Editor | null>(null)

  const insertFiles = async (target: Editor, files: File[]) => {
    for (const file of files) {
      setNotice(`Uploading ${file.name}…`)
      try {
        const src = await uploadImage(file)
        target.chain().focus().setImage({ src, alt: '' }).run()
        setNotice('')
      } catch (cause) {
        setNotice(cause instanceof Error ? cause.message : 'Upload failed.')
      }
    }
  }

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
          // rel/target are chosen per link in the link panel instead of being forced on every link.
          HTMLAttributes: { rel: null, target: null },
        },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      TableKit.configure({ table: { resizable: false } }),
      Placeholder.configure({ placeholder: 'Start writing your post…' }),
    ],
    content: initialContent,
    editorProps: {
      attributes: { class: 'rich-editor', role: 'textbox', 'aria-multiline': 'true', 'aria-label': 'Post content' },
      handlePaste: (_view, event) => {
        // Word processors and spreadsheets put a bitmap of the selection on the clipboard next to
        // the text. Only treat the paste as an image when there is no text to paste.
        const clipboard = event.clipboardData
        if (clipboard?.getData('text/html') || clipboard?.getData('text/plain')) return false
        const files = [...(clipboard?.files ?? [])].filter((file) => file.type.startsWith('image/'))
        if (!files.length || !editorRef.current) return false
        event.preventDefault()
        void insertFiles(editorRef.current, files)
        return true
      },
      handleDrop: (_view, event) => {
        const files = [...(event.dataTransfer?.files ?? [])].filter((file) => file.type.startsWith('image/'))
        if (!files.length || !editorRef.current) return false
        event.preventDefault()
        void insertFiles(editorRef.current, files)
        return true
      },
    },
    onUpdate: ({ editor: instance }) => onChangeRef.current(instance.isEmpty ? '' : instance.getHTML()),
  })

  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  if (!editor) {
    return <div className="editor editor-loading">Loading editor…</div>
  }

  const toggleSource = () => {
    if (sourceMode) {
      editor.commands.setContent(source, { emitUpdate: true })
      setSourceMode(false)
    } else {
      setSource(editor.isEmpty ? '' : editor.getHTML())
      setPanel(null)
      setSourceMode(true)
    }
  }

  const chain = () => editor.chain().focus()
  const inTable = editor.isActive('table')
  const text = editor.getText()
  const words = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <div className={`editor${invalid ? ' is-invalid' : ''}`}>
      <div className="toolbar" role="toolbar" aria-label="Formatting">
        {!sourceMode && (
          <>
            <div className="tool-group">
              {([2, 3, 4] as const).map((level) => (
                <ToolButton
                  key={level}
                  label={`Heading ${level}`}
                  active={editor.isActive('heading', { level })}
                  onClick={() => chain().toggleHeading({ level }).run()}
                >
                  H{level}
                </ToolButton>
              ))}
            </div>
            <div className="tool-group">
              <ToolButton label="Bold" active={editor.isActive('bold')} onClick={() => chain().toggleBold().run()}>
                <b>B</b>
              </ToolButton>
              <ToolButton label="Italic" active={editor.isActive('italic')} onClick={() => chain().toggleItalic().run()}>
                <i>I</i>
              </ToolButton>
              <ToolButton
                label="Underline"
                active={editor.isActive('underline')}
                onClick={() => chain().toggleUnderline().run()}
              >
                <u>U</u>
              </ToolButton>
              <ToolButton label="Strikethrough" active={editor.isActive('strike')} onClick={() => chain().toggleStrike().run()}>
                <s>S</s>
              </ToolButton>
            </div>
            <div className="tool-group">
              <ToolButton
                label="Bullet list"
                active={editor.isActive('bulletList')}
                onClick={() => chain().toggleBulletList().run()}
              >
                <Glyph name="bulletList" />
              </ToolButton>
              <ToolButton
                label="Numbered list"
                active={editor.isActive('orderedList')}
                onClick={() => chain().toggleOrderedList().run()}
              >
                <Glyph name="orderedList" />
              </ToolButton>
              <ToolButton
                label="Quote"
                active={editor.isActive('blockquote')}
                onClick={() => chain().toggleBlockquote().run()}
              >
                <Glyph name="quote" />
              </ToolButton>
              <ToolButton
                label="Code block"
                active={editor.isActive('codeBlock')}
                onClick={() => chain().toggleCodeBlock().run()}
              >
                <Glyph name="code" />
              </ToolButton>
            </div>
            <div className="tool-group">
              <ToolButton
                label="Link"
                active={editor.isActive('link') || panel === 'link'}
                onClick={() => setPanel(panel === 'link' ? null : 'link')}
              >
                <Glyph name="link" />
              </ToolButton>
              <ToolButton label="Image" active={panel === 'image'} onClick={() => setPanel(panel === 'image' ? null : 'image')}>
                <Glyph name="image" />
              </ToolButton>
              <ToolButton
                label="Insert table"
                disabled={inTable}
                onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              >
                <Glyph name="table" />
              </ToolButton>
              <ToolButton label="Divider" onClick={() => chain().setHorizontalRule().run()}>
                <Glyph name="rule" />
              </ToolButton>
            </div>
            <div className="tool-group">
              <ToolButton label="Clear formatting" onClick={() => chain().unsetAllMarks().clearNodes().run()}>
                <Glyph name="clear" />
              </ToolButton>
              <ToolButton label="Undo" disabled={!editor.can().undo()} onClick={() => chain().undo().run()}>
                <Glyph name="undo" />
              </ToolButton>
              <ToolButton label="Redo" disabled={!editor.can().redo()} onClick={() => chain().redo().run()}>
                <Glyph name="redo" />
              </ToolButton>
            </div>
          </>
        )}
        <div className="tool-group tool-group-end">
          <ToolButton label={sourceMode ? 'Back to visual editor' : 'Edit HTML'} active={sourceMode} onClick={toggleSource}>
            {sourceMode ? 'Visual' : 'HTML'}
          </ToolButton>
        </div>
      </div>

      {!sourceMode && inTable && (
        <div className="toolbar toolbar-sub" role="toolbar" aria-label="Table">
          <span className="tool-label">Table</span>
          <ToolButton label="Add row below" onClick={() => chain().addRowAfter().run()}>
            + Row
          </ToolButton>
          <ToolButton label="Add column right" onClick={() => chain().addColumnAfter().run()}>
            + Column
          </ToolButton>
          <ToolButton label="Delete row" onClick={() => chain().deleteRow().run()}>
            − Row
          </ToolButton>
          <ToolButton label="Delete column" onClick={() => chain().deleteColumn().run()}>
            − Column
          </ToolButton>
          <ToolButton label="Toggle header row" onClick={() => chain().toggleHeaderRow().run()}>
            Header
          </ToolButton>
          <ToolButton label="Delete table" onClick={() => chain().deleteTable().run()}>
            Delete table
          </ToolButton>
        </div>
      )}

      {!sourceMode && panel === 'link' && <LinkPanel editor={editor} onClose={() => setPanel(null)} />}
      {!sourceMode && panel === 'image' && <ImagePanel editor={editor} onClose={() => setPanel(null)} />}

      {sourceMode ? (
        <textarea
          className="editor-source"
          aria-label="Post HTML"
          spellCheck={false}
          value={source}
          onChange={(event) => {
            setSource(event.target.value)
            onChangeRef.current(event.target.value)
          }}
        />
      ) : (
        <EditorContent editor={editor} />
      )}

      <div className="editor-foot">
        <span>
          {words.toLocaleString()} words · {Math.max(1, Math.round(words / 220))} min read
        </span>
        <span aria-live="polite">{notice || 'Tip: paste or drop images straight into the editor.'}</span>
      </div>
    </div>
  )
}
