import { useApp } from '../../context/AppContext'
import { effectiveBuyCost } from '../../utils/feeEngine'
import { fmtNPR, fmtPct } from '../../utils/formatters'

export default function SummaryCards() {
  const { state } = useApp()

  // Unrealized (Current Holdings)
  const unrealized = state.holdings.reduce(
    (acc, h) => {
      // If imported, use the pre-calculated investment from Excel
      // If manual, calculate using the fee engine
      const { totalCost, fees } = h.isImported 
        ? { totalCost: h.inv || (h.qty * h.buy), fees: null } 
        : effectiveBuyCost(h.qty, h.buy)
      
      const curValue = h.qty * h.cur
      acc.invested += totalCost
      acc.value    += curValue
      acc.fees     += (fees ? fees.commission + fees.sebonFee : 0)
      return acc
    },
    { invested: 0, value: 0, fees: 0 }
  )

  // Realized (Sold Trades)
  const realized = state.trades.reduce(
    (acc, t) => {
      if (t.type === 'SELL') {
        // Profit = Net Received - (Buy Basis + Buy Fees)
        // Note: buyPrice in t is the original cost/sh
        const { totalCost: originalCostBasis } = effectiveBuyCost(t.qty, t.buyPrice)
        const profit = t.net - originalCostBasis
        acc.profit += profit
        acc.fees   += t.fees
      } else if (t.type === 'BUY') {
        // Track fees paid on buys separately if they are already in state.trades
        // (existing logic doesn't add buys to trades unless imported, so this is safe)
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
  const totalFees    = unrealized.fees + realized.fees + realized.buyFees
  const realNetPL    = totalPL - totalFees

  // Actual days gain calculation
  const daysGain = state.holdings.reduce((acc, h) => {
    const prev = h.prev || h.cur // fallback if no prev close
    return acc + (h.cur - prev) * h.qty
  }, 0)

  const cards = [
    { label: 'Networth',        value: `NPR ${fmtNPR(netWorth)}`, bold: true, color: 'var(--primary)' },
    { label: 'Investment',      value: `NPR ${fmtNPR(unrealized.invested)}` },
    { label: 'Overall Gain',    value: `${totalPL >= 0 ? '+' : ''}NPR ${fmtNPR(totalPL)}`, color: totalPL >= 0 ? 'var(--profit)' : 'var(--loss)' },
    { label: 'Days Gain',       value: `NPR ${fmtNPR(daysGain)}`, color: daysGain >= 0 ? 'var(--profit)' : 'var(--loss)' },
    { label: 'Total Net P/L',   value: `${realNetPL >= 0 ? '+' : ''}NPR ${fmtNPR(realNetPL)}`, color: realNetPL >= 0 ? 'var(--profit)' : 'var(--loss)', bold: true },
    { label: 'Total Fees Paid', value: `NPR ${fmtNPR(totalFees)}`, color: 'var(--warn)' },
  ]

  return (
    <div style={styles.grid}>
      {cards.map(c => (
        <div key={c.label} className="card" style={{ ...styles.card, border: c.bold ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
          <div style={styles.label}>{c.label}</div>
          <div style={{ ...styles.value, color: c.color || 'var(--text-main)', fontSize: c.bold ? 19 : 17 }}>{c.value}</div>
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