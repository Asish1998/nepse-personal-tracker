import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import AISettingsModal from '../shared/AISettingsModal'
import { supabase } from '../../utils/supabase'


const tabs = [
  { key: 'home',         label: 'Home' },
  { key: 'portfolio',    label: 'Portfolio Manager' },
  { key: 'intelligence', label: 'Market Analysis' },
  { key: 'hub',          label: 'Trading Hub' },
  { key: 'charts',       label: 'Charts'},
  { key: 'wealth',       label: 'Wealth Advisor'},
]

export default function Navbar({ active, onChange }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [showAI, setShowAI] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleTabChange = (key) => {
    if (window.location.pathname !== '/') {
      navigate('/', { state: { activeTab: key } })
    } else {
      onChange(key)
    }
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
          <button 
            onClick={toggleTheme} 
            style={styles.themeToggle} 
            title={theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {user && (
            <div className="desktop-user" style={styles.userSection}>
              <div style={styles.userInfo}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ 
                    width: 8, height: 8, borderRadius: '50%', 
                    background: supabase ? 'var(--profit)' : 'var(--text-muted)',
                    title: supabase ? 'Cloud Synced' : 'Local Mode (No Supabase)'
                  }} />
                  <div style={styles.userName}>{user.name}</div>
                </div>
                <div style={styles.userEmail}>{user.email}</div>
              </div>
              <div style={styles.actionColumn}>

                <button onClick={handleLogout} style={styles.logoutBtn}>
                  Logout
                </button>
                {!import.meta.env.VITE_GEMINI_API_KEY && (
                  <button onClick={() => setShowAI(true)} style={styles.aiSetupBtnMini} title="AI Settings">
                    ✨ Setup AI
                  </button>
                )}
                {user.role === 'admin' && (
                  <button 
                    onClick={() => navigate('/admin')} 
                    style={{ ...styles.aiSetupBtnMini, color: '#8b5cf6', borderColor: 'rgba(139, 92, 246, 0.3)' }}
                  >
                    🛠️ Admin Panel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>


      {showAI && <AISettingsModal onClose={() => setShowAI(false)} />}
    </>
  )
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: '12px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--border)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 48,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    cursor: 'pointer',
  },
  logoBox: {
    width: 36,
    height: 36,
    background: 'var(--primary)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: '20px',
    fontWeight: '900',
    color: 'var(--text-main)',
    letterSpacing: '-0.04em',
    lineHeight: '1',
  },
  brandSub: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--accent)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginTop: '4px',
  },
  nav: {
    display: 'flex',
    gap: '2px',
    background: 'hsla(210, 40%, 96.1%, 0.5)',
    padding: '4px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
  },
  tab: {
    background: 'transparent',
    border: 'none',
    borderRadius: '9px',
    padding: '10px 20px',
    fontSize: '13.5px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'var(--transition)',
    letterSpacing: '-0.01em',
  },
  tabActive: {
    color: 'var(--accent)',
    background: 'var(--bg-card)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    paddingLeft: 20,
    borderLeft: '1px solid var(--border)',
  },
  aiSetupBtnMini: {
    background: 'var(--accent-glow)',
    color: 'var(--accent)',
    border: '1px solid hsla(221, 83%, 53%, 0.2)',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '11px',
    fontWeight: '800',
    cursor: 'pointer',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--text-main)',
    letterSpacing: '-0.02em',
  },
  userEmail: {
    fontSize: '11px',
    color: 'var(--text-dim)',
    fontWeight: '600',
  },
  logoutBtn: {
    background: 'hsla(0, 84%, 60%, 0.08)',
    color: 'var(--danger)',
    border: '1px solid hsla(0, 84%, 60%, 0.15)',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  actionColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: '120px',
  },
  themeToggle: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    fontSize: '18px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'var(--transition)',
    boxShadow: 'var(--shadow-sm)',
  },
}