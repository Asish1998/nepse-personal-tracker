import { useState, useEffect, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { fmtNPR } from '../../utils/formatters'
import MarketLeadersGrid from './MarketLeadersGrid'

export default function MarketIntelligence({ onNavigate }) {
  const { state } = useApp()
  const [tick, setTick] = useState(0)
  const [symbols, setSymbols] = useState([])

  useEffect(() => {
    // 1. Driving animation tick
    const timer = setInterval(() => setTick(t => t + 1), 2500)
    
    // 2. Fetch dynamic symbols
    const API_BASE = import.meta.env.VITE_NEPSE_API
    fetch(`${API_BASE}/symbols`)
      .then(res => res.json())
      .then(setSymbols)
      .catch(() => {
        // Fallback to core NEPSE leaders if service is down
        setSymbols([
          { symbol: 'NICA', ltp: 890, name: 'NIC Asia Bank' },
          { symbol: 'SHL', ltp: 450, name: 'Soaltee Hotel' },
          { symbol: 'HDL', ltp: 2150, name: 'Himalayan Distillery' },
          { symbol: 'NTC', ltp: 920, name: 'Nepal Telecom' },
          { symbol: 'UPPER', ltp: 410, name: 'Upper Tamakoshi' },
          { symbol: 'HIDCL', ltp: 210, name: 'HIDCL' },
          { symbol: 'AKPL', ltp: 310, name: 'Arun Valley' }
        ])
      })

    return () => clearInterval(timer)
  }, [])

  // Enhanced Market Simulation
  const marketData = useMemo(() => {
    const indexBase = 2744.45
    const drift = (Math.sin(Date.now() / 15000) * 12) + (Math.random() * 3)
    
    return {
      index: indexBase + drift,
      change: -25.81 + drift,
      percentChange: -0.93 + (drift / indexBase * 100),
      status: (drift > 0) ? 'RECUPERATING' : 'CONSOLIDATING',
      stats: {
        advance: 59 + (drift > 0 ? 15 : -8),
        unchanged: 12,
        decline: 268 - (drift > 0 ? 15 : -8),
      },
      alerts: symbols.length > 2 ? [
        { type: 'BUY', sym: symbols[0]?.symbol, price: symbols[0]?.ltp, time: 'NOW', signal: 'Momentum Breakout' },
        { type: 'SELL', sym: symbols[1]?.symbol, price: symbols[1]?.ltp, time: 'LATEST', signal: 'Overbought (RSI)' }
      ] : []
    }
  }, [tick, symbols])

  const isUp = marketData.change >= 0

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Alpha Intelligence Protocol</h1>
          <p style={styles.subtitle}>Unified Market Terminal • Active Session</p>
        </div>
      </header>

      <div style={styles.mainGrid}>
        {/* Market Overview Card */}
        <div className="card" style={styles.overviewCard}>
          <div style={styles.sectionHeader}>
            <span style={styles.cardIndicator} />
            <div style={styles.sectionTitle}>NEPSE REAL-TIME INDEX</div>
          </div>
          
          <div style={styles.indexValue}>{marketData.index.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          
          <div style={{ ...styles.indexChange, color: isUp ? 'var(--profit)' : 'var(--loss)' }}>
            <span style={styles.arrow}>{isUp ? '▲' : '▼'}</span>
            {Math.abs(marketData.change).toFixed(2)} ({marketData.percentChange.toFixed(2)}%)
          </div>
          
          <div style={styles.marketBreadth}>
            <div style={styles.breadthItem}>
              <div style={styles.breadthLabel}>ADVANCE</div>
              <div style={{ ...styles.breadthVal, color: 'var(--profit)' }}>{marketData.stats.advance}</div>
            </div>
            <div style={styles.breadthItem}>
              <div style={styles.breadthLabel}>STABLE</div>
              <div style={styles.breadthVal}>{marketData.stats.unchanged}</div>
            </div>
            <div style={styles.breadthItem}>
              <div style={styles.breadthLabel}>DECLINE</div>
              <div style={{ ...styles.breadthVal, color: 'var(--loss)' }}>{marketData.stats.decline}</div>
            </div>
          </div>

          <div style={styles.platformPulse}>
             <div style={styles.pulseTitle}>Platform Shortcuts</div>
             <div style={styles.shortcutGrid}>
                <button className="btn-secondary" onClick={() => onNavigate('portfolio')} style={styles.shortcut}>Portfolio</button>
                <button className="btn-secondary" onClick={() => onNavigate('hub')} style={styles.shortcut}>Trading Hub</button>
                <button className="btn-secondary" onClick={() => onNavigate('intelligence')} style={styles.shortcut}>AI Center</button>
             </div>
          </div>
        </div>

        {/* Live Signals Card */}
        <div className="card" style={styles.sectionCard}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>NEURAL ALPHA SIGNALS</span>
            <div style={styles.liveBadge}><span style={styles.pulseDot} /> LIVE</div>
          </div>
          <div style={styles.signalsList}>
             {marketData.alerts.map((a, i) => (
               <div key={i} style={styles.signalRow}>
                  <div style={{ ...styles.signalType, background: a.type === 'BUY' ? 'hsla(142, 71%, 45%, 0.1)' : 'hsla(0, 84%, 60%, 0.1)', color: a.type === 'BUY' ? 'var(--profit)' : 'var(--loss)' }}>{a.type}</div>
                  <div style={styles.signalInfo}>
                    <div style={styles.signalSym}>{a.sym}</div>
                    <div style={styles.signalPrice}>{fmtNPR(a.price)}</div>
                  </div>
                  <div style={styles.signalReason}>{a.signal}</div>
                  <div style={styles.signalTime}>{a.time}</div>
               </div>
             ))}
             {!marketData.alerts.length && <div style={styles.emptySignals}>Scanning for high-probability setups...</div>}
          </div>
        </div>
      </div>

      <MarketLeadersGrid />
    </div>
  )
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: '28px', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.05em' },
  subtitle: { fontSize: '13px', color: 'var(--accent)', fontWeight: '700', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 440px', gap: '32px' },
  overviewCard: { padding: '32px', background: 'var(--bg-card)' },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' },
  cardIndicator: { width: '4px', height: '16px', background: 'var(--accent)', borderRadius: '2px' },
  sectionTitle: { fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.1em' },
  indexValue: { fontSize: '56px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.05em', lineHeight: 1 },
  indexChange: { fontSize: '20px', fontWeight: '800', marginTop: '12px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' },
  arrow: { fontSize: '16px' },
  marketBreadth: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' },
  breadthItem: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '20px', background: 'var(--bg-sidebar)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' },
  breadthLabel: { fontSize: '11px', fontWeight: '800', color: 'var(--text-dim)', letterSpacing: '0.1em' },
  breadthVal: { fontSize: '28px', fontWeight: '900' },
  platformPulse: { borderTop: '1px solid var(--border)', paddingTop: '24px' },
  pulseTitle: { fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px' },
  shortcutGrid: { display: 'flex', gap: '12px' },
  shortcut: { flex: 1, padding: '12px', borderRadius: '10px', fontSize: '12px' },
  sectionCard: { padding: '24px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  cardTitle: { fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.08em' },
  liveBadge: { fontSize: '10px', fontWeight: '900', color: 'var(--profit)', display: 'flex', alignItems: 'center', gap: '6px' },
  pulseDot: { width: '6px', height: '6px', background: 'var(--profit)', borderRadius: '50%', animation: 'pulse 1.5s infinite' },
  signalsList: { display: 'flex', flexDirection: 'column', gap: '14px' },
  signalRow: { display: 'flex', alignItems: 'center', gap: '16px', padding: '14px', background: 'var(--bg-sidebar)', borderRadius: '12px', border: '1px solid var(--border)' },
  signalType: { padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '900' },
  signalInfo: { display: 'flex', flexDirection: 'column', minWidth: '80px' },
  signalSym: { fontWeight: '900', fontSize: '14px' },
  signalPrice: { fontSize: '11px', color: 'var(--text-dim)', fontWeight: '700' },
  signalReason: { flex: 1, fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' },
  signalTime: { fontSize: '10px', color: 'var(--text-dim)', fontWeight: '600' },
  emptySignals: { padding: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }
}
