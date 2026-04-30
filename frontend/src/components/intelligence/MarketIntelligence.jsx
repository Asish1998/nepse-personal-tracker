import { useApp } from '../../context/AppContext'
import { fmtNPR } from '../../utils/formatters'

export default function MarketIntelligence({ onNavigate }) {
  const { state } = useApp()

  // Mock Market Data (In a real app, this would come from a dedicated market data API or state)
  const marketData = {
    index: 2744.45,
    change: -25.81,
    percentChange: -0.93,
    status: 'DECLINE',
    vol: '12,456,789',
    amt: '4.52B',
    stats: {
      advance: 59,
      unchanged: 11,
      decline: 269,
      posCircuit: 1,
      negCircuit: 0
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

  const isUp = marketData.change >= 0

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Market Intelligence Platform</h1>
          <p style={styles.subtitle}>Apr-29 02:59 PM</p>
        </div>
      </header>

      <div className="market-grid-responsive" style={styles.mainGrid}>
        {/* Market Overview Card */}
        <div className="card overview-card-responsive" style={styles.overviewCard}>
          <div style={styles.sectionTitle}>NEPSE INDEX</div>
          <div style={styles.indexValue} className="indexValue">{marketData.index.toLocaleString()}</div>
          <div style={{ ...styles.indexChange, color: isUp ? 'var(--profit)' : 'var(--loss)' }}>
            {isUp ? '▲' : '▼'} {Math.abs(marketData.change)} ({marketData.percentChange}%)
          </div>
          
          <div style={styles.marketBreadth} className="marketBreadth">
            <div style={styles.breadthItem}>
              <div style={styles.breadthLabel}>ADVANCE</div>
              <div style={{ ...styles.breadthVal, color: 'var(--profit)' }}>{marketData.stats.advance}</div>
            </div>
            <div style={styles.breadthItem}>
              <div style={styles.breadthLabel}>UNCHANGED</div>
              <div style={styles.breadthVal}>{marketData.stats.unchanged}</div>
            </div>
            <div style={styles.breadthItem}>
              <div style={styles.breadthLabel}>DECLINE</div>
              <div style={{ ...styles.breadthVal, color: 'var(--loss)' }}>{marketData.stats.decline}</div>
            </div>
          </div>

          <div style={styles.featureGrid}>
             <button style={styles.featureItem} onClick={() => onNavigate('portfolio')} className="feature-card">
                <span style={styles.featureIcon}>💼</span>
                <div style={styles.featureTextWrapper}>
                  <span style={styles.featureLabel}>Portfolio Manager</span>
                  <span style={styles.featureDesc}>Track real-time WACC, P/L and holdings</span>
                </div>
             </button>
             <button style={styles.featureItem} onClick={() => onNavigate('intelligence')} className="feature-card">
                <span style={styles.featureIcon}>⚡</span>
                <div style={styles.featureTextWrapper}>
                  <span style={styles.featureLabel}>AI Analysis</span>
                  <span style={styles.featureDesc}>Get quantitative insights on your strategy</span>
                </div>
             </button>
             <button style={styles.featureItem} onClick={() => onNavigate('hub')} className="feature-card">
                <span style={styles.featureIcon}>🛠️</span>
                <div style={styles.featureTextWrapper}>
                   <span style={styles.featureLabel}>Trading Hub</span>
                   <span style={styles.featureDesc}>Journal trades and monitor watchlists</span>
                </div>
             </button>
             <button style={styles.featureItem} onClick={() => onNavigate('charts')} className="feature-card">
                <span style={styles.featureIcon}>📊</span>
                <div style={styles.featureTextWrapper}>
                   <span style={styles.featureLabel}>Technical Charts</span>
                   <span style={styles.featureDesc}>Visualize NEPSE daily & historical data</span>
                </div>
             </button>
             <button style={{ ...styles.featureItem, border: '1px solid #fbbf24' }} onClick={() => onNavigate('wealth')} className="feature-card">
                <span style={styles.featureIcon}>💰</span>
                <div style={styles.featureTextWrapper}>
                   <span style={{ ...styles.featureLabel, color: '#d97706' }}>Wealth Manager</span>
                   <span style={styles.featureDesc}>Full financial overview & asset tracking</span>
                </div>
             </button>
          </div>
        </div>

        {/* Live Signals & Hot Stocks */}
        <div style={styles.rightCol}>
          <div className="card" style={styles.sectionCard}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>TRADING SIGNAL ALERTS</span>
              <span style={styles.badge}>WEEKLY SIGNALS SUMMARY</span>
            </div>
            <div style={styles.signalsList}>
               {marketData.alerts.map((a, i) => (
                 <div key={i} style={styles.signalRow}>
                    <div style={{ ...styles.signalType, background: a.type === 'BUY' ? 'rgba(0,192,118,0.1)' : 'rgba(239,68,68,0.1)', color: a.type === 'BUY' ? 'var(--profit)' : 'var(--loss)' }}>{a.type}</div>
                    <div style={styles.signalInfo}>
                      <div style={styles.signalSym}>{a.sym}</div>
                      <div style={styles.signalPrice}>@ {fmtNPR(a.price)}</div>
                    </div>
                    <div style={styles.signalReason}>{a.signal}</div>
                    <div style={styles.signalTime}>{a.time}</div>
                 </div>
               ))}
            </div>
          </div>

          <div className="card" style={styles.sectionCard}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>TOP 5 LIVE HOT STOCKS</span>
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
  container: { display: 'flex', flexDirection: 'column', gap: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' },
  subtitle: { fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', marginTop: '4px' },
  actionBtn: { background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' },
  mainGrid: { display: 'grid', gridTemplateColumns: 'minmax(350px, 450px) 1fr', gap: '24px' },
  overviewCard: { padding: '24px', background: 'var(--bg-card)' },
  sectionTitle: { fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '12px' },
  indexValue: { fontSize: '42px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.04em', lineHeight: 1 },
  indexChange: { fontSize: '18px', fontWeight: '700', marginTop: '8px', marginBottom: '24px' },
  marketMeta: { display: 'flex', gap: '24px', fontSize: '13px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '24px' },
  metaVal: { fontWeight: '700', color: 'var(--text-main)' },
  marketBreadth: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px', textAlign: 'center' },
  breadthItem: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'var(--bg-main)', borderRadius: '12px' },
  breadthLabel: { fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.05em' },
  breadthVal: { fontSize: '24px', fontWeight: '800' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr)', gap: '12px', marginTop: '12px' },
  featureItem: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '20px', 
    padding: '20px', 
    background: 'var(--bg-main)', 
    border: '1px solid var(--border)', 
    borderRadius: '12px', 
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'left'
  },
  featureIcon: { fontSize: '24px', opacity: 0.8 },
  featureTextWrapper: { display: 'flex', flexDirection: 'column', gap: '2px' },
  featureLabel: { fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.01em' },
  featureDesc: { fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: '24px' },
  sectionCard: { padding: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  cardTitle: { fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.1em' },
  badge: { background: 'var(--bg-main)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: '800' },
  signalsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  signalRow: { display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: 'var(--bg-main)', borderRadius: '10px', border: '1px solid var(--border)' },
  signalType: { padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '900' },
  signalInfo: { display: 'flex', flexDirection: 'column', minWidth: '70px' },
  signalSym: { fontWeight: '800', fontSize: '13px' },
  signalPrice: { fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' },
  signalReason: { flex: 1, fontSize: '12px', fontWeight: '600', color: 'var(--text-main)' },
  signalTime: { fontSize: '10px', color: 'var(--text-muted)' },
  hotList: { display: 'flex', flexDirection: 'column', gap: '4px' },
  hotRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid var(--border)' },
  hotSym: { fontWeight: '800', width: '80px', color: 'var(--primary)' },
  hotPrice: { fontWeight: '700', fontSize: '13px', fontFamily: 'var(--mono)' },
  hotChange: { fontWeight: '700', fontSize: '13px', minWidth: '100px', textAlign: 'right' }
}
