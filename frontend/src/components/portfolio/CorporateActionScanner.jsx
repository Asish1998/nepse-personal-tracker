import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { fmtNPR } from '../../utils/formatters'

// Mock Data for NEPSE Corporate Actions
const MOCK_ACTIONS = [
  { sym: 'NICA', type: 'BONUS', rate: 0.15, date: '2024-04-15', status: 'PENDING' },
  { sym: 'AKPL', type: 'DIVIDEND', rate: 0.10, date: '2024-04-20', status: 'PENDING' },
  { sym: 'HRL', type: 'BONUS', rate: 0.05, date: '2024-04-25', status: 'PENDING' },
  { sym: 'NTC', type: 'DIVIDEND', rate: 0.40, date: '2024-05-10', status: 'ANNOUNCED' },
]

export default function CorporateActionScanner() {
  const { state, dispatch } = useApp()
  const holdings = state.holdings || []
  const [detected, setDetected] = useState([])

  useEffect(() => {
    // Scan holdings against corporate actions
    const matches = MOCK_ACTIONS.filter(action => 
      holdings.some(h => h.sym.toUpperCase() === action.sym.toUpperCase())
    )
    setDetected(matches)
  }, [holdings])

  const applyAction = (action) => {
    const holding = holdings.find(h => h.sym.toUpperCase() === action.sym.toUpperCase())
    if (!holding) return

    if (action.type === 'BONUS') {
      const bonusShares = Math.floor(holding.qty * action.rate)
      const updates = {
        qty: holding.qty + bonusShares,
        // WACC logic: investment remains same, qty increases, so buy rate drops
        buy: (holding.qty * holding.buy) / (holding.qty + bonusShares)
      }
      dispatch({ type: 'UPDATE_HOLDING', payload: { id: holding.id, updates } })
      alert(`Applied ${bonusShares} Bonus Shares for ${action.sym}. Your WACC has been recalculated.`)
    } else {
      const divAmount = (holding.qty * 100) * action.rate // Dividend is usually on par value 100
      const updates = {
        dividends: (parseFloat(holding.dividends) || 0) + divAmount
      }
      dispatch({ type: 'UPDATE_HOLDING', payload: { id: holding.id, updates } })
      alert(`Recorded NPR ${fmtNPR(divAmount)} Cash Dividend for ${action.sym}. Added to your wealth record.`)
    }
    
    setDetected(prev => prev.filter(p => p !== action))
  }

  if (detected.length === 0) return null

  return (
    <div className="card" style={styles.container}>
      <div style={styles.header}>
        <div style={styles.icon}>📢</div>
        <div>
          <h3 style={styles.title}>Corporate Action Alerts</h3>
          <p style={styles.subtitle}>Automatic detection of Dividends & Bonus shares for your holdings.</p>
        </div>
      </div>

      <div style={styles.list}>
        {detected.map((action, i) => (
          <div key={i} style={styles.item}>
            <div style={styles.itemInfo}>
              <span style={styles.sym}>{action.sym}</span>
              <span style={styles.tag}>{action.type}</span>
              <span style={styles.rate}>{(action.rate * 100).toFixed(1)}%</span>
            </div>
            <button 
              className="btn-accent" 
              style={styles.btn}
              onClick={() => applyAction(action)}
            >
              Apply to Portfolio
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '20px', marginBottom: '24px', border: '1px solid var(--accent)', background: 'rgba(99, 102, 241, 0.05)' },
  header: { display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' },
  icon: { fontSize: '24px', background: 'var(--bg-main)', padding: '10px', borderRadius: '12px' },
  title: { fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0 },
  subtitle: { fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)' },
  itemInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  sym: { fontWeight: '800', color: 'var(--primary)', fontFamily: 'var(--mono)' },
  tag: { fontSize: '10px', fontWeight: '800', background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '4px' },
  rate: { fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' },
  btn: { padding: '6px 12px', fontSize: '12px' }
}
