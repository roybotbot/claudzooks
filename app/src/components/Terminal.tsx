import { useState, useCallback, useEffect, useRef } from 'react'
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
  const [waitingToContinue, setWaitingToContinue] = useState(false)
  const [shake, setShake] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus the hidden input
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Scroll to bottom on new output
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [outputLines, input])

  const pendingCwd = useRef<string>(cwd)

  const handleResponse = useCallback((out: string, newCwd: string) => {
    setOutputLines(prev => [...prev, ...(out ? [out] : [])])
    setCurrentCwd(newCwd)
    pendingCwd.current = newCwd
    setWaitingToContinue(true)
  }, [])

  const { sendCommand } = useCommandServer(handleResponse)

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (done) return

    if (e.key === 'Enter') {
      // Waiting for user to acknowledge output before advancing
      if (waitingToContinue) {
        setWaitingToContinue(false)
        setDone(true)
        onComplete(pendingCwd.current)
        return
      }

      const trimmed = input.trim()
      if (!trimmed) return

      const expected = step.command?.trim()
      if (expected && trimmed !== expected) {
        // Wrong command — shake and clear
        setShake(true)
        setTimeout(() => setShake(false), 400)
        setInput('')
        return
      }

      setOutputLines(prev => [...prev, `${currentCwd}$ ${trimmed}`])
      setInput('')
      sendCommand(trimmed)
    }
  }

  return (
    <div
      style={{
        height: '100%',
        background: '#0d0d0d',
        color: '#e2e8f0',
        fontFamily: '"SF Mono", "Fira Code", monospace',
        fontSize: 14,
        padding: '1rem',
        overflowY: 'auto',
        cursor: 'text',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Output history */}
      {outputLines.map((line, i) => (
        <div key={i} style={{ color: '#7dd3fc', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
          {line}
        </div>
      ))}

      {/* Press enter to continue */}
      {waitingToContinue && (
        <div style={{ color: '#6b7280', marginTop: 8, fontStyle: 'italic' }}>
          press enter to continue...
        </div>
      )}

      {/* Prompt row */}
      {!done && !waitingToContinue && (
        <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1.6 }}>
          <span style={{ color: '#6b7280', marginRight: 6 }}>{currentCwd}$</span>
          <div style={{ position: 'relative', flex: 1 }}>
            {/* Hidden real input */}
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                position: 'absolute',
                opacity: 0,
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                cursor: 'text',
                border: 'none',
                outline: 'none',
              }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            {/* Visible text + cursor */}
            <span
              style={{
                color: shake ? '#f87171' : '#e2e8f0',
                transition: 'color 0.1s',
                display: 'inline-block',
              }}
            >
              {input}
            </span>
            <span
              style={{
                display: 'inline-block',
                width: 9,
                height: 16,
                background: '#7dd3fc',
                verticalAlign: 'middle',
                marginLeft: 1,
                animation: 'blink 1s step-end infinite',
              }}
            />
          </div>
        </div>
      )}

      <div ref={bottomRef} />

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
