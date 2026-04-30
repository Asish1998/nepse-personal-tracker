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
        <h2 style={styles.title}>Signal Monitoring</h2>
        <button
          className={showForm ? 'btn-danger' : 'btn-accent'}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ New Price Alert'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={styles.formCard}>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Execution Symbol</label>
              <input
                list="alert-symbols"
                placeholder="e.g. NABIL"
                value={form.sym}
                onChange={e => setForm({ ...form, sym: e.target.value.toUpperCase() })}
              />
              <datalist id="alert-symbols">
                {symbols.map(s => <option key={s} value={s} />)}
              </datalist>
            </div>
            <div>
              <label style={styles.label}>Condition</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
              >
                <option value="ABOVE">Price Above (Breakout)</option>
                <option value="BELOW">Price Below (Support)</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Target LTP</label>
              <input
                type="number"
                placeholder="0.00"
                value={form.target}
                onChange={e => setForm({ ...form, target: e.target.value })}
              />
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <label style={styles.label}>Internal Notes</label>
            <input
              placeholder="Rationale for this alert..."
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <button className="btn-primary" onClick={addAlert} style={{ flex: 1 }}>Deploy Signal</button>
            <button onClick={() => setShowForm(false)} style={{ flex: 1 }}>Discard</button>
          </div>
        </div>
      )}

      <div style={styles.alertGrid}>
        {state.alerts.length === 0 ? (
          <div className="card" style={styles.empty}>
            <div style={{ fontSize: 44, marginBottom: 16 }}>🔔</div>
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>No active signals</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Set price targets to receive real-time execution alerts.</p>
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
                  background: a.status === 'TRIGGERED' ? 'var(--profit)' : 'var(--accent-glow)',
                  color: a.status === 'TRIGGERED' ? 'white' : 'var(--accent)'
                }}>
                  {a.status}
                </div>
              </div>

              <div style={styles.condition}>
                <span style={{ color: 'var(--text-dim)', fontSize: 12, fontWeight: 700 }}>CONDITION: </span>
                <span style={{ fontWeight: 800, color: a.type === 'ABOVE' ? 'var(--profit)' : 'var(--loss)' }}>
                  LTP {a.type === 'ABOVE' ? '≥' : '≤'} {fmtNPR(a.target)}
                </span>
              </div>

              {a.notes && (
                <div style={styles.notes}>"{a.notes}"</div>
              )}

              <div style={styles.cardFooter}>
                <button
                  style={styles.delBtn}
                  onClick={() => deleteAlert(a.id)}
                >
                  Terminate Alert
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="card glass-card" style={styles.settingsCard}>
        <div style={styles.settingsHeader}>
          <div style={styles.iconBox}>📧</div>
          <div>
            <h3 style={{ fontSize: 16, margin: 0 }}>Notification Bridge</h3>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Connect EmailJS for high-priority routing.</p>
          </div>
        </div>

        <div style={styles.formGridSmall}>
          <div>
            <label style={styles.label}>Service ID</label>
            <input
              placeholder="service_..."
              value={state.emailConfig?.serviceId || ''}
              onChange={e => dispatch({ type: 'UPDATE_EMAIL_CONFIG', payload: { serviceId: e.target.value } })}
              style={styles.inputSmall}
            />
          </div>
          <div>
            <label style={styles.label}>Template ID</label>
            <input
              placeholder="template_..."
              value={state.emailConfig?.templateId || ''}
              onChange={e => dispatch({ type: 'UPDATE_EMAIL_CONFIG', payload: { templateId: e.target.value } })}
              style={styles.inputSmall}
            />
          </div>
          <div>
            <label style={styles.label}>Public Key</label>
            <input
              placeholder="user_..."
              value={state.emailConfig?.publicKey || ''}
              onChange={e => dispatch({ type: 'UPDATE_EMAIL_CONFIG', payload: { publicKey: e.target.value } })}
              style={styles.inputSmall}
            />
          </div>
          <div>
            <label style={styles.label}>Recipient</label>
            <input
              placeholder="email@domain.com"
              value={state.emailConfig?.toEmail || ''}
              onChange={e => dispatch({ type: 'UPDATE_EMAIL_CONFIG', payload: { toEmail: e.target.value } })}
              style={styles.inputSmall}
            />
          </div>
        </div>

        <div style={styles.settingsFooter}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              style={{ width: 16, height: 16, flexShrink: 0 }}
              checked={!!state.emailConfig?.enabled}
              onChange={e => dispatch({ type: 'UPDATE_EMAIL_CONFIG', payload: { enabled: e.target.checked } })}
            />
            <span>Enable Real-time Email Notifications</span>
          </label>

          <button
            className="btn-primary"
            style={{ fontSize: 11, padding: '8px 16px', borderRadius: 8 }}
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
                if (res.ok) alert('Test Email Sent Successfully!')
                else alert('Email Failed. Check Console for details.')
              } catch (err) {
                alert(`Error: ${err.message}`)
              }
            }}
          >
            Send Test Route 🧪
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 20, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' },
  formCard: { marginBottom: 32, padding: 24, border: '1.5px solid var(--accent)' },
  settingsCard: { marginTop: 40, padding: 24 },
  settingsHeader: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 },
  iconBox: { width: 40, height: 40, background: 'var(--accent-glow)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
  formGridSmall: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 },
  label: { display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 8, letterSpacing: '0.05em' },
  inputSmall: { padding: '10px 14px', fontSize: 13 },
  alertGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 },
  empty: { gridColumn: '1 / -1', padding: '64px 20px', textAlign: 'center', background: 'var(--bg-sidebar)', borderStyle: 'dashed' },
  alertCard: { padding: 24, display: 'flex', flexDirection: 'column', minHeight: 200, gap: 16 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  symbol: { fontSize: 22, fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-main)' },
  timestamp: { fontSize: 10, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4 },
  status: { fontSize: 10, fontWeight: 900, padding: '4px 10px', borderRadius: 8, letterSpacing: '0.04em' },
  condition: { fontSize: 16, background: 'var(--bg-sidebar)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)' },
  notes: { fontSize: 13, fontStyle: 'italic', color: 'var(--text-muted)', background: 'var(--bg-main)', padding: '12px', borderRadius: 10, borderLeft: '3px solid var(--accent)' },
  cardFooter: { marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' },
  delBtn: { background: 'none', color: 'var(--danger)', fontSize: 12, fontWeight: 800, padding: 0, border: 'none' },
  settingsFooter: { marginTop: 24, paddingAt: 24, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700, color: 'var(--text-muted)' }
}

