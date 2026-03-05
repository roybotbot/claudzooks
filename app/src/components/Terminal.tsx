import { Box, Text, useInput } from 'ink'
import { InkXterm } from 'ink-web'
import 'ink-web/css'
import { useState, useCallback } from 'react'
import { useCommandServer } from '../hooks/useCommandServer'
import type { LessonStep } from '../lessons'

interface Props {
  step: LessonStep
  cwd: string
  onComplete: (newCwd: string) => void
}

export function Terminal({ step, cwd, onComplete }: Props) {
  const [input, setInput] = useState('')
  const [outputLines, setOutputLines] = useState<string[]>([])
  const [currentCwd, setCurrentCwd] = useState(cwd)
  const [done, setDone] = useState(false)

  const handleResponse = useCallback((out: string, newCwd: string) => {
    setOutputLines(prev => out ? [...prev, out] : prev)
    setCurrentCwd(newCwd)
    setDone(true)
    onComplete(newCwd)
  }, [onComplete])

  const { sendCommand } = useCommandServer(handleResponse)

  useInput((char, key) => {
    if (done) return
    if (key.return) {
      const trimmed = input.trim()
      if (!trimmed) return
      if (!step.command || trimmed === step.command.trim()) {
        sendCommand(trimmed)
        setOutputLines(prev => [...prev, `${currentCwd}$ ${trimmed}`])
        setInput('')
      }
      // wrong command — do nothing, user must try again
    } else if (key.backspace || key.delete) {
      setInput(prev => prev.slice(0, -1))
    } else if (!key.ctrl && !key.meta) {
      setInput(prev => prev + char)
    }
  })

  return (
    <InkXterm focus>
      <Box flexDirection="column" paddingX={1} paddingY={1}>
        {outputLines.map((line, i) => (
          <Text key={i} color="cyan">{line}</Text>
        ))}
        {!done && (
          <Box>
            <Text dimColor>{currentCwd}$ </Text>
            <Text color="white">{input}</Text>
            <Text inverse> </Text>
          </Box>
        )}
      </Box>
    </InkXterm>
  )
}
