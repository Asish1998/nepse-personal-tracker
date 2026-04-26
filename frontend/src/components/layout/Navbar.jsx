import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import AISettingsModal from '../shared/AISettingsModal'

const tabs = [
  { key: 'portfolio',  label: 'Portfolio'      },
  { key: 'intelligence',label: 'Intelligence ⚡' },
  { key: 'hub',         label: 'Trading Hub 🛠️' },
  { key: 'charts',     label: 'Technical Charts'},
]

export default function Navbar({ active, onChange }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showAI, setShowAI] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <header style={styles.header}>
        <div style={styles.leftSection}>
          <div style={styles.brand}>
            <div style={styles.logoBox}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: 13, letterSpacing: '0.05em' }}>AK</span>
            </div>
            <div style={styles.brandText}>
              <div style={styles.brandName}>Personal Tracker</div>
              <div style={styles.brandSub}>NEPSE · Portfolio Manager</div>
            </div>
          </div>
          
          <nav style={styles.nav}>
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => onChange(t.key)}
                style={{ ...styles.tab, ...(active === t.key ? styles.tabActive : {}) }}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {user && (
          <div style={styles.userSection}>
            <button onClick={() => setShowAI(true)} style={styles.aiSetupBtn} title="AI Settings">
              ✨ Setup AI
            </button>
            <div style={styles.userInfo}>
              <div style={styles.userName}>{user.name}</div>
              <div style={styles.userEmail}>{user.email}</div>
            </div>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        )}
      </header>

      {showAI && <AISettingsModal onClose={() => setShowAI(false)} />}
    </>
  )
}

const styles = {
  header: {
    position: 'sticky',
    top: 16,
    zIndex: 100,
    margin: '16px 24px',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-flat)',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 32,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 32,
    height: 32,
    background: 'var(--primary)',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    lineHeight: '1.3',
  },
  brandName: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--text-main)',
    letterSpacing: '-0.02em',
  },
  brandSub: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--secondary)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    marginTop: '1px',
  },
  nav: {
    display: 'flex',
    gap: 8,
    background: 'rgba(0,0,0,0.03)',
    padding: '4px',
    borderRadius: '12px',
  },
  tab: {
    background: 'none',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  tabActive: {
    color: 'white',
    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    paddingLeft: 16,
    borderLeft: '1px solid var(--border)',
  },
  aiSetupBtn: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
    transition: 'transform 0.2s',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    lineHeight: '1.3',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  userEmail: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  logoutBtn: {
    background: 'rgba(220, 38, 38, 0.1)',
    color: 'var(--danger)',
    border: '1px solid rgba(220, 38, 38, 0.2)',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textTransform: 'none',
    letterSpacing: '0',
  }
}