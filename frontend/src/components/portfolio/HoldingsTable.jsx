import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { effectiveBuyCost } from '../../utils/feeEngine'
import { fmtNPR } from '../../utils/formatters'
import SellForm from './SellForm'
import EditForm from './EditForm'

export default function HoldingsTable() {
  const { state, dispatch } = useApp()
  const [sellingHolding, setSellingHolding] = useState(null)
  const [editingHolding, setEditingHolding] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  function updatePrice(sym, val) {
    const cur = parseFloat(val)
    if (!isNaN(cur)) dispatch({ type: 'UPDATE_HOLDING_PRICE', payload: { sym, cur } })
  }

  function deleteHolding(id) {
    if (confirm('Are you sure you want to delete this holding record? This will not record a sale.')) {
      dispatch({ type: 'DELETE_HOLDING', payload: id })
    }
  }

  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  if (!state.holdings.length) {
    return <p style={{ color: 'var(--text-muted)', fontSize: 13, padding: '20px 0' }}>No holdings yet. Add your first one above.</p>
  }

  // Phase 1: Pre-calculate all financial fields safely so we can sort by them
  const processedHoldings = state.holdings.map(h => {
    const investment = h.isImported ? (h.inv || (h.qty * h.buy)) : effectiveBuyCost(h.qty, h.buy).totalCost
    const mktValue = h.isImported ? (h.mkt || (h.qty * h.cur)) : (h.qty * h.cur)
    const pl = h.isImported ? (h.pl || (mktValue - investment)) : (mktValue - investment)
    const prev = h.prev || h.cur
    const changeVal = h.cur - prev
    const dailyPL = changeVal * h.qty
    return { ...h, investment, mktValue, pl, changeVal, dailyPL }
  })

  // Phase 2: Sort the processed array if a key is active
  let sortedHoldings = [...processedHoldings]
  if (sortConfig.key !== null) {
    sortedHoldings.sort((a, b) => {
      let aVal = a[sortConfig.key]
      let bVal = b[sortConfig.key]
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }

  const columns = [
    { label: 'S.N.', key: null },
    { label: 'Symbol', key: 'sym' },
    { label: 'Qty.', key: 'qty' },
    { label: 'Rate', key: 'buy' },
    { label: 'Investment', key: 'investment' },
    { label: 'Price', key: 'cur' },
    { label: 'Change', key: 'changeVal' },
    { label: 'Daily', key: 'dailyPL' },
    { label: 'Overall', key: 'pl' },
    { label: 'Market Value', key: 'mktValue' },
    { label: 'Tax', key: null },
    { label: 'Actions', key: null },
  ]

  return (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th 
                key={col.label} 
                onClick={() => col.key && requestSort(col.key)}
                style={{ cursor: col.key ? 'pointer' : 'default', userSelect: 'none', transition: 'color 0.2s' }}
                title={col.key ? `Sort by ${col.label}` : undefined}
              >
                {col.label}
                {sortConfig.key === col.key && (
                  <span style={{ fontSize: 9, marginLeft: 4, display: 'inline-block', transform: sortConfig.direction === 'asc' ? 'translateY(-1px)' : 'translateY(1px)' }}>
                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedHoldings.map((h, index) => {
            const plColor = h.pl >= 0 ? 'var(--profit)' : 'var(--loss)'

            return (
              <tr key={h.id}>
                <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{index + 1}</td>
                <td style={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>
                  <Link 
                    to={`/stock/${h.sym}`} 
                    target="_blank" 
                    style={{ color: 'var(--primary)', textDecoration: 'none', borderBottom: '1px dashed var(--border-strong)', paddingBottom: 2 }}
                    title="View Full Details"
                  >
                    {h.sym}
                  </Link>
                </td>
                <td>{h.qty.toLocaleString()}</td>
                <td style={{ fontFamily: 'var(--mono)' }}>{fmtNPR(h.buy)}</td>
                <td style={{ fontWeight: 700, fontFamily: 'var(--mono)' }}>{fmtNPR(h.investment, 0)}</td>
                <td>
                  <input
                    type="number"
                    defaultValue={h.cur}
                    onBlur={e => updatePrice(h.sym, e.target.value)}
                    className="mono price-input"
                    style={{ 
                      width: 80, 
                      background: 'transparent', 
                      border: 'none', 
                      borderBottom: '1px solid transparent',
                      padding: '2px 0', 
                      fontSize: 13,
                      color: 'inherit'
                    }}
                  />
                </td>
                <td style={{ color: h.changeVal >= 0 ? 'var(--profit)' : 'var(--loss)', fontWeight: 600 }}>
                  {h.changeVal > 0 ? '+' : ''}{fmtNPR(h.changeVal)}
                </td>
                <td style={{ color: h.dailyPL >= 0 ? 'var(--profit)' : 'var(--loss)', fontWeight: 600 }}>
                  {h.dailyPL > 0 ? '+' : ''}{fmtNPR(h.dailyPL, 0)}
                </td>
                <td style={{ fontWeight: 800, color: plColor }}>
                  {h.pl > 0 ? '+' : ''}{fmtNPR(h.pl, 0)}
                </td>
                <td style={{ fontWeight: 700 }}>{fmtNPR(h.mktValue, 0)}</td>
                <td>
                  {(() => {
                    const buyDate = new Date(h.date || Date.now())
                    const diff = Math.floor((new Date() - buyDate) / (1000 * 60 * 60 * 24))
                    const isLong = diff >= 365
                    const daysColor = isLong ? 'var(--profit)' : 'var(--text-muted)'
                    
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ 
                          fontSize: 10, 
                          fontWeight: 800, 
                          padding: '2px 6px', 
                          borderRadius: 4, 
                          background: isLong ? 'rgba(0,192,118,0.1)' : 'rgba(239,68,68,0.1)', 
                          color: isLong ? 'var(--profit)' : 'var(--loss)',
                          width: 'fit-content'
                        }}>
                          {isLong ? 'LT (5%)' : 'ST (7.5%)'}
                        </span>
                        <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600 }}>
                          {diff}d held
                          {!isLong && ` · ${365 - diff}d to LT`}
                        </span>
                      </div>
                    )
                  })()}
                </td>
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
                      className="btn-secondary"
                      style={{ padding: '3px 9px', fontSize: 11, borderColor: 'var(--border-strong)' }}
                      onClick={() => setEditingHolding(h)}
                    >
                      Edit
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
      
      {editingHolding && (
        <EditForm 
          holding={editingHolding} 
          onClose={() => setEditingHolding(null)} 
        />
      )}
    </div>
  )
}