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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleTabChange = (key) => {
    onChange(key)
    setIsMenuOpen(false)
  }

  return (
    <>
      <header className="navbar-container" style={styles.header}>
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
          
          <nav className="desktop-nav" style={styles.nav}>
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => handleTabChange(t.key)}
                style={{ ...styles.tab, ...(active === t.key ? styles.tabActive : {}) }}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user && (
            <div className="desktop-user" style={styles.userSection}>
              <button onClick={() => setShowAI(true)} style={styles.aiSetupBtn} title="AI Settings">
                ✨ Setup AI
              </button>
              <div style={styles.userInfo}>
                <div style={styles.userName}>{user.name}</div>
                <div style={styles.userEmail}>{user.email}</div>
              </div>
              <div style={styles.actionColumn}>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  Logout
                </button>
                <button 
                  onClick={() => window.open('/wealth-manager', '_blank')} 
                  style={styles.wealthBtn}
                >
                  💰 Wealth Manager
                </button>
              </div>
            </div>
          )}

          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={styles.menuBtn}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div style={styles.mobileOverlay}>
          <div style={styles.mobileContent}>
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => handleTabChange(t.key)}
                style={{ ...styles.mobileTab, ...(active === t.key ? styles.mobileTabActive : {}) }}
              >
                {t.label}
              </button>
            ))}
            {user && (
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{user.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{user.email}</div>
                </div>
                <button 
                  className="btn-primary" 
                  style={{ width: '100%', marginBottom: 12 }}
                  onClick={() => { setShowAI(true); setIsMenuOpen(false); }}
                >
                  ✨ AI Setup
                </button>
                <button 
                  className="btn-secondary" 
                  style={{ width: '100%', color: 'var(--loss)', borderColor: 'var(--loss)', marginBottom: 12 }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
                <button 
                  className="btn-primary" 
                  style={{ width: '100%', background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', border: 'none', padding: '10px', fontSize: '13px' }}
                  onClick={() => { window.open('/wealth-manager', '_blank'); setIsMenuOpen(false); }}
                >
                  💰 Wealth Manager
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
    width: '100%',
  },
  actionColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: '120px',
  },
  wealthBtn: {
    background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: '10px',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(251, 191, 36, 0.2)',
    transition: 'transform 0.2s',
    whiteSpace: 'nowrap',
  },
  menuBtn: {
    display: 'none', // Overwritten by CSS in index.css for mobile
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: 'var(--text-main)',
    cursor: 'pointer',
    padding: '4px',
  },
  mobileOverlay: {
    position: 'fixed',
    top: 'var(--header-height)',
    left: 0,
    right: 0,
    bottom: 0,
    background: 'var(--bg-main)',
    zIndex: 99,
    padding: '24px',
    animation: 'fadeIn 0.2s ease-out',
  },
  mobileContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mobileTab: {
    width: '100%',
    textAlign: 'left',
    padding: '16px',
    borderRadius: '12px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-main)',
    cursor: 'pointer',
  },
  mobileTabActive: {
    background: 'var(--primary)',
    color: 'white',
    borderColor: 'var(--primary)',
  },
}