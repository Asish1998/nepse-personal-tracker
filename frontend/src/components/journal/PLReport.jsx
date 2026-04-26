import { useApp } from '../../context/AppContext'
import { fmtNPR } from '../../utils/formatters'
import { effectiveBuyCost } from '../../utils/feeEngine'

export default function PLReport() {
  const { state } = useApp()
  const trades = state.trades

  if (!trades.length) {
    return <p style={{ color: 'var(--muted)', fontSize: 13, padding: '20px 0' }}>No trade history to generate report.</p>
  }

  // Aggregate stats by symbol
  const reportData = trades.reduce((acc, t) => {
    if (!acc[t.sym]) {
      acc[t.sym] = {
        sym: t.sym,
        buyQty: 0,
        sellQty: 0,
        totalBuyCost: 0,
        totalSellValue: 0,
        realizedPL: 0
      }
    }

    const { totalCost: buyBasis } = effectiveBuyCost(t.qty, t.price)

    if (t.type === 'BUY') {
      acc[t.sym].buyQty += t.qty
      acc[t.sym].totalBuyCost += t.net // including fees
    } else {
      acc[t.sym].sellQty += t.qty
      acc[t.sym].totalSellValue += t.net // including fees/tax
      
      // Calculate Realized P/L based on buy price if provided in trade record
      if (t.buyPrice) {
        const { totalCost: tradeBuyBasis } = effectiveBuyCost(t.qty, t.buyPrice)
        acc[t.sym].realizedPL += (t.net - tradeBuyBasis)
      }
    }

    return acc
  }, {})

  const reportArray = Object.values(reportData).sort((a,b) => b.realizedPL - a.realizedPL)
  const grandTotal = reportArray.reduce((acc, r) => acc + r.realizedPL, 0)

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Buy Qty</th>
            <th>Sell Qty</th>
            <th>Buy Cost (Net)</th>
            <th>Sell Value (Net)</th>
            <th style={{ textAlign: 'right' }}>Realized P/L</th>
          </tr>
        </thead>
        <tbody>
          {reportArray.map(r => (
            <tr key={r.sym}>
              <td style={{ fontFamily: 'var(--mono)', fontWeight: 800, color: 'var(--primary)' }}>{r.sym}</td>
              <td>{r.buyQty.toLocaleString()}</td>
              <td>{r.sellQty.toLocaleString()}</td>
              <td style={{ fontFamily: 'var(--mono)' }}>{fmtNPR(r.totalBuyCost, 0)}</td>
              <td style={{ fontFamily: 'var(--mono)' }}>{fmtNPR(r.totalSellValue, 0)}</td>
              <td style={{ 
                fontFamily: 'var(--mono)', 
                fontWeight: 800, 
                textAlign: 'right',
                color: r.realizedPL > 0 ? 'var(--profit)' : (r.realizedPL < 0 ? 'var(--loss)' : 'var(--text-main)')
              }}>
                {r.realizedPL >= 0 ? '+' : ''}{fmtNPR(r.realizedPL, 0)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background: 'rgba(0,0,0,0.02)', fontWeight: 800 }}>
            <td colSpan={5} style={{ textAlign: 'right', padding: '16px' }}>TOTAL REALIZED NET PROFIT / LOSS</td>
            <td style={{ 
              textAlign: 'right', 
              padding: '16px', 
              fontFamily: 'var(--mono)', 
              fontSize: 16,
              color: grandTotal >= 0 ? 'var(--profit)' : 'var(--loss)'
            }}>
              {grandTotal >= 0 ? '+' : ''}{fmtNPR(grandTotal, 0)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
