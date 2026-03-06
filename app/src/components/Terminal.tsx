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

  // Keep focus on hidden input whenever state changes
  useEffect(() => {
    inputRef.current?.focus()
  }, [waitingToContinue, done])

  // Scroll to bottom on new output
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [outputLines, input])

  const pendingCwd = useRef<string>(cwd)

  const handleResponse = useCallback((out: string, newCwd: string, init?: boolean) => {
    if (init) {
      // Just sync the cwd, don't show output or prompt to continue
      setCurrentCwd(newCwd)
      pendingCwd.current = newCwd
      return
    }
    setOutputLines(prev => [...prev, ...(out ? [out] : [])])
    setCurrentCwd(newCwd)
    pendingCwd.current = newCwd
    setWaitingToContinue(true)
  }, [])

  const { sendCommand, connected } = useCommandServer(handleResponse)

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

      if (!connected) return
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
      {/* Connection status */}
      {!connected && (
        <div style={{ color: '#f87171', marginBottom: 8, fontSize: 13 }}>
          ⚠ Connecting to command server...
        </div>
      )}

      {/* Output history */}
      {outputLines.map((line, i) => (
        <div key={i} style={{ color: '#7dd3fc', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
          {line}
        </div>
      ))}

      {/* Always-present hidden input — captures keypresses in all states */}
      <input
        ref={inputRef}
        value={input}
        onChange={e => !waitingToContinue && setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          position: 'fixed',
          opacity: 0,
          pointerEvents: 'none',
          width: 1,
          height: 1,
        }}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

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
