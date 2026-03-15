interface Props {
  text: string | null
  y: number | null
}

export function AnnotationPanel({ text, y }: Props) {
  if (!text || y === null) return null

  return (
    <div style={{
      position: 'fixed',
      top: y,
      right: 16,
      width: 200,
      zIndex: 100,
      transition: 'top 0.2s ease',
    }}>
      {/* Arrow pointing left toward terminal */}
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{
          width: 0,
          height: 0,
          borderTop: '7px solid transparent',
          borderBottom: '7px solid transparent',
          borderRight: '8px solid #2563eb',
          marginTop: 10,
          flexShrink: 0,
        }} />
        <div style={{
          background: '#1e3a5f',
          border: '1px solid #2563eb',
          borderRadius: 8,
          padding: '8px 12px',
          color: '#bfdbfe',
          fontSize: 12,
          lineHeight: 1.6,
          fontFamily: '-apple-system, "Segoe UI", sans-serif',
        }}>
          {text}
        </div>
      </div>
    </div>
  )
}
