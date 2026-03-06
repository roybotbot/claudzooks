import { useEffect, useRef, useCallback, useState } from 'react'

type ResponseHandler = (output: string, cwd: string, init?: boolean) => void

export function useCommandServer(onResponse: ResponseHandler) {
  const ws = useRef<WebSocket | null>(null)
  const handler = useRef(onResponse)
  const [connected, setConnected] = useState(false)
  handler.current = onResponse

  useEffect(() => {
    function connect() {
      const socket = new WebSocket('ws://localhost:8765')
      socket.onopen = () => setConnected(true)
      socket.onclose = () => {
        setConnected(false)
        // Retry after 2 seconds
        setTimeout(connect, 2000)
      }
      socket.onerror = () => setConnected(false)
      socket.onmessage = (e) => {
        const { output, cwd, init } = JSON.parse(e.data)
        handler.current(output, cwd, init)
      }
      ws.current = socket
    }
    connect()
    return () => {
      ws.current?.close()
    }
  }, [])

  const sendCommand = useCallback((command: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ command }))
    }
  }, [])

  return { sendCommand, connected }
}
