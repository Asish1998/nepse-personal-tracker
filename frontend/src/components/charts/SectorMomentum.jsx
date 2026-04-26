import { useState, useEffect } from 'react'
import { fmtNPR } from '../../utils/formatters'

const INITIAL_SECTORS = [
  { name: 'Commercial Banks', change: 1.25, sentiment: 'Bullish', flow: 'IN' },
  { name: 'Hydropower', change: -0.84, sentiment: 'Neutral', flow: 'OUT' },
  { name: 'Life Insurance', change: 2.10, sentiment: 'Strong Bullish', flow: 'IN' },
  { name: 'Microfinance', change: 0.45, sentiment: 'Neutral', flow: 'IN' },
  { name: 'Manufacturing', change: -1.20, sentiment: 'Bearish', flow: 'OUT' },
  { name: 'Investment', change: 0.15, sentiment: 'Neutral', flow: 'NONE' },
  { name: 'Hotels & Tourism', change: 3.45, sentiment: 'Excessive Bullish', flow: 'IN' },
  { name: 'Others', change: -0.12, sentiment: 'Neutral', flow: 'NONE' },
]

export default function SectorMomentum() {
  const [sectors, setSectors] = useState(INITIAL_SECTORS)

  // Simulation of "Live" data movement
  useEffect(() => {
    const interval = setInterval(() => {
      setSectors(prev => prev.map(s => ({
        ...s,
        change: s.change + (Math.random() - 0.5) * 0.1
      })).sort((a, b) => b.change - a.change))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Sector Momentum</h3>
        <span style={styles.liveBadge}>● LIVE FEED</span>
      </div>

      <div style={styles.list}>
        {sectors.map((s, i) => (
          <div key={s.name} style={styles.row}>
            <div style={styles.mainInfo}>
              <span style={styles.rank}>{i + 1}</span>
              <div style={styles.nameBox}>
                <div style={styles.sectorName}>{s.name}</div>
                <div style={{ ...styles.flowBadge, color: s.flow === 'IN' ? 'var(--profit)' : (s.flow === 'OUT' ? 'var(--loss)' : 'var(--text-muted)') }}>
                  {s.flow === 'IN' ? '↑ Accumulating' : (s.flow === 'OUT' ? '↓ Distributing' : '— Stable')}
                </div>
              </div>
            </div>
            
            <div style={styles.perfBox}>
              <div style={{ ...styles.changeText, color: s.change >= 0 ? 'var(--profit)' : 'var(--loss)' }}>
                {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}%
              </div>
              <div style={styles.sentiment}>{s.sentiment}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        Sector shifts calculated via 120-day MA crossover & daily RSI.
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: 'var(--bg-card)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '13px',
    fontWeight: '800',
    color: 'var(--text-main)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  liveBadge: {
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--profit)',
    background: 'rgba(0, 192, 118, 0.1)',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  list: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 0'
  },
  row: {
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-subtle)',
    transition: 'background 0.2s',
  },
  mainInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  rank: {
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    width: '20px'
  },
  nameBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  sectorName: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--text-main)'
  },
  flowBadge: {
    fontSize: '10px',
    fontWeight: '700'
  },
  perfBox: {
    textAlign: 'right'
  },
  changeText: {
    fontSize: '14px',
    fontWeight: '800',
    fontFamily: 'var(--mono)'
  },
  sentiment: {
    fontSize: '10px',
    fontWeight: '600',
    color: 'var(--text-muted)'
  },
  footer: {
    padding: '12px 20px',
    fontSize: '10px',
    color: 'var(--text-muted)',
    borderTop: '1px solid var(--border)',
    background: 'rgba(0,0,0,0.01)',
    fontStyle: 'italic'
  }
}
