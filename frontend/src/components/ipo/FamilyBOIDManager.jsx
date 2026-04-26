import { useState } from 'react'
import { useApp } from '../../context/AppContext'

export default function FamilyBOIDManager() {
  const { state, dispatch } = useApp()
  const [name, setName] = useState('')
  const [boid, setBoid] = useState('')
  const [editingId, setEditingId] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (boid.length !== 16) return alert('BOID must be exactly 16 digits.')
    
    if (editingId) {
      dispatch({ type: 'UPDATE_BOID', payload: { id: editingId, name, boid } })
      setEditingId(null)
    } else {
      dispatch({ type: 'ADD_BOID', payload: { name, boid } })
    }
    setName('')
    setBoid('')
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setName(item.name)
    setBoid(item.boid)
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>Manage Family Members</h3>
      <p style={styles.cardSub}>Store multiple BOIDs to check IPO results in bulk.</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <input 
            style={styles.input} 
            placeholder="Account Name (e.g. Father)" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input 
            style={styles.input} 
            placeholder="16-Digit BOID" 
            value={boid}
            onChange={(e) => setBoid(e.target.value.replace(/\D/g, '').slice(0, 16))}
            required
          />
          <button type="submit" style={styles.btn}>
            {editingId ? 'Update' : 'Add Account'}
          </button>
        </div>
      </form>

      <div style={styles.list}>
        {state.familyBOIDs.length === 0 ? (
          <div style={styles.empty}>No family accounts added yet.</div>
        ) : (
          state.familyBOIDs.map(item => (
            <div key={item.id} style={styles.item}>
              <div style={styles.info}>
                <div style={styles.name}>{item.name}</div>
                <div style={styles.boid}>{item.boid}</div>
              </div>
              <div style={styles.actions}>
                <button onClick={() => handleEdit(item)} style={styles.iconBtn}>✏️</button>
                <button onClick={() => dispatch({ type: 'REMOVE_BOID', payload: item.id })} style={styles.iconBtn}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-main)',
    marginBottom: '8px'
  },
  cardSub: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    marginBottom: '24px'
  },
  form: {
    marginBottom: '24px'
  },
  inputGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr auto',
    gap: '12px'
  },
  input: {
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: 'var(--text-main)',
    fontSize: '14px'
  },
  btn: {
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    padding: '0 24px',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px'
  },
  item: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '16px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid transparent',
    transition: 'border 0.2s'
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  name: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--text-main)'
  },
  boid: {
    fontSize: '13px',
    fontFamily: 'monospace',
    color: 'var(--secondary)'
  },
  actions: {
    display: 'flex',
    gap: '8px'
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    opacity: 0.7,
    transition: 'opacity 0.2s'
  },
  empty: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    padding: '24px',
    gridColumn: '1 / -1'
  }
}
