import { useEffect, useRef, useCallback, useState } from 'react'

type ResponseHandler = (output: string, cwd: string, init?: boolean) => void

export function useCommandServer(onResponse: ResponseHandler) {
  const ws = useRef<WebSocket | null>(null)
  const handler = useRef(onResponse)
  const [connected, setConnected] = useState(false)
  handler.current = onResponse

  useEffect(() => {
    function connect() {
      const port = window.location.port
      const isDev = window.location.hostname === 'localhost' && port !== '5555'
      const wsUrl = isDev
        ? 'ws://localhost:5555/ws'  // dev mode: any port, server on 5555
        : `ws://${window.location.host}/ws`  // production: same origin
      const socket = new WebSocket(wsUrl)
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
