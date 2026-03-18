// @ts-nocheck — opentui intrinsic elements (box, text, input) conflict with React HTML/SVG types
import { useState, useCallback, useRef } from 'react'
import { TUI } from '../../../gridland-src/packages/web/src/TUI'
import { useCommandServer } from '../hooks/useCommandServer'
import type { LessonStep } from '../lessons'

interface HistoryEntry {
  prompt: string
  command: string
  output: string
  annotation?: string
  startRow: number
}

interface Props {
  currentStep: LessonStep
  onStepComplete: (newCwd: string) => void
  onAnnotation: (text: string, y: number) => void
}

const FONT_SIZE = 14

export function Terminal({ currentStep, onStepComplete, onAnnotation }: Props) {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [currentCwd, setCurrentCwd] = useState('~')
  const [waitingToContinue, setWaitingToContinue] = useState(false)
  const [focused, setFocused] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const pendingCwd = useRef('~')
  const pendingAnnotation = useRef<string | undefined>(undefined)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const cellHeightRef = useRef(Math.ceil(FONT_SIZE * 1.2))

  const handleResponse = useCallback((out: string, newCwd: string, init?: boolean) => {
    if (init) {
      setCurrentCwd(newCwd)
      pendingCwd.current = newCwd
      return
    }

    const annotation = pendingAnnotation.current
    pendingAnnotation.current = undefined

    setHistory(prev => {
      const startRow = prev.reduce((sum, entry) => {
        const outputLines = entry.output ? entry.output.split('\n').length : 0
        return sum + 1 + outputLines
      }, 0)

      const entry: HistoryEntry = {
        prompt: currentCwd,
        command: inputValue,
        output: out,
        annotation,
        startRow,
      }

      if (annotation && canvasContainerRef.current) {
        const canvasTop = canvasContainerRef.current.getBoundingClientRect().top
        const y = canvasTop + (startRow * cellHeightRef.current)
        setTimeout(() => onAnnotation(annotation, y), 0)
      }

      return [...prev, entry]
    })

    setCurrentCwd(newCwd)
    pendingCwd.current = newCwd
    setWaitingToContinue(true)
  }, [currentCwd, inputValue, onAnnotation])

  const { sendCommand, connected } = useCommandServer(handleResponse)

  const handleSubmit = useCallback((value: string) => {
    if (waitingToContinue) {
      setWaitingToContinue(false)
      onStepComplete(pendingCwd.current)
      return
    }

    if (!currentStep.command) {
      onStepComplete(pendingCwd.current)
      return
    }

    const trimmed = value.trim()
    if (!trimmed) return

    const expected = currentStep.command.trim()
    if (trimmed !== expected) {
      setInputValue('')
      return
    }

    if (!connected) return

    pendingAnnotation.current = currentStep.annotation
    setInputValue('')
    sendCommand(trimmed)
  }, [waitingToContinue, currentStep, connected, onStepComplete, sendCommand])

  const handleInput = useCallback((value: string) => {
    if (!waitingToContinue) {
      setInputValue(value)
    }
  }, [waitingToContinue])

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 10,
        overflow: 'hidden',
        boxShadow: focused
          ? '0 0 20px rgba(59,130,246,0.25), 0 20px 60px rgba(0,0,0,0.6)'
          : '0 20px 60px rgba(0,0,0,0.6)',
        border: focused ? '1px solid rgba(59,130,246,0.35)' : '1px solid #3a3a3a',
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
    >
      {/* HTML Title bar */}
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

      {/* Gridland TUI canvas */}
      <div ref={canvasContainerRef} style={{ flex: 1 }}>
        <TUI
          style={{ width: '100%', height: '100%' }}
          fontSize={FONT_SIZE}
          autoFocus={true}
          backgroundColor="#1a1a1a"
          onReady={(renderer) => {
            if ('cellHeight' in renderer) {
              cellHeightRef.current = (renderer as any).cellHeight
            }
            const canvas = renderer.canvas
            canvas.addEventListener('focus', () => setFocused(true))
            canvas.addEventListener('blur', () => setFocused(false))
          }}
        >
          <box flexDirection="column" width="100%" height="100%" padding={1}>
            {/* History */}
            {history.map((entry, i) => (
              <box key={i} flexDirection="column">
                <text>
                  <span style={{ fg: '#28c840' }}>{entry.prompt}</span>
                  <span style={{ fg: '#888888' }}>{'$ '}</span>
                  <span style={{ fg: '#e2e8f0' }}>{entry.command}</span>
                </text>
                {entry.output ? (
                  <text fg="#94a3b8">{entry.output}</text>
                ) : null}
              </box>
            ))}

            {/* Status / prompt */}
            {waitingToContinue ? (
              <text fg="#555555">— press enter to continue —</text>
            ) : !currentStep.command ? (
              <text fg="#555555">— press enter to continue —</text>
            ) : (
              <box flexDirection="row">
                <text>
                  <span style={{ fg: '#28c840' }}>{currentCwd}</span>
                  <span style={{ fg: '#888888' }}>{'$ '}</span>
                </text>
                <input
                  value={inputValue}
                  onInput={handleInput}
                  onSubmit={handleSubmit}
                  focused={true}
                  textColor="#e2e8f0"
                  cursorColor="#e2e8f0"
                  cursorStyle={{ style: 'block', blinking: true }}
                />
              </box>
            )}

            {!focused && (
              <text fg="#444444" marginTop={1}>click here to type</text>
            )}
          </box>
        </TUI>
      </div>
    </div>
  )
}
