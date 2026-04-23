import { useApp } from '../../context/AppContext'
import { fmtNPR } from '../../utils/formatters'
import { effectiveBuyCost } from '../../utils/feeEngine'

export default function TradesTable() {
  const { state } = useApp()

  if (!state.trades.length) {
    return <p style={{ color: 'var(--muted)', fontSize: 13, padding: '20px 0' }}>No transactions recorded yet.</p>
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            {['Date', 'Symbol', 'Type', 'Qty', 'Price', 'Fees', 'Net Amount', 'Profit'].map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {state.trades.map(t => {
            let profit = null
            if (t.type === 'SELL' && t.buyPrice) {
              const { totalCost: buyBasis } = effectiveBuyCost(t.qty, t.buyPrice)
              profit = t.net - buyBasis
            }

            const isBuy = t.type === 'BUY'
            const color = isBuy ? 'var(--profit)' : 'var(--accent)'

            return (
              <tr key={t.id}>
                <td style={{ fontSize: 11, color: 'var(--muted)' }}>{t.date}</td>
                <td style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{t.sym}</td>
                <td>
                  <span style={{ 
                    padding: '2px 6px', 
                    borderRadius: 4, 
                    fontSize: 10, 
                    fontWeight: 700, 
                    background: isBuy ? 'rgba(0,192,118,0.1)' : 'rgba(110,140,255,0.1)', 
                    color: isBuy ? 'var(--profit)' : 'var(--accent)'
                  }}>
                    {t.type}
                  </span>
                </td>
                <td>{t.qty.toLocaleString()}</td>
                <td style={{ fontFamily: 'var(--mono)' }}>{fmtNPR(t.price)}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--loss)' }}>
                  -{fmtNPR(t.fees || 0)}
                </td>
                <td style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{fmtNPR(t.net)}</td>
                <td style={{ 
                  fontFamily: 'var(--mono)', 
                  color: profit >= 0 ? 'var(--profit)' : 'var(--loss)' 
                }}>
                  {profit !== null ? `${profit >= 0 ? '+' : ''}${fmtNPR(profit, 0)}` : '-'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
