import { useEffect, useRef, useCallback } from 'react'

type ResponseHandler = (output: string, cwd: string) => void

export function useCommandServer(onResponse: ResponseHandler) {
  const ws = useRef<WebSocket | null>(null)
  const handler = useRef(onResponse)
  handler.current = onResponse

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8765')
    socket.onmessage = (e) => {
      const { output, cwd } = JSON.parse(e.data)
      handler.current(output, cwd)
    }
    ws.current = socket
    return () => socket.close()
  }, [])

  const sendCommand = useCallback((command: string) => {
    ws.current?.send(JSON.stringify({ command }))
  }, [])

  return { sendCommand }
}
