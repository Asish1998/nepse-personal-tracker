import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'

export default function TickerTape() {
  const { state } = useApp()
  const [tickerItems, setTickerItems] = useState([])

  useEffect(() => {
    if (!state.holdings || state.holdings.length === 0) return
    
    // Sort by largest gainers/losers to make it interesting
    const items = [...state.holdings]
      .map(h => ({
        sym: h.sym,
        cur: h.cur,
        pc: ((h.cur - (h.prev || h.cur)) / (h.prev || h.cur)) * 100
      }))
      .filter(i => i.cur > 0)
    
    setTickerItems([...items, ...items]) // Duplicate for smooth infinite loop
  }, [state.holdings])

  if (tickerItems.length === 0) return null

  return (
    <div style={styles.container}>
      <div style={styles.track}>
        {tickerItems.map((item, idx) => (
          <div key={idx} style={styles.item}>
            <span style={styles.sym}>{item.sym}</span>
            <span style={{ ...styles.price, color: item.pc >= 0 ? 'var(--profit)' : 'var(--loss)' }}>
              {item.cur}
              <small style={{ fontSize: '9px', marginLeft: '4px' }}>
                {item.pc >= 0 ? '▲' : '▼'}{Math.abs(item.pc).toFixed(2)}%
              </small>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
    overflow: 'hidden',
    background: 'var(--primary)',
    borderBottom: '1px solid var(--border)',
    padding: '8px 0',
    position: 'relative',
    zIndex: 100
  },
  track: {
    display: 'flex',
    width: 'fit-content',
    animation: 'ticker 40s linear infinite',
    whiteSpace: 'nowrap'
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 24px',
    borderRight: '1px solid rgba(255,255,255,0.1)'
  },
  sym: {
    fontWeight: '800',
    fontSize: '12px',
    color: '#94a3b8',
    fontFamily: 'var(--mono)'
  },
  price: {
    fontWeight: '700',
    fontSize: '12px',
    fontFamily: 'var(--mono)'
  }
}
