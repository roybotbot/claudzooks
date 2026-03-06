import { useState, useCallback, useEffect, useRef } from 'react'
import { useCommandServer } from '../hooks/useCommandServer'
import type { LessonStep } from '../lessons'

interface HistoryEntry {
  prompt: string
  command: string
  output: string
  annotation?: string
}

interface Props {
  currentStep: LessonStep
  onStepComplete: (newCwd: string) => void
  onAnnotation: (text: string, y: number) => void
}

export function Terminal({ currentStep, onStepComplete, onAnnotation }: Props) {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [input, setInput] = useState('')
  const [currentCwd, setCurrentCwd] = useState('~')
  const [waitingToContinue, setWaitingToContinue] = useState(false)
  const [shake, setShake] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pendingCwd = useRef('~')
  const pendingEntry = useRef<HistoryEntry | null>(null)
  const lastAnnotatedRef = useRef<HTMLDivElement>(null)

  // Refocus input whenever state changes
  useEffect(() => {
    inputRef.current?.focus()
  }, [waitingToContinue, history.length])

  // Scroll to bottom on new output
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, waitingToContinue])

  // After history updates, measure the last annotated entry and emit Y position
  useEffect(() => {
    const last = history[history.length - 1]
    if (last?.annotation && lastAnnotatedRef.current) {
      const rect = lastAnnotatedRef.current.getBoundingClientRect()
      onAnnotation(last.annotation, rect.top)
    }
  }, [history, onAnnotation])

  const handleResponse = useCallback((out: string, newCwd: string, init?: boolean) => {
    if (init) {
      setCurrentCwd(newCwd)
      pendingCwd.current = newCwd
      return
    }
    if (pendingEntry.current) {
      const entry = { ...pendingEntry.current, output: out }
      pendingEntry.current = null
      setHistory(prev => [...prev, entry])
    }
    setCurrentCwd(newCwd)
    pendingCwd.current = newCwd
    setWaitingToContinue(true)
  }, [])

  const { sendCommand, connected } = useCommandServer(handleResponse)

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (waitingToContinue) {
        setWaitingToContinue(false)
        onStepComplete(pendingCwd.current)
        return
      }

      const trimmed = input.trim()
      if (!trimmed) return

      const expected = currentStep.command?.trim()
      if (expected && trimmed !== expected) {
        setShake(true)
        setTimeout(() => setShake(false), 400)
        setInput('')
        return
      }

      if (!connected) return

      pendingEntry.current = {
        prompt: currentCwd,
        command: trimmed,
        output: '',
        annotation: currentStep.annotation,
      }
      setInput('')
      sendCommand(trimmed)
    }
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 10,
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      border: '1px solid #3a3a3a',
    }}>
      {/* Title bar */}
      <div style={{
        background: '#2d2d2d',
        padding: '0 12px',
        height: 36,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
        borderBottom: '1px solid #1a1a1a',
        position: 'relative',
      }}>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
        <span style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#888',
          fontSize: 12,
          fontFamily: '-apple-system, sans-serif',
          pointerEvents: 'none',
        }}>
          bash
        </span>
        {!connected && (
          <span style={{ marginLeft: 'auto', color: '#f87171', fontSize: 11 }}>⚠ connecting...</span>
        )}
      </div>

      {/* Terminal content */}
      <div
        style={{
          flex: 1,
          background: '#1a1a1a',
          padding: '12px 16px',
          overflowY: 'auto',
          fontFamily: '"SF Mono", "Fira Code", "Menlo", monospace',
          fontSize: 13,
          lineHeight: 1.6,
          cursor: 'text',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* History */}
        {history.map((entry, i) => {
          const isLast = i === history.length - 1
          const isAnnotated = !!entry.annotation
          return (
            <div
              key={i}
              style={{ marginBottom: 4 }}
              ref={isLast && isAnnotated ? lastAnnotatedRef : undefined}
            >
              <div>
                <span style={{ color: '#28c840' }}>{entry.prompt}</span>
                <span style={{ color: '#888' }}>$&nbsp;</span>
                <span style={{ color: '#e2e8f0' }}>{entry.command}</span>
              </div>
              {entry.output && (
                <div style={{ color: '#94a3b8', whiteSpace: 'pre-wrap' }}>{entry.output}</div>
              )}
            </div>
          )
        })}

        {/* Press enter to continue */}
        {waitingToContinue && (
          <div style={{ color: '#555', fontStyle: 'italic', marginTop: 4 }}>
            — press enter to continue —
          </div>
        )}

        {/* Current prompt */}
        {!waitingToContinue && (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
            <span style={{ color: '#28c840' }}>{currentCwd}</span>
            <span style={{ color: '#888' }}>$&nbsp;</span>
            <span style={{ color: shake ? '#f87171' : '#e2e8f0', transition: 'color 0.15s' }}>
              {input}
            </span>
            <span style={{
              display: 'inline-block',
              width: 8,
              height: 14,
              background: '#e2e8f0',
              marginLeft: 1,
              verticalAlign: 'middle',
              animation: 'blink 1s step-end infinite',
            }} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Always-present hidden input */}
      <input
        ref={inputRef}
        value={input}
        onChange={e => !waitingToContinue && setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ position: 'fixed', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  )
}
