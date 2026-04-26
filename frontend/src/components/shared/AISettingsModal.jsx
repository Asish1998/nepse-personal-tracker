import { useState } from 'react'
import { useApp } from '../../context/AppContext'

export default function AISettingsModal({ onClose }) {
  const { state, dispatch } = useApp()
  const [key, setKey] = useState(state.aiConfig?.geminiKey || '')
  const [testing, setTesting] = useState(false)
  const [status, setStatus] = useState(null)

  const handleSave = async () => {
    if (!key.trim()) {
      setStatus({ type: 'error', msg: 'Key cannot be empty.' })
      return
    }

    setTesting(true)
    setStatus(null)

    // Ping Gemini to test key validity
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key.trim()}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with OK' }] }]
        })
      })

      if (res.ok) {
        dispatch({ type: 'UPDATE_AI_CONFIG', payload: { geminiKey: key.trim() } })
        setStatus({ type: 'success', msg: 'Key verified and saved!' })
        setTimeout(onClose, 1000)
      } else {
        setStatus({ type: 'error', msg: 'Invalid API Key. Please check it.' })
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Network error. Could not verify key.' })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>AI Integration Settings</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <p style={styles.desc}>
          To power the AI Trading Coach, Chatbot, and Sentiment Analyzer, please provide your Google Gemini API Key. It will be stored securely in your browser's local storage.
        </p>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Gemini API Key</label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            style={styles.input}
            placeholder="AIzaSy..."
          />
        </div>

        {status && (
          <div style={{ ...styles.status, color: status.type === 'error' ? 'var(--danger)' : 'var(--success)' }}>
            {status.msg}
          </div>
        )}

        <div style={styles.actions}>
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={styles.link}>
            Get a free key ↗
          </a>
          <button style={styles.saveBtn} onClick={handleSave} disabled={testing}>
            {testing ? 'Verifying...' : 'Save & Verify'}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  },
  modal: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '24px',
    width: '400px',
    maxWidth: '90vw',
    boxShadow: 'var(--shadow-card)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-main)',
    margin: 0
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '18px',
    cursor: 'pointer'
  },
  desc: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    marginBottom: '20px'
  },
  inputGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    fontSize: '12px',
    color: 'var(--text-main)',
    marginBottom: '8px',
    fontWeight: '600'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'rgba(0,0,0,0.2)',
    color: 'var(--text-main)',
    fontSize: '14px',
    fontFamily: 'var(--mono)'
  },
  status: {
    fontSize: '13px',
    marginBottom: '16px',
    fontWeight: '600'
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '24px'
  },
  link: {
    fontSize: '12px',
    color: 'var(--primary)',
    textDecoration: 'none',
    fontWeight: '600'
  },
  saveBtn: {
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  }
}
