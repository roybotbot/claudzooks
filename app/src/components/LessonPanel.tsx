import type { Lesson, LessonStep } from '../lessons'

interface Props {
  lesson: Lesson
  stepIndex: number
  lessonIndex: number
  totalLessons: number
  onContinue?: () => void
}

export function LessonPanel({ lesson, stepIndex, lessonIndex, totalLessons, onContinue }: Props) {
  const step: LessonStep = lesson.steps[stepIndex]
  const isTextOnly = !step.command && !step.action

  return (
    <div style={{
      padding: '2rem',
      fontFamily: 'monospace',
      height: '100%',
      overflowY: 'auto',
      boxSizing: 'border-box',
    }}>
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
          border: '1px solid #1f2937',
        }}>
          <div style={{ color: '#6b7280', fontSize: 11, marginBottom: 6, letterSpacing: 1 }}>
            TYPE THIS IN THE TERMINAL →
          </div>
          <code style={{ color: '#7dd3fc', fontSize: 15 }}>{step.command}</code>
        </div>
      )}

      {isTextOnly && onContinue && (
        <button
          onClick={onContinue}
          style={{
            marginTop: '2rem',
            padding: '0.75rem 1.5rem',
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
      )}
    </div>
  )
}
