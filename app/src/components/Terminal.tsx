// @ts-nocheck — opentui intrinsic elements (box, text, input) conflict with React HTML/SVG types
import { useState, useCallback, useRef, useEffect } from 'react'
import { TUI } from '../../../gridland-src/packages/web/src/TUI'
import { useCommandServer } from '../hooks/useCommandServer'
import type { LessonStep } from '../lessons'

// 90s primary silkscreen palette
const C = {
  nearBlack:  '#1A1A1A',
  charcoal:   '#2B2B2B',
  warmGray:   '#7A756C',
  lightGray:  '#C8C3B8',
  offWhite:   '#F2EDE4',
  red:        '#D94032',
  vermillion: '#E24825',
  blue:       '#1A3E78',
  royalBlue:  '#2B5CA6',
  teal:       '#1A7A6D',
  yellow:     '#E8A820',
  goldenrod:  '#D4960B',
}

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
  onWrongCommand?: () => void
}

const FONT_SIZE = 14

export function Terminal({ currentStep, onStepComplete, onAnnotation, onWrongCommand }: Props) {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [currentCwd, setCurrentCwd] = useState('~')
  const [waitingToContinue, setWaitingToContinue] = useState(false)
  const [focused, setFocused] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [errorHint, setErrorHint] = useState<string | null>(null)
  const pendingCwd = useRef('~')
  const pendingAnnotation = useRef<string | undefined>(undefined)
  const pendingCommand = useRef('')
  const pendingPrompt = useRef('~')
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const cellHeightRef = useRef(Math.ceil(FONT_SIZE * 1.2))

  const handleResponse = useCallback((out: string, newCwd: string, init?: boolean) => {
    if (init) {
      setCurrentCwd(newCwd)
      pendingCwd.current = newCwd
      return
    }

    // Skip responses from auto_commands — they run silently
    if (autoCommandsPending.current > 0) {
      autoCommandsPending.current--
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
        prompt: pendingPrompt.current,
        command: pendingCommand.current,
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
    onStepComplete(newCwd)
  }, [onAnnotation, onStepComplete])

  const { sendCommand, connected } = useCommandServer(handleResponse)

  // Run auto_commands silently when a step has them
  const autoCommandsRun = useRef<string | null>(null)
  const autoCommandsPending = useRef(0)
  useEffect(() => {
    if (!currentStep.auto_commands || !connected) return
    const key = currentStep.auto_commands.join('|')
    if (autoCommandsRun.current === key) return
    autoCommandsRun.current = key
    autoCommandsPending.current = currentStep.auto_commands.length
    for (const cmd of currentStep.auto_commands) {
      sendCommand(cmd)
    }
  }, [currentStep, connected, sendCommand])

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
      setErrorHint(`Not quite — try typing: ${expected}`)
      setTimeout(() => setErrorHint(null), 3000)
      onWrongCommand?.()
      return
    }
    setErrorHint(null)

    if (!connected) return

    // clear command: wipe the terminal history
    if (trimmed === 'clear') {
      setHistory([])
      onStepComplete(pendingCwd.current)
      return
    }

    pendingAnnotation.current = currentStep.annotation
    pendingCommand.current = trimmed
    pendingPrompt.current = currentCwd
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
          ? `0 0 20px rgba(43,92,166,0.3), 0 20px 60px rgba(0,0,0,0.6)`
          : '0 20px 60px rgba(0,0,0,0.6)',
        border: focused ? `1px solid rgba(43,92,166,0.4)` : `1px solid ${C.charcoal}`,
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
    >
      {/* HTML Title bar */}
      <div style={{
        background: C.charcoal,
        padding: '0 12px',
        height: 36,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
        borderBottom: `1px solid ${C.nearBlack}`,
        position: 'relative',
      }}>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: C.red, display: 'inline-block' }} />
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: C.yellow, display: 'inline-block' }} />
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: C.teal, display: 'inline-block' }} />
        <span style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          color: C.warmGray,
          fontSize: 12,
          fontFamily: '-apple-system, sans-serif',
          pointerEvents: 'none',
        }}>
          bash
        </span>
        {!connected && (
          <span style={{ marginLeft: 'auto', color: C.vermillion, fontSize: 11 }}>⚠ connecting...</span>
        )}
      </div>

      {/* Gridland TUI canvas */}
      <div ref={canvasContainerRef} style={{ flex: 1 }}>
        <TUI
          style={{ width: '100%', height: '100%' }}
          fontSize={FONT_SIZE}
          autoFocus={true}
          backgroundColor={C.nearBlack}
          onReady={(renderer) => {
            if ('cellHeight' in renderer) {
              cellHeightRef.current = (renderer as any).cellHeight
            }
            const canvas = renderer.canvas
            canvas.addEventListener('focus', () => setFocused(true))
            canvas.addEventListener('blur', () => setFocused(false))
          }}
        >
          <box flexDirection="column" width="100%" padding={1}>
            {/* History */}
            {history.map((entry, i) => (
              <box key={i} flexDirection="column">
                <box>
                  <text>
                    <span style={{ fg: C.teal }}>{entry.prompt}</span>
                    <span style={{ fg: C.warmGray }}>{'$ '}</span>
                    <span style={{ fg: C.offWhite }}>{entry.command}</span>
                  </text>
                </box>
                {entry.output ? entry.output.split('\n').map((line, j) => (
                  <box key={j}>
                    <text fg={C.lightGray}>{line || ' '}</text>
                  </box>
                )) : null}
              </box>
            ))}

            {/* Status / prompt */}
            {(waitingToContinue || !currentStep.command) && (
              <text fg={C.warmGray}>— press enter to continue —</text>
            )}

            {errorHint && (
              <text fg={C.red}>{errorHint}</text>
            )}

            {!waitingToContinue && currentStep.command && (
              <box flexDirection="row">
                <text>
                  <span style={{ fg: C.teal }}>{currentCwd}</span>
                  <span style={{ fg: C.warmGray }}>{'$ '}</span>
                </text>
                <input
                  value={inputValue}
                  onInput={handleInput}
                  onSubmit={handleSubmit}
                  focused
                  textColor={C.offWhite}
                  cursorColor={C.offWhite}
                  cursorStyle="block"
                />
              </box>
            )}

            {/* Hidden input to capture Enter for text-only steps and continue prompts */}
            {(waitingToContinue || !currentStep.command) && (
              <input
                value=""
                onInput={() => {}}
                onSubmit={handleSubmit}
                focused
                textColor={C.nearBlack}
                cursorColor={C.nearBlack}
              />
            )}

            {!focused && currentStep.command && !waitingToContinue && (
              <text fg={C.warmGray} marginTop={1}>click here to type</text>
            )}
          </box>
        </TUI>
      </div>
    </div>
  )
}
