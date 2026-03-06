interface Props {
  text: string | null
}

export function AnnotationPanel({ text }: Props) {
  if (!text) return <div style={{ width: 220, flexShrink: 0 }} />

  return (
    <div style={{
      width: 220,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'flex-end',
      paddingBottom: '3rem',
      paddingLeft: '0.5rem',
    }}>
      <div style={{ position: 'relative' }}>
        {/* Arrow pointing left toward terminal */}
        <div style={{
          position: 'absolute',
          left: -10,
          bottom: 14,
          width: 0,
          height: 0,
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderRight: '10px solid #1e3a5f',
        }} />
        <div style={{
          background: '#1e3a5f',
          border: '1px solid #2563eb',
          borderRadius: 8,
          padding: '10px 14px',
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
