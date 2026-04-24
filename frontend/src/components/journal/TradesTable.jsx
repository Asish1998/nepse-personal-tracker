import { useApp } from '../../context/AppContext'
import { fmtNPR } from '../../utils/formatters'
import { effectiveBuyCost } from '../../utils/feeEngine'

export default function TradesTable() {
  const { state, dispatch } = useApp()

  if (!state.trades.length) {
    return <p style={{ color: 'var(--muted)', fontSize: 13, padding: '20px 0' }}>No transactions recorded yet.</p>
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            {['Date', 'Symbol', 'Type', 'Class', 'Qty', 'Price', 'Fees', 'Net Amount', 'Profit', 'Strategy / Notes', ''].map((h, i) => (
              <th key={i}>{h}</th>
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
                <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.date}</td>
                <td style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{t.sym}</td>
                <td>
                  <span style={{ 
                    padding: '3px 8px', 
                    borderRadius: 4, 
                    fontSize: 10, 
                    fontWeight: 800, 
                    letterSpacing: '0.05em',
                    background: isBuy ? 'rgba(0,192,118,0.1)' : 'rgba(110,140,255,0.1)', 
                    color: isBuy ? 'var(--profit)' : 'var(--accent)'
                  }}>
                    {t.type}
                  </span>
                </td>
                <td style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.shareType || 'Secondary'}</td>
                <td>{t.qty.toLocaleString()}</td>
                <td style={{ fontFamily: 'var(--mono)' }}>{fmtNPR(t.price)}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--loss)' }}>
                  -{fmtNPR(t.fees || 0)}
                </td>
                <td style={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>{fmtNPR(t.net)}</td>
                <td style={{ 
                  fontFamily: 'var(--mono)', 
                  fontWeight: 800,
                  color: profit > 0 ? 'var(--profit)' : (profit < 0 ? 'var(--loss)' : 'var(--text-main)') 
                }}>
                  {profit !== null ? `${profit >= 0 ? '+' : ''}${fmtNPR(profit, 0)}` : '-'}
                </td>
                <td style={{ 
                  maxWidth: 250, 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  fontSize: 11, 
                  color: t.notes ? 'var(--text-main)' : 'var(--text-muted)',
                  fontStyle: t.notes ? 'normal' : 'italic'
                }} title={t.notes || 'No strategy provided'}>
                  {t.notes || 'No strategy provided'}
                </td>
                <td style={{ textAlign: 'right', paddingRight: '12px' }}>
                  <button 
                    onClick={() => {
                      if (window.confirm(`Delete ${t.type} record for ${t.sym}?`)) {
                        dispatch({ type: 'DELETE_TRADE', payload: t.id })
                      }
                    }}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--text-muted)', 
                      cursor: 'pointer', 
                      fontSize: 14,
                      opacity: 0.6,
                      padding: '4px'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--loss)'; e.currentTarget.style.opacity = 1 }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.opacity = 0.6 }}
                    title="Delete Trade Entry"
                  >
                    ×
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
