export default function InsightCard({ icon, text }) {
  return (
    <div style={styles.card}>
      <div style={styles.iconBox}>{icon}</div>
      <div style={styles.textBox}>{text}</div>
    </div>
  )
}

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    cursor: 'default',
  },
  iconBox: {
    fontSize: '24px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.05)'
  },
  textBox: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: 'var(--text-main)',
    fontWeight: '500'
  }
}
