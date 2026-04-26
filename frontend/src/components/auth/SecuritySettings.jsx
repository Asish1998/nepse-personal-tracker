import { useState } from 'react'
import { useApp } from '../../context/AppContext'

export default function SecuritySettings() {
  const { state, dispatch } = useApp()
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [step, setStep] = useState(state.masterPin ? 'MANAGE' : 'SET')

  const handleSet = () => {
    if (newPin.length < 4) return alert('PIN must be at least 4 digits.')
    if (newPin !== confirmPin) return alert('PINs do not match.')
    dispatch({ type: 'SET_PIN', payload: newPin })
    alert('Security Vault Activated! Your data is now encrypted.')
    setStep('MANAGE')
  }

  const handleRemove = () => {
    if (confirm('Disable encryption? Your data will be stored in plaintext again.')) {
      dispatch({ type: 'SET_PIN', payload: null })
      setStep('SET')
    }
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.icon}>{state.masterPin ? '🛡️' : '🔓'}</span>
        <h3 style={styles.title}>Security Vault</h3>
      </div>

      {step === 'SET' ? (
        <div style={styles.content}>
          <p style={styles.desc}>Encrypt your holdings and BOIDs with AES-256. If a PIN is set, you will need to enter it every time you open the app.</p>
          <input 
             type="password" 
             placeholder="Choose 4+ digit PIN" 
             value={newPin} 
             onChange={e => setNewPin(e.target.value)} 
             style={styles.input}
          />
          <input 
             type="password" 
             placeholder="Confirm PIN" 
             value={confirmPin} 
             onChange={e => setConfirmPin(e.target.value)} 
             style={styles.input}
          />
          <button className="btn-primary" style={styles.btn} onClick={handleSet}>Activate Vault</button>
        </div>
      ) : (
        <div style={styles.content}>
          <div style={styles.status}>
            <span style={styles.dot} /> Vault is ACTIVE & Encrypted
          </div>
          <p style={styles.desc}>Your records are scrambled on the disk. Only your Master PIN can unlock them.</p>
          <button className="btn-danger" style={{ ...styles.btn, background: 'none', border: '1px solid var(--loss)', color: 'var(--loss)' }} onClick={handleRemove}>
            Disable Vault
          </button>
        </div>
      )}

      <div style={styles.warning}>
        <strong>Heads up:</strong> If you lose this PIN, your data CANNOT be recovered. Local storage is physical; there is no 'Forgot PIN' for offline encryption.
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: 'var(--bg-card)',
    borderRadius: '16px',
    border: '1px solid var(--border)',
    padding: '24px',
    marginBottom: '24px'
  },
  header: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  icon: { fontSize: '20px' },
  title: { fontSize: '15px', fontWeight: '800', margin: 0, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  content: { display: 'flex', flexDirection: 'column', gap: '12px' },
  desc: { fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 8px 0' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '14px' },
  btn: { width: '100%', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' },
  status: { fontSize: '12px', fontWeight: '800', color: 'var(--profit)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', background: 'var(--profit)', boxShadow: '0 0 10px var(--profit)' },
  warning: { marginTop: '20px', padding: '12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--loss)', fontSize: '11px', lineHeight: '1.4' }
}
