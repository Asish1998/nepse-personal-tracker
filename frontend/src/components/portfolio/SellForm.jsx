import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { calcFees, holdingDays, effectiveBuyCost } from '../../utils/feeEngine'
import { fmtNPR, today } from '../../utils/formatters'

export default function SellForm({ holding, onClose }) {
  const { dispatch } = useApp()
  const [qty, setQty] = useState(holding.qty)
  const [price, setPrice] = useState(holding.cur || holding.buy)
  const [date, setDate] = useState(today())
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    const q = parseFloat(qty)
    const p = parseFloat(price)
    if (q > 0 && p > 0) {
      // Calculate gross profit based on the accurate persisted WACC basis
      const unitBasis = (holding.inv || (holding.qty * holding.buy)) / holding.qty
      const buyBasis = unitBasis * q
      
      const grossAmount = q * p
      const days = holdingDays(holding.date, date)
      const fees = calcFees(grossAmount, 'SELL', days, grossAmount - buyBasis)
      setPreview({ fees, days, buyBasis })
    } else {
      setPreview(null)
    }
  }, [qty, price, date, holding])

  function submit() {
    const q = parseFloat(qty)
    const p = parseFloat(price)
    if (!q || !p) return alert('Quantity and price are required.')
    if (q > holding.qty) return alert(`You only have ${holding.qty} shares.`)

    dispatch({
      type: 'SELL_HOLDING',
      payload: {
        holdingId: holding.id,
        qty: q,
        price: p,
        date,
        fees: preview.fees
      }
    })
    onClose()
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>Sell {holding.sym}</h3>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>

        <div style={styles.content}>
          <div style={styles.inputGroup}>
            <div style={styles.field}>
              <label style={styles.label}>Quantity (Max: {holding.qty})</label>
              <input 
                type="number" 
                value={qty} 
                onChange={e => setQty(e.target.value)} 
                max={holding.qty}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Sell Price / sh</label>
              <input 
                type="number" 
                value={price} 
                onChange={e => setPrice(e.target.value)} 
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.field}>
              <label style={styles.label}>Sell Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Audit Buy Price / sh</label>
              <input 
                type="number" 
                defaultValue={holding.buy} 
                onChange={e => {
                  const val = parseFloat(e.target.value)
                  if (!isNaN(val)) {
                    // Force refresh preview with new basis
                    const q = parseFloat(qty)
                    const p = parseFloat(price)
                    if (q > 0 && p > 0) {
                      const { totalCost: buyBasis } = effectiveBuyCost(q, val)
                      const grossAmount = q * p
                      const days = holdingDays(holding.date, date)
                      const fees = calcFees(grossAmount, 'SELL', days, grossAmount - buyBasis)
                      setPreview({ fees, days, buyBasis })
                    }
                  }
                }} 
              />
            </div>
          </div>

          {preview && (
            <div style={styles.preview}>
              <div style={styles.previewTitle}>Live Fee Breakdown</div>
              <Row label="Gross Receivable" value={`NPR ${fmtNPR(preview.fees.grossAmount)}`} />
              <Row label={`Commission: ${preview.fees.tier}`} value={`- NPR ${fmtNPR(preview.fees.commission)}`} />
              <Row label="SEBON Fee (0.015%)"         value={`- NPR ${fmtNPR(preview.fees.sebonFee)}`} />
              <Row label="DP Charge (Flat)"         value={`- NPR ${preview.fees.dpCharge}`} />
              
              <div style={styles.divider} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>Tax & Holding Info</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: preview.days >= 365 ? 'rgba(0,192,118,0.1)' : 'rgba(239,68,68,0.1)', color: preview.days >= 365 ? 'var(--profit)' : 'var(--loss)' }}>
                  {preview.days} Days ({preview.days >= 365 ? 'Long Term' : 'Short Term'})
                </span>
              </div>

              {preview.fees.cgt > 0 && (
                <Row 
                  label={`Capital Gain Tax (${(preview.fees.cgtRate * 100).toFixed(1)}%)`} 
                  value={`- NPR ${fmtNPR(preview.fees.cgt)}`} 
                  color="var(--loss)"
                />
              )}

              <div style={styles.divider} />
              <Row label="NET PROCEEDS"  value={`NPR ${fmtNPR(preview.fees.netAmount)}`} bold />
              
              <div style={{ marginTop: 12, padding: '10px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: 8, border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                <Row 
                  label="REAL NET P/L" 
                  value={`NPR ${fmtNPR(preview.fees.netAmount - preview.buyBasis)}`} 
                  bold 
                  color={preview.fees.netAmount > preview.buyBasis ? 'var(--profit)' : 'var(--loss)'}
                />
                <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 4 }}>
                  (Net Selling - Original Buy Basis incl. Buy Fees)
                </div>
              </div>
            </div>
          )}

          <div style={styles.actions}>
            <button className="btn-primary" onClick={submit} style={{ flex: 1 }}>Confirm Sell</button>
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, bold, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0', fontSize: 13 }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontWeight: bold ? 600 : 400, color: color || 'var(--text-main)', fontFamily: 'var(--mono)' }}>{value}</span>
    </div>
  )
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal:   { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', width: '90%', maxWidth: 400, overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
  header:  { padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' },
  content: { padding: 20 },
  inputGroup: { display: 'flex', gap: 12, marginBottom: 16 },
  field:   { flex: 1, marginBottom: 16 },
  label:   { display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', fontWeight: 600 },
  closeBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 24, cursor: 'pointer' },
  preview: { background: 'var(--bg-main)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '20px', border: '1px solid var(--border)' },
  previewTitle: { fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 },
  divider: { height: 1, background: 'var(--border)', margin: '10px 0' },
  actions: { display: 'flex', gap: 10 },
}
