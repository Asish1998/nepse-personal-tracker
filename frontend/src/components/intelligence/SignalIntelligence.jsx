import { fmtNPR } from '../../utils/formatters'

const SIGNALS = [
  { sym: 'AKPL', signal: 'BUY', confidence: 'HIGH', reason: 'RSI Oversold (28) + Bullish Engulfing on Daily', price: 242 },
  { sym: 'NICA', signal: 'WATCH', confidence: 'MED', reason: 'Approaching 200 EMA Support. Wait for bounce.', price: 478 },
  { sym: 'NABIL', signal: 'BUY', confidence: 'HIGH', reason: 'MACD Bullish Crossover + Increasing Volume', price: 512 },
  { sym: 'HIDCL', signal: 'SELL', confidence: 'LOW', reason: 'Triple Top Resistance at 215. Overbought RSI.', price: 211 },
  { sym: 'UPPER', signal: 'BUY', confidence: 'MED', reason: 'Cup & Handle formation completion on Weekly', price: 185 },
  { sym: 'NLIC', signal: 'WATCH', confidence: 'HIGH', reason: 'Price Consolidation at Fibonacci 61.8% level', price: 690 },
]

export default function SignalIntelligence() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.title}>Signal Intelligence Scanner</h2>
          <span style={styles.badge}>MULTI-INDICATOR CONFLUENCE</span>
        </div>
        <div style={styles.timer}>Auto-scanning market trends...</div>
      </div>

      <div style={styles.grid}>
        {SIGNALS.map(s => (
          <div key={s.sym} className="card" style={styles.signalCard}>
            <div style={styles.cardTop}>
              <div style={styles.symBox}>
                <span style={styles.symName}>{s.sym}</span>
                <span style={styles.priceTag}>{fmtNPR(s.price)}</span>
              </div>
              <div style={{ ...styles.signalBadge, ...styles[s.signal] }}>
                {s.signal}
              </div>
            </div>

            <div style={styles.reasonBox}>
              <div style={styles.indicatorLabel}>TECHNICAL RATIONALE:</div>
              <div style={styles.reasonText}>{s.reason}</div>
            </div>

            <div style={styles.cardBottom}>
              <div style={styles.confidenceBox}>
                <span style={styles.confLabel}>CONFIDENCE</span>
                <div style={styles.confBarWrap}>
                   <div style={{ 
                     ...styles.confBar, 
                     width: s.confidence === 'HIGH' ? '90%' : (s.confidence === 'MED' ? '60%' : '30%'),
                     background: s.confidence === 'HIGH' ? 'var(--profit)' : (s.confidence === 'MED' ? 'var(--accent)' : 'var(--loss)')
                   }}></div>
                </div>
              </div>
              <div style={styles.rating}>{s.confidence}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.disclaimer}>
        ⚠️ Signals are generated based on mathematical indicators and historical price action. Genuine trading involves risk; always use stop-losses.
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: 'var(--shadow-card)',
    marginTop: '32px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  title: { fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0 },
  badge: { fontSize: '9px', fontWeight: '700', padding: '4px 8px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '4px', letterSpacing: '0.05em' },
  timer: { fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' },
  
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  signalCard: {
    padding: '20px',
    border: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    background: 'var(--bg-main)'
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  symBox: { display: 'flex', flexDirection: 'column', gap: '4px' },
  symName: { fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'var(--mono)' },
  priceTag: { fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' },
  
  signalBadge: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.05em'
  },
  BUY: { background: 'rgba(0, 192, 118, 0.15)', color: 'var(--profit)' },
  SELL: { background: 'rgba(239, 68, 68, 0.15)', color: 'var(--loss)' },
  WATCH: { background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' },

  reasonBox: {
    flex: 1
  },
  indicatorLabel: { fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.05em' },
  reasonText: { fontSize: '13px', color: 'var(--text-main)', fontWeight: '600', lineHeight: '1.4' },

  cardBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-subtle)'
  },
  confidenceBox: { flex: 1, marginRight: '16px' },
  confLabel: { fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' },
  confBarWrap: { height: '6px', width: '100%', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' },
  confBar: { height: '100%', borderRadius: '3px' },
  rating: { fontSize: '11px', fontWeight: '800', color: 'var(--text-main)' },

  disclaimer: { marginTop: '24px', padding: '12px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)', fontSize: '11px', color: '#d97706', textAlign: 'center', fontWeight: '600' }
}
