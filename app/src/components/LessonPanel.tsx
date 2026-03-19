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

export function LessonPanel({ lesson, stepIndex, lessonIndex, totalLessons, onContinue, showCommandHint }: Props) {
  const step: LessonStep = lesson.steps[stepIndex]
  const isTextOnly = !step.command
  const [showNudge, setShowNudge] = useState(false)

  return (
    <div style={{
      fontFamily: 'monospace',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    }}><div style={{ flex: 1, overflowY: 'auto', padding: '2rem', paddingBottom: isTextOnly && onContinue ? '0.5rem' : '2rem' }}>
      <div style={{ color: '#666', fontSize: 12, marginBottom: '1.5rem', letterSpacing: 1 }}>
        LESSON {lessonIndex} OF {totalLessons - 1}
      </div>

      <h2 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: 16, color: '#e2e8f0' }}>
        {lesson.title}
      </h2>

      <div style={{ color: '#555', fontSize: 12, marginBottom: '1.5rem' }}>
        Step {stepIndex + 1} of {lesson.steps.length}
      </div>

      <p style={{
        lineHeight: 1.8,
        whiteSpace: 'pre-wrap',
        color: '#cbd5e1',
        fontSize: 14,
        margin: 0,
      }}>
        {step.text ?? ''}
      </p>

      {step.action === 'check_claude' && (
        <p style={{ marginTop: '1rem', color: '#fbbf24', fontSize: 13 }}>
          We'll check Claude Code later. Press Continue for now.
        </p>
      )}

      {step.command && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#111827',
          borderRadius: 6,
          border: showCommandHint ? '1px solid rgba(239,68,68,0.5)' : '1px solid #1f2937',
          boxShadow: showCommandHint ? '0 0 14px rgba(239,68,68,0.25)' : 'none',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}>
          <div style={{ color: '#6b7280', fontSize: 11, marginBottom: 6, letterSpacing: 1 }}>
            TYPE THIS IN THE TERMINAL →
          </div>
          <code style={{ color: '#7dd3fc', fontSize: 15 }}>{step.command}</code>
        </div>
      )}

      </div>

      {isTextOnly && onContinue && (
        <div style={{ padding: '1rem 2rem', borderTop: '1px solid #1f2937' }}>
          {showNudge && (
            <div style={{
              marginBottom: '0.75rem',
              padding: '8px 12px',
              background: '#1e3a5f',
              border: '1px solid #2563eb',
              borderRadius: 6,
              color: '#bfdbfe',
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
              background: '#7dd3fc',
              color: '#000',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: 14,
              fontWeight: 'bold',
            }}
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}
