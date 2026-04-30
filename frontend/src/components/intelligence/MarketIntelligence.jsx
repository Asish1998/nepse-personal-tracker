import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { fmtNPR } from '../../utils/formatters'

const features = [
  { icon: '💼', title: 'Quantum Tracking', desc: 'Real-time WACC, P/L and holdings analysis.', key: 'portfolio' },
  { icon: '⚡', title: 'AI Intelligence', desc: 'Neural forecasting and risk assessment.', key: 'intelligence' },
  { icon: '🛠️', title: 'Trading Terminal', desc: 'Integrated journal and smart watchlist.', key: 'hub' },
  { icon: '💰', title: 'Wealth Command', desc: 'Unified asset and budget tracking.', key: 'wealth' },
]

export default function MarketIntelligence({ onNavigate }) {
  const { state } = useApp()

  // Real data derivation where possible
  const portfolioSummary = useMemo(() => {
    const totalValue = state.holdings.reduce((acc, h) => acc + (h.qty * (h.cur || h.buy)), 0)
    const totalGain = state.holdings.reduce((acc, h) => acc + ((h.cur - h.buy) * h.qty || 0), 0)
    const gainPercent = totalValue > 0 ? (totalGain / (totalValue - totalGain)) * 100 : 0
    return { totalValue, totalGain, gainPercent }
  }, [state.holdings])

  // Enhanced Market Simulation
  const marketData = useMemo(() => {
    const indexBase = 2744.45
    const drift = (Math.sin(Date.now() / 50000) * 5)
    return {
      index: indexBase + drift,
      change: -25.81 + drift,
      percentChange: -0.93 + (drift / indexBase * 100),
      status: (drift > 0) ? 'RECOVERY' : 'DECLINE',
      stats: {
        advance: 59 + (drift > 0 ? 10 : -5),
        unchanged: 11,
        decline: 269 - (drift > 0 ? 10 : -5),
      },
      hotStocks: [
        { sym: 'NICA', ltp: 890, change: 12.5, percent: 1.42 },
        { sym: 'SHL', ltp: 450, change: 40.9, percent: 9.98 },
        { sym: 'HDL', ltp: 2150, change: -15, percent: -0.69 },
        { sym: 'HIDCL', ltp: 210, change: 5, percent: 2.44 },
        { sym: 'AKJCL', ltp: 180, change: 2, percent: 1.12 }
      ],
      alerts: [
        { type: 'BUY', sym: 'NTC', price: 920, time: '10:15 AM', signal: 'RSI Bullish Crossover' },
        { type: 'SELL', sym: 'UPPER', price: 410, time: '11:30 AM', signal: 'MACD Bearish Crossover' }
      ]
    }
  }, [state.holdings])

  const isUp = marketData.change >= 0

  return (
    <div style={styles.container}>
      {/* 1. Feature Highlights Row */}
      <div style={styles.featureHighlightGrid}>
        {features.map(f => (
          <div key={f.key} className="card" style={styles.featureMiniCard} onClick={() => onNavigate(f.key)}>
            <div style={styles.miniIconBox}>{f.icon}</div>
            <div>
              <div style={styles.miniTitle}>{f.title}</div>
              <div style={styles.miniDesc}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

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

        {/* Live Signals & Hot Stocks */}
        <div style={styles.rightCol}>
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

          <div className="card" style={styles.sectionCard}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>TOP GAINERS & VOLUME</span>
            </div>
            <div style={styles.hotList}>
              {marketData.hotStocks.map((s, i) => (
                <div key={i} style={styles.hotRow}>
                  <div style={styles.hotSym}>{s.sym}</div>
                  <div style={styles.hotPrice}>{fmtNPR(s.ltp)}</div>
                  <div style={{ ...styles.hotChange, color: s.change >= 0 ? 'var(--profit)' : 'var(--loss)' }}>
                    {s.change > 0 ? '+' : ''}{s.change} ({s.percent}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' },
  featureHighlightGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' },
  featureMiniCard: { display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', cursor: 'pointer', transition: 'var(--transition)' },
  miniIconBox: { width: '44px', height: '44px', background: 'var(--bg-sidebar)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' },
  miniTitle: { fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' },
  miniDesc: { fontSize: '11px', color: 'var(--text-dim)', fontWeight: '600', marginTop: '2px' },
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
  rightCol: { display: 'flex', flexDirection: 'column', gap: '32px' },
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
  hotList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  hotRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderBottom: '1px solid var(--border)' },
  hotSym: { fontWeight: '900', width: '80px', color: 'var(--text-main)' },
  hotPrice: { fontWeight: '800', fontSize: '14px', color: 'var(--text-main)' },
  hotChange: { fontWeight: '800', fontSize: '14px', textAlign: 'right' },
  emptySignals: { padding: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }
}

