import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { effectiveBuyCost } from '../../utils/feeEngine'
import { fmtNPR } from '../../utils/formatters'
import SellForm from './SellForm'

export default function HoldingsTable() {
  const { state, dispatch } = useApp()
  const [sellingHolding, setSellingHolding] = useState(null)

  function updatePrice(id, val) {
    const cur = parseFloat(val)
    if (!isNaN(cur)) dispatch({ type: 'UPDATE_HOLDING_PRICE', payload: { id, cur } })
  }

  function deleteHolding(id) {
    if (confirm('Are you sure you want to delete this holding record? This will not record a sale.')) {
      dispatch({ type: 'DELETE_HOLDING', payload: id })
    }
  }

  if (!state.holdings.length) {
    return <p style={{ color: 'var(--muted)', fontSize: 13, padding: '20px 0' }}>No holdings yet. Add your first one above.</p>
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            {['Symbol', 'Qty', 'Buy/sh', 'Eff/sh', 'Now', 'Eff. Cost', 'Cur. Value', 'P/L', 'P/L %', 'Actions'].map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {state.holdings.map(h => {
            const { totalCost, effPricePerShare } = effectiveBuyCost(h.qty, h.buy)
            const curValue = h.qty * h.cur
            const pl       = curValue - totalCost
            const plPct    = (pl / totalCost) * 100
            const color    = pl >= 0 ? 'var(--profit)' : 'var(--loss)'
            const sign     = pl >= 0 ? '+' : ''

            return (
              <tr key={h.id}>
                <td style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{h.sym}</td>
                <td>{h.qty.toLocaleString()}</td>
                <td style={{ fontFamily: 'var(--mono)' }}>{fmtNPR(h.buy)}</td>
                <td style={{ fontFamily: 'var(--mono)', color: 'var(--muted)' }} title="Effective price after buy fees">
                  {fmtNPR(effPricePerShare)}
                </td>
                <td>
                  <input
                    type="number"
                    defaultValue={h.cur}
                    onBlur={e => updatePrice(h.id, e.target.value)}
                    style={{ width: 80, textAlign: 'right', fontFamily: 'var(--mono)', padding: '3px 6px', fontSize: 12 }}
                  />
                </td>
                <td style={{ fontFamily: 'var(--mono)' }}>{fmtNPR(totalCost, 0)}</td>
                <td style={{ fontFamily: 'var(--mono)' }}>{fmtNPR(curValue, 0)}</td>
                <td style={{ fontFamily: 'var(--mono)', color }}>{sign}{fmtNPR(pl, 0)}</td>
                <td style={{ color }}>{sign}{plPct.toFixed(2)}%</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn-primary"
                      style={{ padding: '3px 9px', fontSize: 11 }}
                      onClick={() => setSellingHolding(h)}
                    >
                      Sell
                    </button>
                    <button
                      className="btn-danger"
                      style={{ padding: '3px 9px', fontSize: 11, background: 'none', border: '1px solid var(--loss)', color: 'var(--loss)' }}
                      onClick={() => deleteHolding(h.id)}
                    >
                      ×
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {sellingHolding && (
        <SellForm 
          holding={sellingHolding} 
          onClose={() => setSellingHolding(null)} 
        />
      )}
    </div>
  )
}