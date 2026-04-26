import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext'

function IntelligenceCard({ holding }) {
  const { sym, qty, buy, cur, date, tradeCategory, stopLoss, profitTarget } = holding
  
  const pnl = (cur - buy) * qty
  const pnlPct = ((cur - buy) / buy) * 100
  const isLoss = pnl < 0

  const buyDate = new Date(date)
  const today = new Date()
  const daysHeld = Math.floor((today - buyDate) / (1000 * 60 * 60 * 24))

  const suggestion = useMemo(() => {
    let type = tradeCategory === 'Trading' ? 'TRADING' : 'INVESTMENT'
    let sentiment = 'NEUTRAL'
    let action = 'HOLD'
    let rationale = ''
    let entryQuality = 'NEUTRAL'
    let strategyAdvice = 'STAY PATIENT'

    // 1. Determine Entry Quality based on time vs pnl
    if (pnlPct > 10 && daysHeld < 15) {
      entryQuality = 'SNIPER ENTRY 🎯'; strategyAdvice = 'PYRAMID UP (Add small)'
    } else if (pnlPct > 20 && daysHeld > 60) {
      entryQuality = 'PERFECT TIMING ⭐'; strategyAdvice = 'LONG TERM HOLD'
    } else if (isLoss && daysHeld > 90) {
      entryQuality = 'UNDERPERFORMING ⚠️'; strategyAdvice = 'CONSIDER EXIT'
    } else if (isLoss && daysHeld < 10) {
      entryQuality = 'INITIAL VOLATILITY'; strategyAdvice = 'WATCH CLOSELY'
    } else if (pnlPct > 0 && pnlPct < 5 && daysHeld > 180) {
      entryQuality = 'OPPORTUNITY COST'; strategyAdvice = 'SWITCH TO MOMENTUM'
    } else if (pnlPct < -15) {
      entryQuality = 'LATE ENTRY 🔴'; strategyAdvice = 'AVERAGE DOWN OR EXIT'
    } else {
      entryQuality = 'STABLE ENTRY'; strategyAdvice = 'MAINTAIN'
    }

    // 2. Action Logic
    if (type === 'TRADING') {
      if (stopLoss && cur <= stopLoss) {
        sentiment = 'BEARISH'; action = 'EXIT POSITION'; rationale = `Price hit Stop Loss. Execution error likely.`
      } else if (profitTarget && cur >= profitTarget) {
        sentiment = 'BULLISH'; action = 'TAKE PROFIT'; rationale = `Target reached. Don't be greedy.`
      } else if (pnlPct < -10) {
        sentiment = 'BEARISH'; action = 'REVIEW'; rationale = 'Entry is underwater. Re-evaluate support levels.'
      } else {
        sentiment = 'BULLISH'; action = 'HOLD'; rationale = 'Position is breathing. Targets are still valid.'
      }
    } else {
      if (daysHeld < 30) {
        rationale = 'Asset accumulation phase. Ignore daily price noise.'
      } else if (pnlPct > 50) {
        sentiment = 'BULLISH'; rationale = 'High-conviction winner. Keep as core portfolio base.'
      } else if (isLoss) {
        rationale = 'Losing to market sentiment. Check company fundamentals again.'
      } else {
        rationale = 'Steady performer. Matches general market index trend.'
      }
    }
    return { sentiment, action, rationale, type, entryQuality, strategyAdvice }
  }, [holding, cur, pnlPct, daysHeld])

  return (
    <div style={{
      ...styles.card,
      borderColor: suggestion.sentiment === 'BULLISH' ? 'var(--gain-sub)' : suggestion.sentiment === 'BEARISH' ? 'var(--loss-sub)' : 'var(--border)'
    }}>
      <div style={styles.cardHeader}>
        <div style={styles.symBox}>
          <span style={styles.sym}>{sym}</span>
          <span style={{ ...styles.badge, background: suggestion.type === 'TRADING' ? 'var(--accent)' : 'var(--primary)' }}>
            {suggestion.type}
          </span>
        </div>
        <div style={{ ...styles.action, color: suggestion.sentiment === 'BULLISH' ? 'var(--gain)' : suggestion.sentiment === 'BEARISH' ? 'var(--loss)' : 'var(--secondary)' }}>
          {suggestion.action}
        </div>
      </div>

      <div style={styles.entrySection}>
         <div style={styles.entryBadge}>
           {suggestion.entryQuality}
         </div>
         <div style={styles.strategyBadge}>
           <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>STRATEGY:</span> {suggestion.strategyAdvice}
         </div>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Day Held</div>
          <div style={styles.statVal}>{daysHeld} days</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statLabel}>P/L %</div>
          <div style={{ ...styles.statVal, color: isLoss ? 'var(--loss)' : 'var(--gain)' }}>{pnlPct.toFixed(2)}%</div>
        </div>
      </div>
      <div style={styles.rationale}>
        <strong>AI Insight:</strong> {suggestion.rationale}
      </div>
    </div>
  )
}

