import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { fmtNPR } from '../../utils/formatters'
import { effectiveBuyCost } from '../../utils/feeEngine'
import TradesTable from './TradesTable'
import PLReport from './PLReport'

export default function JournalManager() {
  const { state } = useApp()
  const [viewMode, setViewMode] = useState('history') // 'history' or 'report'

  // Calculate Stats
  const sellTrades = state.trades.filter(t => t.type === 'SELL')
  const totalProfit = sellTrades.reduce((acc, t) => {
    if (!t.buyPrice) return acc
    const { totalCost: buyBasis } = effectiveBuyCost(t.qty, t.buyPrice)
    return acc + (t.net - buyBasis)
  }, 0)

  const profitableTrades = sellTrades.filter(t => {
    if (!t.buyPrice) return false
    const { totalCost: buyBasis } = effectiveBuyCost(t.qty, t.buyPrice)
    return (t.net - buyBasis) > 0
  })

  const winRate = sellTrades.length > 0 
    ? (profitableTrades.length / sellTrades.length) * 100 
    : 0

  return (
    <div className="journal-container">
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Trading Intelligence Hub</h2>

      {/* Stats Summary */}
      <div style={styles.statsGrid}>
        <StatCard label="Total Realized P/L" value={`NPR ${fmtNPR(totalProfit, 0)}`} sub="All time history" color={totalProfit >= 0 ? 'var(--profit)' : 'var(--loss)'} />
        <StatCard label="Win Rate" value={`${winRate.toFixed(1)}%`} sub={`${profitableTrades.length} / ${sellTrades.length} Wins`} color="var(--primary)" />
        <StatCard label="Total Volume" value={`NPR ${fmtNPR(state.trades.reduce((acc,t) => acc + t.net, 0), 0)}`} sub={`${state.trades.length} Transactions`} color="var(--text-main)" />
      </div>

      <div className="card" style={{ marginTop: 32, padding: viewMode === 'report' ? 0 : 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: viewMode === 'report' ? '24px 24px 0 24px' : 0 }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <button 
              onClick={() => setViewMode('history')} 
              style={{ ...styles.tabLink, ...(viewMode === 'history' ? styles.tabLinkActive : {}) }}
            >
              Transaction Ledger
            </button>
            <button 
              onClick={() => setViewMode('report')} 
              style={{ ...styles.tabLink, ...(viewMode === 'report' ? styles.tabLinkActive : {}) }}
            >
              Master P/L Report
            </button>
          </div>
        </div>
        
        {viewMode === 'history' ? <TradesTable /> : <PLReport />}
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, color }) {
  return (
    <div className="card" style={{ padding: 24, flex: 1 }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.05em' }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color, letterSpacing: '-0.02em', marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
        {sub}
      </div>
    </div>
  )
}

const styles = {
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 },
  tabLink: {
    background: 'none',
    border: 'none',
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '8px 4px',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  tabLinkActive: {
    color: 'var(--primary)',
    borderColor: 'var(--primary)'
  }
}
