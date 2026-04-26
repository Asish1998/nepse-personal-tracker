import { useState } from 'react'
import { useApp } from '../../context/AppContext'

export default function SecurityGateway() {
  const { state, dispatch } = useApp()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  if (!state.isLocked) return null

  const handleUnlock = () => {
    if (!pin) return setError('PIN is required')
    dispatch({ type: 'UNLOCK', payload: pin })
    // The unlock logic in reducer will persist the locked state if PIN is wrong
    setTimeout(() => {
      const saved = localStorage.getItem('nepse_base_v2')
      if (saved && saved.startsWith('{')) {
         // decrypted successfully
      } else {
         setError('Invalid Master PIN. Please try again.')
      }
    }, 100)
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <div style={styles.icon}>🔐</div>
        <h2 style={styles.title}>Terminal Locked</h2>
        <p style={styles.subtitle}>Your financial data is encrypted. Enter your Master PIN to continue.</p>
        
        <input 
          type="password" 
          placeholder="Enter PIN" 
          value={pin}
          onChange={e => setPin(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleUnlock()}
          style={styles.input}
          autoFocus
        />

        {error && <div style={styles.error}>{error}</div>}

        <button style={styles.button} onClick={handleUnlock}>
          Unlock Vault
        </button>

        <div style={styles.footer}>
          Encryption: AES-256 (Industrial Grade)
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'var(--bg-main)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(20px)'
  },
  card: {
    background: 'var(--bg-card)',
    padding: '40px',
    borderRadius: '24px',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-xl)',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center'
  },
  icon: { fontSize: '48px', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: '850', color: 'var(--text-main)', margin: '0 0 12px 0' },
  subtitle: { fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '32px' },
  input: {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    background: 'var(--bg-main)',
    color: 'var(--text-main)',
    fontSize: '20px',
    textAlign: 'center',
    letterSpacing: '0.4em',
    marginBottom: '16px',
    outline: 'none'
  },
  error: { color: 'var(--loss)', fontSize: '12px', fontWeight: '700', marginBottom: '16px' },
  button: {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    background: 'var(--primary)',
    color: 'white',
    fontWeight: '800',
    border: 'none',
    cursor: 'pointer'
  },
  footer: { marginTop: '32px', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }
}