const STRATEGY_HELP = {
  'PYRAMID UP': 'Add more shares as price goes up to maximize winners.',
  'AVERAGE DOWN': 'Buy more at lower prices to reduce your total average cost.',
  'SWITCH TO MOMENTUM': 'Exit slow stocks and move capital to faster gainers.',
  'OPPORTUNITY COST': 'Holding this stock is wasting money that could grow elsewhere.',
  'SNIPER ENTRY': 'Buying at the perfect moment right before a big move.',
  'STAY PATIENT': 'Fundamentals are strong; ignore short-term price swings.'
}

export default function HoldingIntelligence() {
  const { state } = useApp()
  const [expanded, setExpanded] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const holdings = state.holdings || []

  if (holdings.length === 0) return null

  return (
    <div style={styles.container}>
      <div 
        style={{ ...styles.header, cursor: 'pointer' }} 
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h3 style={styles.title}>AI Portfolio Insights</h3>
          <span style={styles.beta}>ALPHA</span>
        </div>
        <div style={{ ...styles.arrow, transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </div>
      </div>

      {expanded && (
        <>
          <div style={styles.helpToggle} onClick={(e) => { e.stopPropagation(); setShowHelp(!showHelp) }}>
            {showHelp ? '✕ Hide Strategy Meanings' : 'ℹ️ What do these strategies mean?'}
          </div>

          {showHelp && (
            <div style={styles.helpBox}>
              {Object.entries(STRATEGY_HELP).map(([k, v]) => (
                <div key={k} style={styles.helpItem}>
                  <strong style={{ color: 'var(--primary)', fontSize: 10 }}>{k}:</strong>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}> {v}</span>
                </div>
              ))}
            </div>
          )}

          <div style={styles.scroll}>
            {holdings.map(h => <IntelligenceCard key={h.id} holding={h} />)}
          </div>
        </>
      )}
    </div>
  )
}

const styles = {
  container: {
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '16px',
    padding: '20px 24px',
    border: '1px solid var(--border)',
    marginBottom: '24px',
    transition: 'all 0.3s ease'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '15px',
    fontWeight: '800',
    color: 'var(--text-main)',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  beta: {
    fontSize: '9px',
    padding: '2px 6px',
    borderRadius: '4px',
    background: 'var(--primary)',
    color: 'white',
    fontWeight: '800'
  },
  arrow: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    transition: 'transform 0.3s'
  },
  helpToggle: {
    fontSize: '11px',
    color: 'var(--primary)',
    fontWeight: '700',
    marginTop: '16px',
    cursor: 'pointer',
    width: 'fit-content',
    padding: '4px 8px',
    borderRadius: '4px',
    background: 'rgba(99, 102, 241, 0.05)',
  },
  helpBox: {
    marginTop: '12px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '12px',
    padding: '16px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '12px',
    border: '1px solid var(--border)'
  },
  helpItem: {
    lineHeight: '1.4'
  },
  scroll: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
    marginTop: '24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '24px'
  },
  card: {
    background: 'var(--bg-main)',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid var(--border)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  symBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  sym: {
    fontSize: '18px',
    fontWeight: '900',
    color: 'var(--text-main)'
  },
  badge: {
    fontSize: '9px',
    fontWeight: '800',
    padding: '2px 6px',
    borderRadius: '40px',
    color: 'white',
    width: 'fit-content'
  },
  action: {
    fontSize: '12px',
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  entrySection: {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  entryBadge: {
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--primary)',
    background: 'rgba(99, 102, 241, 0.1)',
    padding: '4px 8px',
    borderRadius: '6px',
    width: 'fit-content'
  },
  strategyBadge: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-main)'
  },
  statsRow: {
    display: 'flex',
    gap: '24px',
    marginBottom: '16px'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column'
  },
  statLabel: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase'
  },
  statVal: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--text-main)'
  },
  rationale: {
    fontSize: '12px',
    lineHeight: '1.5',
    color: 'rgba(255, 255, 255, 0.7)',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '12px'
  }
}
