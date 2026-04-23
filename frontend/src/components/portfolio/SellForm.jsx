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
      // Calculate gross profit for CGT
      const { totalCost: buyBasis } = effectiveBuyCost(q, holding.buy)
      const grossAmount = q * p
      // For CGT, NEPSE uses (Sell Price - Buy Price) - fees heuristic
      // but actually it is (Sell Price * Qty) - (Buy Price * Qty) - Buy Fees
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

          <div style={styles.field}>
            <label style={styles.label}>Sell Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          {preview && (
            <div style={styles.preview}>
              <div style={styles.previewTitle}>Sell Breakdown</div>
              <Row label="Gross Receivable" value={`NPR ${fmtNPR(preview.fees.grossAmount)}`} />
              <Row label="Broker Commission" value={`- NPR ${fmtNPR(preview.fees.commission)}`} />
              <Row label="SEBON Fee"         value={`- NPR ${fmtNPR(preview.fees.sebonFee)}`} />
              <Row label="DP Charge"         value={`- NPR ${preview.fees.dpCharge}`} />
              
              {preview.fees.cgt > 0 && (
                <Row 
                  label={`CGT (${(preview.fees.cgtRate * 100).toFixed(1)}% on profit)`} 
                  value={`- NPR ${fmtNPR(preview.fees.cgt)}`} 
                  color="var(--loss)"
                />
              )}

              <div style={styles.divider} />
              <Row label="Net Receivable"  value={`NPR ${fmtNPR(preview.fees.netAmount)}`} bold />
              
              <div style={{ marginTop: 10 }}>
                <Row 
                  label="Estimated Profit" 
                  value={`NPR ${fmtNPR(preview.fees.netAmount - preview.buyBasis)}`} 
                  bold 
                  color={preview.fees.netAmount > preview.buyBasis ? 'var(--profit)' : 'var(--loss)'}
                />
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
      <span style={{ color: 'var(--muted)' }}>{label}</span>
      <span style={{ fontWeight: bold ? 600 : 400, color: color || 'var(--text)', fontFamily: 'var(--mono)' }}>{value}</span>
    </div>
  )
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal:   { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', width: '90%', maxWidth: 400, overflow: 'hidden' },
  header:  { padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  content: { padding: 20 },
  inputGroup: { display: 'flex', gap: 12, marginBottom: 16 },
  field:   { flex: 1, marginBottom: 16 },
  label:   { display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase' },
  closeBtn: { background: 'none', border: 'none', color: 'var(--muted)', fontSize: 24, cursor: 'pointer' },
  preview: { background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius)', padding: 12, marginBottom: 20, border: '1px solid var(--border)' },
  previewTitle: { fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 },
  divider: { height: 1, background: 'var(--border)', margin: '10px 0' },
  actions: { display: 'flex', gap: 10 },
}
