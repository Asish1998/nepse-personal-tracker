import { useApp } from '../../context/AppContext'
import { effectiveBuyCost } from '../../utils/feeEngine'
import { fmtNPR, fmtPct } from '../../utils/formatters'

export default function SummaryCards() {
  const { state } = useApp()

  // Unrealized (Current Holdings)
  // Unrealized (Current Holdings)
  // Unrealized (Current Holdings)
  const unrealized = state.holdings.reduce(
    (acc, h) => {
      const curPrice = h.cur || h.buy || 0
      const totalCost = h.inv || (h.qty * h.buy) || 0
      const curValue = h.qty * curPrice
      
      acc.invested += totalCost
      acc.value    += curValue
      acc.fees     += (h.inv && h.buy ? Math.max(0, h.inv - (h.qty * h.buy)) : 0)
      return acc
    },
    { invested: 0, value: 0, fees: 0 }
  )

  // Realized (Sold Trades)
  const realized = state.trades.reduce(
    (acc, t) => {
      if (t.type === 'SELL') {
        const originalBasis = t.basisTotal || (t.qty * (t.buyPrice || 0))
        const profit = t.net - originalBasis
        acc.profit += profit
        acc.fees   += (t.fees || 0)
      } else if (t.type === 'BUY') {
        acc.buyFees += (t.fees || 0)
      }
      return acc
    },
    { profit: 0, fees: 0, buyFees: 0 }
  )

  const totalDividends = state.holdings.reduce((acc, h) => acc + (parseFloat(h.dividends) || 0), 0)

  const unrealizedPL = unrealized.value - unrealized.invested
  const totalPL      = unrealizedPL + realized.profit
  const netWorth     = unrealized.value 
  const totalFees    = (unrealized.fees || 0) + (realized.fees || 0) + (realized.buyFees || 0)
  
  // Calculate Potential Tax Liability (Unrealized)
  const potentialTax = state.holdings.reduce((acc, h) => {
    const curPrice = h.cur || h.buy || 0
    const totalCost = h.inv || (h.qty * h.buy)
    const curValue = h.qty * curPrice
    const profit = curValue - totalCost
    if (profit <= 0) return acc

    const buyDate = new Date(h.date || Date.now())
    const diff = Math.floor((Date.now() - buyDate) / (1000 * 60 * 60 * 24))
    const rate = diff >= 365 ? 0.05 : 0.075
    return acc + (profit * rate)
  }, 0)

  const realNetPL    = (totalPL || 0) - (totalFees || 0)
  const realizable   = netWorth - potentialTax

  // Actual days gain calculation
  const daysGain = state.holdings.reduce((acc, h) => {
    const curP = h.cur || h.buy || 0
    const prevP = h.prev || curP
    const change = curP - prevP
    return acc + (change * h.qty)
  }, 0)

  const cards = [
    { label: 'Networth',        value: `NPR ${fmtNPR(netWorth)}`, bold: true, color: 'var(--primary)' },
    { label: 'Total Investment', value: `NPR ${fmtNPR(unrealized.invested)}`, color: 'var(--text-main)', sub: 'Cost Basis' },
    { label: 'Realizable Value', value: `NPR ${fmtNPR(realizable)}`, color: 'var(--accent)', sub: 'After Potential CGT' },
    { label: 'Overall Gain',    value: `${totalPL >= 0 ? '+' : ''}NPR ${fmtNPR(totalPL)}`, color: totalPL >= 0 ? 'var(--profit)' : 'var(--loss)' },
    { label: 'Days Gain',       value: `${daysGain >= 0 ? '+' : ''}NPR ${fmtNPR(daysGain)}`, color: daysGain >= 0 ? 'var(--profit)' : 'var(--loss)' },
    { label: 'Total Net P/L',   value: `${realNetPL >= 0 ? '+' : ''}NPR ${fmtNPR(realNetPL)}`, color: realNetPL >= 0 ? 'var(--profit)' : 'var(--loss)', bold: true },
  ]

  return (
    <div className="summary-grid" style={styles.grid}>
      {cards.map(c => (
        <div key={c.label} className="card" style={{ ...styles.card, border: c.bold ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
          <div style={styles.label}>{c.label}</div>
          <div style={{ ...styles.value, color: c.color || 'var(--text-main)', fontSize: c.bold ? 19 : 17 }}>{c.value}</div>
          {c.sub && <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: '600' }}>{c.sub}</div>}
        </div>
      ))}
    </div>
  )
}

const styles = {
  grid:  { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
    gap: '24px', 
    marginBottom: '24px' 
  },
  card:  { 
    padding: '20px',
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center',
    minHeight: '100px'
  },
  label: { 
    fontSize: '11px', 
    color: 'var(--text-muted)', 
    textTransform: 'uppercase', 
    letterSpacing: '0.08em', 
    marginBottom: '8px', 
    fontWeight: '700' 
  },
  value: { 
    fontSize: '18px', 
    fontWeight: '700', 
    letterSpacing: '-0.02em',
    wordBreak: 'break-all'
  },
}