import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { effectiveBuyCost } from '../../utils/feeEngine'
import { fmtNPR, today } from '../../utils/formatters'

const empty = { sym: '', qty: '', buy: '', cur: '', date: today(), shareType: 'Secondary', reason: '', tradeCategory: 'Investment', stopLoss: '', profitTarget: '' }

function FeeRow({ label, value, bold, sub }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0', fontSize: 12 }}>
      <span style={{ color: 'var(--text-muted)' }}>{label} {sub && <span style={{ fontSize: 9 }}>({sub})</span>}</span>
      <span style={{ fontWeight: bold ? 700 : 400, fontFamily: 'var(--mono)', color: 'var(--text-main)' }}>{value}</span>
    </div>
  )
}

export default function HoldingForm({ onClose }) {
  const { dispatch } = useApp()
  const [form, setForm]   = useState(empty)
  const [symbols, setSymbols] = useState([])
  const [showList, setShowList] = useState(false)
  const listHideRef = useRef(null)
  const [preview, setPreview] = useState(null)

  function set(fieldOrObj, maybeVal) {
    setForm(prev => {
      const updates = typeof fieldOrObj === 'object' ? fieldOrObj : { [fieldOrObj]: maybeVal }
      const updated = { ...prev, ...updates }
      
      // Clear targets if switched to Investment
      if (updated.tradeCategory === 'Investment') {
        updated.stopLoss = ''
        updated.profitTarget = ''
      }

      const qty = parseFloat(updated.qty)
      const buy = parseFloat(updated.buy)
      if (qty > 0 && buy > 0) {
        const { totalCost, effPricePerShare, fees } = effectiveBuyCost(qty, buy)
        setPreview({ totalCost, effPricePerShare, fees })
      } else {
        setPreview(null)
      }
      return updated
    })
  }

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_NEPSE_API || 'http://localhost:3001'
    async function fetchSymbols() {
      try {
        const res = await fetch(`${API_BASE}/symbols`)
        if (!res.ok) return
        const data = await res.json()
        const mapped = Array.isArray(data) ? data.map(d => ({
          symbol: (d.symbol||d.sym||'').toUpperCase(),
          name: d.name || '',
          ltp: d.ltp ?? d.price ?? null
        })) : []
        setSymbols(mapped)
      } catch (err) { setSymbols([]) }
    }
    fetchSymbols()
  }, [])

  async function submit() {
    const qty = parseFloat(form.qty)
    const buy = parseFloat(form.buy)
    if (!form.sym || !qty || !buy) return alert('Symbol, quantity and buy price are required.')
    
    // Fallback net cost if preview isn't rendered
    const netCost = preview ? preview.totalCost : qty * buy

    dispatch({
      type: 'ADD_HOLDING',
      payload: { 
        id: Date.now(), 
        sym: form.sym.toUpperCase(), 
        qty, 
        buy, 
        cur: parseFloat(form.cur) || buy, 
        date: form.date,
        shareType: form.shareType,
        reason: form.reason || '',
        tradeCategory: form.tradeCategory,
        stopLoss: form.stopLoss ? parseFloat(form.stopLoss) : null,
        profitTarget: form.profitTarget ? parseFloat(form.profitTarget) : null,
        netCost
      },
    })
    setForm(empty)
    onClose()
  }

  const fields = [
    { label: 'Symbol',           field: 'sym',  type: 'text',   ph: 'NEPSE' },
    { label: 'Quantity',         field: 'qty',  type: 'number', ph: '0' },
    { label: 'Buy Price / sh',   field: 'buy',  type: 'number', ph: '' },
    { label: 'Live NEPSE Price', field: 'cur', type: 'number', ph: 'Auto' },
    { label: 'Buy Date',         field: 'date', type: 'date',   ph: '' },
    { label: 'Share Type',       field: 'shareType', type: 'select', options: ['Secondary', 'IPO', 'Right', 'Bonus'] },
    { label: 'Trade Category',   field: 'tradeCategory', type: 'select', options: ['Investment', 'Trading'] },
  ]

  if (form.tradeCategory === 'Trading') {
    fields.push({ label: 'Stop Loss Target', field: 'stopLoss', type: 'number', ph: 'e.g. 500' })
    fields.push({ label: 'Take Profit Target', field: 'profitTarget', type: 'number', ph: 'e.g. 800' })
  }

  fields.push({ label: 'Reason / Strategy', field: 'reason', type: 'textarea', ph: 'e.g. Fundamental analysis, Breakout logic, Emotional state...' })

  return (
    <div style={styles.wrap}>
      <div style={styles.grid}>
        {fields.map(({ label, field, type, ph, options }) => (
          <div key={field} style={{ 
            position: 'relative', 
            ...(field === 'reason' ? { gridColumn: '1 / -1', marginTop: '8px' } : {}) 
          }}>
            <label style={styles.label}>{label}</label>
            {type === 'select' ? (
              <select 
                value={form[field]} 
                onChange={e => set(field, e.target.value)}
                style={{ width: '100%' }}
              >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : type === 'textarea' ? (
              <textarea
                placeholder={ph}
                value={form[field]}
                onChange={e => set(field, e.target.value)}
                style={{ 
                  width: '100%', 
                  minHeight: '80px', 
                  padding: '12px', 
                  borderRadius: 'var(--radius)', 
                  border: '1px solid var(--border)', 
                  background: 'var(--bg-main)', 
                  color: 'var(--text-main)', 
                  resize: 'vertical', 
                  fontFamily: 'inherit',
                  fontSize: 13
                }}
              />
            ) : (
              <input
                type={type}
                placeholder={ph}
                value={form[field]}
                disabled={field === 'cur'}
                style={{
                  ...(field === 'sym' ? { textTransform: 'uppercase' } : {}),
                  ...(field === 'cur' ? { background: 'var(--bg-main)', color: 'var(--text-muted)' } : {})
                }}
                onFocus={() => { if (field === 'sym') setShowList(true) }}
                onBlur={() => { if (field === 'sym') listHideRef.current = setTimeout(() => setShowList(false), 150) }}
                onInput={e => {
                  const val = e.target.value
                  set(field, val)
                  if (field === 'sym') setShowList(true)
                }}
              />
            )}
            {field === 'sym' && showList && symbols.length > 0 && (
              <div style={styles.suggestionBox} onMouseDown={() => clearTimeout(listHideRef.current)}>
                {symbols
                  .filter(s => {
                    const q = (form.sym || '').toUpperCase()
                    return !q || s.symbol.includes(q) || s.name.toUpperCase().includes(q)
                  })
                  .slice(0, 50)
                  .map(s => (
                    <div key={s.symbol} style={styles.suggestionRow} className="autocomplete-row" onMouseDown={e => {
                      e.preventDefault()
                      set({ sym: s.symbol, cur: s.ltp || '' })
                      setShowList(false)
                    }}>
                      <div style={{ fontFamily: 'var(--mono)', width: 70, fontWeight: 700, color: 'var(--primary)' }}>{s.symbol}</div>
                      <div style={{ color: 'var(--text-muted)', flex: 1, fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--text-main)' }}>{s.ltp ?? '-'}</div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {preview && (
        <div style={styles.feeBox}>
          <div style={styles.feeTitle}>Live Cost Breakdown (BUY)</div>
          <div style={styles.feeRows}>
             <FeeRow label="Gross Amount" value={`NPR ${fmtNPR(preview.fees.grossAmount)}`} />
             <FeeRow label={`Commission: ${preview.fees.tier}`} value={`NPR ${fmtNPR(preview.fees.commission)}`} />
             <FeeRow label="SEBON Fee (0.015%)" value={`NPR ${fmtNPR(preview.fees.sebonFee)}`} />
             <div style={styles.divider} />
             <FeeRow label="TOTAL OUTFLOW" value={`NPR ${fmtNPR(preview.totalCost)}`} bold />
             <FeeRow label="Net Cost / Share" value={`NPR ${fmtNPR(preview.effPricePerShare)}`} sub="Real Entry Basis" />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn-primary" onClick={submit}>Add Holding</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}

const styles = {
  wrap: { 
    background: 'var(--bg-card)', 
    border: '1px solid var(--border)', 
    borderRadius: '16px', 
    padding: '24px', 
    marginBottom: '14px',
    backdropFilter: 'blur(16px)',
    position: 'relative',
    zIndex: 10
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, rowGap: 18, marginBottom: 16 },
  label: { display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 },
  suggestionBox: { 
    position: 'absolute', 
    top: '100%',
    left: 0,
    width: '100%',
    minWidth: '300px',
    maxHeight: '300px',
    overflowY: 'auto',
    borderRadius: '12px',
    border: '2px solid var(--primary)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 9999,
    marginTop: '8px',
    background: 'var(--bg-card)'
  },
  suggestionRow: { 
    display: 'flex', 
    gap: 12, 
    padding: '10px 14px', 
    cursor: 'pointer', 
    borderBottom: '1px solid var(--border)',
    alignItems: 'center',
    background: 'var(--bg-card)'
  },
  feeBox: { background: 'var(--bg-main)', borderRadius: '12px', padding: '16px', marginBottom: '20px', border: '1px solid var(--border)' },
  feeTitle: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12, color: 'var(--text-muted)', letterSpacing: '0.05em' },
  divider: { height: 1, background: 'var(--border)', margin: '8px 0' },
  feeRows: { display: 'flex', flexDirection: 'column' }
}