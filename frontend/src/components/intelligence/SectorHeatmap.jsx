import { useMemo } from 'react'

const SECTORS = [
  { name: 'Commercial Banks', change: 1.2, weight: 30 },
  { name: 'Development Banks', change: -0.5, weight: 15 },
  { name: 'Finance', change: -2.1, weight: 10 },
  { name: 'Hotels', change: 3.4, weight: 8 },
  { name: 'Microfinance', change: 0.8, weight: 12 },
  { name: 'Hydro Power', change: -1.2, weight: 20 },
  { name: 'Life Insurance', change: 0.3, weight: 5 }
]

export default function SectorHeatmap() {
  const sortedSectors = useMemo(() => {
    return [...SECTORS].sort((a, b) => b.weight - a.weight)
  }, [])

  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>MARKET HEATMAP (SECTORS)</span>
        <span style={styles.live}>LIVE SPREAD</span>
      </div>
      <div style={styles.grid}>
        {sortedSectors.map(s => (
          <div key={s.name} style={{ 
            ...styles.sector, 
            flexBasis: `${s.weight * 2}%`,
            background: s.change >= 0 
              ? `rgba(0, 242, 255, ${Math.min(0.1 + (s.change / 4), 1)})` 
              : `rgba(255, 77, 77, ${Math.min(0.1 + (Math.abs(s.change) / 4), 1)})`,
            borderColor: s.change >= 0 ? 'var(--profit)' : 'var(--loss)'
          }}>
            <div style={styles.name}>{s.name}</div>
            <div style={{ ...styles.change, color: s.change >= 0 ? 'var(--profit)' : 'var(--loss)' }}>
              {s.change >= 0 ? '+' : ''}{s.change}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  card: { padding: '24px', background: 'var(--bg-card)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.08em' },
  live: { fontSize: '9px', fontWeight: '900', color: 'var(--accent)' },
  grid: { 
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: '8px', 
    minHeight: '180px' 
  },
  sector: {
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid transparent',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '120px',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  name: { fontSize: '12px', fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: '4px' },
  change: { fontSize: '14px', fontWeight: '900' }
}
