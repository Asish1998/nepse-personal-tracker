import { useState } from 'react'
import { useApp } from '../../context/AppContext'

export default function EditForm({ holding, onClose }) {
  const { dispatch } = useApp()
  const [qty, setQty] = useState(holding.qty)
  const [buy, setBuy] = useState(holding.buy)
  const [date, setDate] = useState(holding.date || '')

  function submit() {
    const q = parseFloat(qty)
    const b = parseFloat(buy)
    
    if (isNaN(q) || isNaN(b) || q <= 0 || b <= 0) {
      return alert('Valid Quantity and Buy Rate are required.')
    }

    dispatch({
      type: 'UPDATE_HOLDING',
      payload: {
        id: holding.id,
        updates: { qty: q, buy: b, date }
      }
    })
    onClose()
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={{ margin: 0, fontSize: 16, color: 'var(--primary)' }}>Edit {holding.sym}</h3>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>

        <div style={styles.content}>
          <div style={styles.inputGroup}>
            <div style={styles.field}>
              <label style={styles.label}>Quantity</label>
              <input 
                type="number" 
                value={qty} 
                onChange={e => setQty(e.target.value)} 
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>WACC / Buy Rate</label>
              <input 
                type="number" 
                value={buy} 
                onChange={e => setBuy(e.target.value)} 
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Acquisition Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              style={styles.input}
            />
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.4 }}>
              Note: Editing an imported holding will convert it to a manual record and recalculate your investment mathematically based on the new rates provided.
            </div>
          </div>

          <div style={styles.actions}>
            <button className="btn-primary" onClick={submit} style={{ flex: 1, padding: '10px', fontSize: 12 }}>Save Changes</button>
            <button className="btn-secondary" onClick={onClose} style={{ padding: '10px', fontSize: 12 }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal:   { background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', width: '90%', maxWidth: 360, overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
  header:  { padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' },
  content: { padding: '24px 20px' },
  inputGroup: { display: 'flex', gap: 12, marginBottom: 16 },
  field:   { flex: 1, marginBottom: 16 },
  label:   { display: 'block', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' },
  input:   { width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: 13, fontFamily: 'var(--mono)' },
  closeBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 24, cursor: 'pointer', lineHeight: 1 },
  actions: { display: 'flex', gap: 10, marginTop: 8 },
}
