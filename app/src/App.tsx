import { useState, useEffect, useCallback } from 'react'
import { loadLesson } from './lessons'
import type { Lesson } from './lessons'
import { LessonPanel } from './components/LessonPanel'
import { Terminal } from './components/Terminal'
import { useProgress } from './hooks/useProgress'

const TOTAL_LESSONS = 8

export default function App() {
  const { progress, setProgress } = useProgress()
  const { lessonIndex, stepIndex, cwd } = progress
  const [lesson, setLesson] = useState<Lesson | null>(null)

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
      <div style={{ color: '#7dd3fc', padding: '2rem', fontFamily: 'monospace' }}>
        <h1>🎉 You did it!</h1>
        <p>You've completed all Claudzooks lessons. You built a web app using the terminal and AI.</p>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: '#0d0d0d',
      color: 'white',
      overflow: 'hidden',
    }}>
      {/* Sidebar */}
      <div style={{
        width: 360,
        borderRight: '1px solid #1f2937',
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        <LessonPanel
          lesson={lesson}
          stepIndex={stepIndex}
          lessonIndex={lessonIndex}
          totalLessons={TOTAL_LESSONS}
          onContinue={advanceStep}
        />
      </div>

      {/* Terminal pane */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Terminal
          key={`${lessonIndex}-${stepIndex}`}
          step={currentStep}
          cwd={cwd}
          onComplete={advance}
        />
      </div>
    </div>
  )
}
