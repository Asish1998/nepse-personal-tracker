import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { fmtNPR } from '../../utils/formatters'

export default function AlertsManager() {
  const { state, dispatch } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [symbols, setSymbols] = useState([])

  const [form, setForm] = useState({
    sym: '',
    target: '',
    type: 'ABOVE', // ABOVE or BELOW
    notes: ''
  })

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_NEPSE_API || 'http://localhost:3001'
    fetch(`${API_BASE}/symbols`).then(res => res.json()).then(data => {
      setSymbols(Array.isArray(data) ? data.map(d => (d.symbol || d.sym || '').toUpperCase()) : [])
    }).catch(() => setSymbols([]))
  }, [])

  function addAlert() {
    if (!form.sym || !form.target) return alert('Symbol and target price are required.')
    dispatch({
      type: 'ADD_ALERT',
      payload: {
        id: Date.now(),
        ...form,
        target: parseFloat(form.target),
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      }
    })
    setForm({ sym: '', target: '', type: 'ABOVE', notes: '' })
    setShowForm(false)
  }

  function deleteAlert(id) {
    if (confirm('Delete this alert?')) {
      dispatch({ type: 'DELETE_ALERT', payload: id })
    }
  }

  return (
    <div className="alerts-container">
      <div style={styles.header}>
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>Signal Alerts</h2>
        <button
          className={showForm ? 'btn-secondary' : 'btn-accent'}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Create Alert'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={styles.formCard}>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Symbol</label>
              <input
                list="alert-symbols"
                placeholder="e.g. NABIL"
                value={form.sym}
                onChange={e => setForm({ ...form, sym: e.target.value.toUpperCase() })}
                style={{ width: '100%' }}
              />
              <datalist id="alert-symbols">
                {symbols.map(s => <option key={s} value={s} />)}
              </datalist>
            </div>
            <div>
              <label style={styles.label}>Alert Type</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="ABOVE">Price Above</option>
                <option value="BELOW">Price Below</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Target Price</label>
              <input
                type="number"
                placeholder="Target LTP"
                value={form.target}
                onChange={e => setForm({ ...form, target: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={styles.label}>Notes (Optional)</label>
            <input
              placeholder="e.g. Resistance level breakout"
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <button className="btn-primary" onClick={addAlert}>Set Signal</button>
            <button onClick={() => setShowForm(false)}>Discard</button>
          </div>
        </div>
      )}

      <div style={styles.alertGrid}>
        {state.alerts.length === 0 ? (
          <div className="card" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div>
            <p style={{ color: 'var(--text-muted)' }}>No active alerts. Create one to monitor price signals.</p>
          </div>
        ) : (
          state.alerts.map(a => (
            <div key={a.id} className="card" style={styles.alertCard}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.symbol}>{a.sym}</div>
                  <div style={styles.timestamp}>{new Date(a.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{
                  ...styles.status,
                  background: a.status === 'TRIGGERED' ? 'var(--profit)' : 'rgba(99, 102, 241, 0.1)',
                  color: a.status === 'TRIGGERED' ? 'white' : 'var(--primary)'
                }}>
                  {a.status}
                </div>
              </div>

              <div style={styles.condition}>
                <span style={{ color: 'var(--text-muted)' }}>Signal: </span>
                <span style={{ fontWeight: 700, color: a.type === 'ABOVE' ? 'var(--profit)' : 'var(--loss)' }}>
                  LTP {a.type === 'ABOVE' ? '≥' : '≤'} {fmtNPR(a.target)}
                </span>
              </div>

              {a.notes && (
                <div style={styles.notes}>"{a.notes}"</div>
              )}

              <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  style={{ background: 'none', color: 'var(--loss)', fontSize: 13, padding: 0 }}
                  onClick={() => deleteAlert(a.id)}
                >
                  Delete Alert
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="card" style={styles.settingsCard}>
        <h3 style={{ fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          📧 Email Notification Settings
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
          Setup EmailJS (free) to receive instant email alerts when your targets are hit.
        </p>

        <div style={styles.formGrid}>
          <div>
            <label style={styles.label}>Service ID</label>
            <input
              placeholder="service_..."
              value={state.emailConfig?.serviceId || ''}
              onChange={e => dispatch({ type: 'UPDATE_EMAIL_CONFIG', payload: { serviceId: e.target.value } })}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={styles.label}>Template ID</label>
            <input
              placeholder="template_..."
              value={state.emailConfig?.templateId || ''}
              onChange={e => dispatch({ type: 'UPDATE_EMAIL_CONFIG', payload: { templateId: e.target.value } })}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={styles.label}>Public Key</label>
            <input
              placeholder="user_..."
              value={state.emailConfig?.publicKey || ''}
              onChange={e => dispatch({ type: 'UPDATE_EMAIL_CONFIG', payload: { publicKey: e.target.value } })}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={styles.label}>Destination Email</label>
            <input
              placeholder="your@email.com"
              value={state.emailConfig?.toEmail || ''}
              onChange={e => dispatch({ type: 'UPDATE_EMAIL_CONFIG', payload: { toEmail: e.target.value } })}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
            <input
              type="checkbox"
              checked={!!state.emailConfig?.enabled}
              onChange={e => dispatch({ type: 'UPDATE_EMAIL_CONFIG', payload: { enabled: e.target.checked } })}
            />
            {state.emailConfig?.enabled ? 'Email Notifications Enabled' : 'Enable Email Notifications'}
          </label>

          <button
            className="btn-secondary"
            style={{ fontSize: 11, padding: '4px 10px' }}
            onClick={async () => {
              const { serviceId, templateId, publicKey, toEmail } = state.emailConfig
              if (!serviceId || !publicKey) return alert('Enter Service ID and Public Key first.')

              try {
                const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    service_id: serviceId,
                    template_id: templateId,
                    user_id: publicKey,
                    template_params: {
                      to_email: toEmail,
                      subject: 'NEPSE App Test Email',
                      symbol: 'TEST',
                      type: 'ABOVE',
                      target: 1000,
                      ltp: 1050,
                      notes: 'Testing your alert configuration.'
                    }
                  })
                })
                if (res.ok) alert('Test Email Sent Successfully! Check your inbox.')
                else {
                  const errText = await res.text()
                  alert(`Email Failed: ${errText || 'Check your IDs'}`)
                }
              } catch (err) {
                alert(`Error: ${err.message}`)
              }
            }}
          >
            Send Test Email 🧪
          </button>
        </div>
      </div>
    </div>
  )
}


const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  formCard: { marginBottom: 32, padding: 24, border: '2px solid var(--primary)' },
  settingsCard: { marginTop: 40, padding: 24, background: 'rgba(255, 255, 255, 0.03)' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 },
  label: { display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6, letterSpacing: '0.05em' },
  alertGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 },
  alertCard: { padding: 20, display: 'flex', flexDirection: 'column', minHeight: 180 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  symbol: { fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' },
  timestamp: { fontSize: 10, color: 'var(--text-muted)', marginTop: 2 },
  status: { fontSize: 9, fontWeight: 800, padding: '4px 8px', borderRadius: 6, letterSpacing: '0.06em' },
  condition: { fontSize: 15, marginBottom: 12 },
  notes: { fontSize: 13, fontStyle: 'italic', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.02)', padding: '8px 12px', borderRadius: 8 }
}
