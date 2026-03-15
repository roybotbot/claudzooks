import { useState, useEffect } from 'react'

interface Progress {
  lessonIndex: number
  stepIndex: number
  cwd: string
}

const DEFAULT: Progress = { lessonIndex: 0, stepIndex: 0, cwd: '~' }

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => {
    try {
      const saved = localStorage.getItem('claudzooks-progress')
      return saved ? JSON.parse(saved) : DEFAULT
    } catch {
      return DEFAULT
    }
  })

  useEffect(() => {
    localStorage.setItem('claudzooks-progress', JSON.stringify(progress))
  }, [progress])

  return { progress, setProgress }
}
