import { useState } from 'react'
import { LessonPanel } from './components/LessonPanel'
import { Terminal } from './components/Terminal'
import { AnnotationPanel } from './components/AnnotationPanel'
import type { Lesson, LessonStep } from './lessons'

// Fake lesson with one of every step type
const DEMO_LESSON: Lesson = {
  title: 'Lesson 1: Navigating the terminal',
  steps: [
    {
      text: 'This is a text-only step. No command required — just read and press Continue.\n\nIt can have multiple paragraphs and explain concepts before asking you to do anything.',
    },
    {
      text: '## pwd — print working directory\n\n`pwd` tells you where you are in the file system. Think of it as asking "where am I right now?"',
      command: 'pwd',
      annotation: 'pwd = print working directory. This is where you are right now in the file system.',
    },
    {
      text: '## ls — list what\'s here\n\n`ls` shows you all the files and folders in your current location.',
      command: 'ls',
      annotation: 'ls lists everything in your current folder — same as opening it in Finder.',
    },
    {
      text: '## ls -la — list everything with details\n\nFlags like `-l` and `-a` modify how commands work.',
      command: 'ls -la',
      annotation: '-l means show details like size and date. -a means show hidden files (starting with a dot).',
    },
    {
      text: '## clear — clean up the screen\n\n`clear` wipes the visible terminal. Your history is still there — just scrolled up.',
      command: 'clear',
      annotation: 'clear wipes the screen. Your history is still there — just scrolled up out of view.',
    },
    {
      text: '## What you learned\n- `pwd` shows where you are\n- `ls` lists files\n- `ls -la` shows details and hidden files\n- `clear` cleans the screen\n\nThat\'s it for this lesson!',
    },
  ],
}

const TOTAL = DEMO_LESSON.steps.length

export default function AllFeatures() {
  const [stepIndex, setStepIndex] = useState(0)
  const [annotation, setAnnotation] = useState<{ text: string; y: number } | null>(null)
  const [done, setDone] = useState(false)

  const currentStep: LessonStep = DEMO_LESSON.steps[stepIndex]

  function advance(newCwd?: string) {
    void newCwd
    if (stepIndex + 1 < TOTAL) {
      setStepIndex(s => s + 1)
    } else {
      setDone(true)
    }
  }

  if (done) {
    return (
      <div style={{ color: '#7dd3fc', padding: '4rem', fontFamily: 'monospace', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: '1rem' }}>🎉</div>
        <h1>Demo complete!</h1>
        <p style={{ marginTop: '1rem' }}>
          <a href="/" style={{ color: '#7dd3fc' }}>← Back to app</a>
          {' · '}
          <button onClick={() => { setStepIndex(0); setDone(false); setAnnotation(null) }}
            style={{ background: 'none', border: 'none', color: '#7dd3fc', cursor: 'pointer', fontSize: 14 }}>
            Restart demo
          </button>
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#111', color: 'white' }}>

      {/* Banner */}
      <div style={{
        background: '#7c3aed',
        color: 'white',
        textAlign: 'center',
        padding: '6px',
        fontSize: 12,
        fontFamily: 'monospace',
        letterSpacing: 1,
        flexShrink: 0,
      }}>
        ✦ ALL FEATURES DEMO — <a href="/" style={{ color: 'white' }}>back to app</a>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: lesson panel */}
        <div style={{
          width: 300,
          flexShrink: 0,
          borderRight: '1px solid #1f2937',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <LessonPanel
            lesson={DEMO_LESSON}
            stepIndex={stepIndex}
            lessonIndex={1}
            totalLessons={8}
            onContinue={() => advance()}
          />
        </div>

        {/* Center: terminal */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          minWidth: 0,
        }}>
          <div style={{ width: '100%', maxWidth: 700, height: '100%' }}>
            <Terminal
              currentStep={currentStep}
              onStepComplete={advance}
              onAnnotation={(text, y) => setAnnotation({ text, y })}
            />
          </div>
        </div>

        {/* Right: annotations */}
        <AnnotationPanel text={annotation?.text ?? null} y={annotation?.y ?? null} />
      </div>
    </div>
  )
}
