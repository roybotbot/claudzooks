import { useState, useEffect, useCallback } from 'react'
import { loadLesson } from './lessons'
import type { Lesson } from './lessons'
import { LessonPanel } from './components/LessonPanel'
import { Terminal } from './components/Terminal'
import { AnnotationPanel } from './components/AnnotationPanel'
import { useProgress } from './hooks/useProgress'

const TOTAL_LESSONS = 8

export default function App() {
  const { progress, setProgress } = useProgress()
  const { lessonIndex, stepIndex, cwd } = progress
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [annotation, setAnnotation] = useState<string | null>(null)

  useEffect(() => {
    setLesson(null)
    loadLesson(lessonIndex).then(setLesson)
  }, [lessonIndex])

  const advance = useCallback((newCwd: string) => {
    setProgress(prev => {
      if (!lesson) return prev
      const nextStep = prev.stepIndex + 1
      if (nextStep < lesson.steps.length) {
        return { ...prev, stepIndex: nextStep, cwd: newCwd }
      } else if (prev.lessonIndex + 1 < TOTAL_LESSONS) {
        return { lessonIndex: prev.lessonIndex + 1, stepIndex: 0, cwd: newCwd }
      }
      return prev
    })
  }, [lesson, setProgress])

  const advanceStep = useCallback(() => advance(cwd), [advance, cwd])

  const handleAnnotation = useCallback((text: string) => {
    setAnnotation(text)
  }, [])

  if (!lesson) {
    return (
      <div style={{ color: '#7dd3fc', padding: '2rem', fontFamily: 'monospace' }}>
        Loading...
      </div>
    )
  }

  const currentStep = lesson.steps[stepIndex]

  if (lessonIndex >= TOTAL_LESSONS) {
    return (
      <div style={{ color: '#7dd3fc', padding: '4rem', fontFamily: 'monospace', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ marginBottom: '1rem' }}>You did it!</h1>
        <p>You've completed all Claudzooks lessons and built a web app using the terminal and AI.</p>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: '#111',
      color: 'white',
      overflow: 'hidden',
    }}>
      {/* Left: lesson instructions */}
      <div style={{
        width: 300,
        flexShrink: 0,
        borderRight: '1px solid #1f2937',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <LessonPanel
          lesson={lesson}
          stepIndex={stepIndex}
          lessonIndex={lessonIndex}
          totalLessons={TOTAL_LESSONS}
          onContinue={advanceStep}
        />
      </div>

      {/* Center: terminal window */}
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
            onAnnotation={handleAnnotation}
          />
        </div>
      </div>

      {/* Right: annotations */}
      <AnnotationPanel text={annotation} />
    </div>
  )
}
