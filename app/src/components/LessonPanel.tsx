import { useState } from 'react'
import type { Lesson, LessonStep } from '../lessons'

interface Props {
  lesson: Lesson
  stepIndex: number
  lessonIndex: number
  totalLessons: number
  onContinue?: () => void
  showCommandHint?: boolean
}

// 90s primary silkscreen palette
const C = {
  nearBlack:  '#1A1A1A',
  charcoal:   '#2B2B2B',
  warmGray:   '#7A756C',
  lightGray:  '#C8C3B8',
  offWhite:   '#F2EDE4',
  red:        '#D94032',
  blue:       '#1A3E78',
  royalBlue:  '#2B5CA6',
  teal:       '#1A7A6D',
  yellow:     '#E8A820',
  goldenrod:  '#D4960B',
}

/** Render text with inline `code` styled as monospace with background */
function renderText(text: string) {
  const parts = text.split(/(`[^`]+`)/)
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const code = part.slice(1, -1)
      return (
        <code key={i} style={{
          fontFamily: '"SF Mono", "Fira Code", "Menlo", monospace',
          fontSize: 13,
          background: C.charcoal,
          border: `1px solid ${C.warmGray}44`,
          borderRadius: 4,
          padding: '1px 5px',
          color: C.goldenrod,
        }}>
          {code}
        </code>
      )
    }
    return <span key={i}>{part}</span>
  })
}

/** Render a full block of lesson text with markdown-like formatting */
function renderBlock(text: string) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line === '') {
      elements.push(<div key={i} style={{ height: 12 }} />)
    } else if (line.startsWith('## ')) {
      elements.push(
        <h3 key={i} style={{
          fontSize: 15,
          fontWeight: 600,
          color: C.offWhite,
          margin: '1rem 0 0.25rem 0',
          fontFamily: '-apple-system, "Segoe UI", sans-serif',
        }}>
          {line.slice(3)}
        </h3>
      )
    } else if (line.startsWith('    ')) {
      // Indented code block
      elements.push(
        <div key={i} style={{
          fontFamily: '"SF Mono", "Fira Code", "Menlo", monospace',
          fontSize: 13,
          background: C.charcoal,
          border: `1px solid ${C.warmGray}44`,
          borderRadius: 4,
          padding: '4px 8px',
          margin: '4px 0',
          color: C.goldenrod,
        }}>
          {line.trimStart()}
        </div>
      )
    } else if (line.startsWith('- ')) {
      elements.push(
        <div key={i} style={{ paddingLeft: 12, position: 'relative', lineHeight: 1.7 }}>
          <span style={{ position: 'absolute', left: 0, color: '#7A756C' }}>•</span>
          {renderText(line.slice(2))}
        </div>
      )
    } else {
      elements.push(
        <p key={i} style={{ margin: 0, lineHeight: 1.7 }}>
          {renderText(line)}
        </p>
      )
    }
  }

  return elements
}

export function LessonPanel({ lesson, stepIndex, lessonIndex, totalLessons, onContinue, showCommandHint }: Props) {
  const step: LessonStep = lesson.steps[stepIndex]
  const isTextOnly = !step.command
  const [showNudge, setShowNudge] = useState(false)

  return (
    <div style={{
      fontFamily: '-apple-system, "Segoe UI", sans-serif',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      background: '#222222',
    }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', paddingBottom: isTextOnly && onContinue ? '0.5rem' : '2rem' }}>
        <div style={{ color: '#7A756C', fontSize: 11, marginBottom: '1.5rem', letterSpacing: 1.5, fontWeight: 500 }}>
          LESSON {lessonIndex} OF {totalLessons - 1}
        </div>

        <h2 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: 17, color: '#F2EDE4', fontWeight: 600 }}>
          {lesson.title}
        </h2>

        <div style={{ color: '#7A756C', fontSize: 11, marginBottom: '1.5rem' }}>
          Step {stepIndex + 1} of {lesson.steps.length}
        </div>

        <div style={{ color: '#C8C3B8', fontSize: 14 }}>
          {renderBlock(step.text ?? '')}
        </div>

        {step.action === 'check_claude' && (
          <p style={{ marginTop: '1rem', color: '#E8A820', fontSize: 13 }}>
            We'll check Claude Code later. Press Continue for now.
          </p>
        )}

        {step.command && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#2B2B2B',
            borderRadius: 6,
            border: showCommandHint ? '1px solid rgba(217,64,50,0.5)' : '1px solid #334155',
            boxShadow: showCommandHint ? '0 0 14px rgba(217,64,50,0.25)' : 'none',
            transition: 'border-color 0.3s, box-shadow 0.3s',
          }}>
            <div style={{ color: '#7A756C', fontSize: 10, marginBottom: 6, letterSpacing: 1.5, fontWeight: 500 }}>
              TYPE THIS IN THE TERMINAL →
            </div>
            <code style={{
              fontFamily: '"SF Mono", "Fira Code", "Menlo", monospace',
              color: '#D4960B',
              fontSize: 15,
            }}>
              {step.command}
            </code>
          </div>
        )}
      </div>

      {isTextOnly && onContinue && (
        <div style={{ padding: '1rem 2rem', borderTop: '1px solid #2B2B2B' }}>
          {showNudge && (
            <div style={{
              marginBottom: '0.75rem',
              padding: '8px 12px',
              background: '#1A3E78',
              border: '1px solid #2B5CA6',
              borderRadius: 6,
              color: '#C8C3B8',
              fontSize: 12,
              lineHeight: 1.5,
            }}>
              💡 Try pressing <strong>Enter</strong> in the terminal instead — you're learning to work without a mouse!
            </div>
          )}
          <button
            onClick={() => {
              setShowNudge(true)
              setTimeout(() => setShowNudge(false), 4000)
              if (onContinue) onContinue()
            }}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#2B5CA6',
              color: '#000',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontFamily: '-apple-system, "Segoe UI", sans-serif',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}
