import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import AISettingsModal from '../shared/AISettingsModal'
import { supabase } from '../../utils/supabase'


const tabs = [
  { key: 'home',         label: 'Home' },
  { key: 'portfolio',    label: 'Portfolio'      },
  { key: 'intelligence', label: 'Analysis' },
  { key: 'hub',          label: 'Trading Hub' },
  { key: 'charts',       label: 'Charts'},
  { key: 'wealth',       label: 'Wealth Advisor'},
]

export default function Navbar({ active, onChange }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
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
                {!import.meta.env.VITE_GEMINI_API_KEY && (
                  <button 
                    className="btn-primary" 
                    style={{ width: '100%', marginBottom: 12 }}
                    onClick={() => { setShowAI(true); setIsMenuOpen(false); }}
                  >
                    ✨ AI Setup
                  </button>
                )}
                <button 
                  className="btn-secondary" 
                  style={{ width: '100%', color: 'var(--loss)', borderColor: 'var(--loss)', marginBottom: 12 }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
                <button 
                  className="btn-primary" 
                  style={{ width: '100%', background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', border: 'none', padding: '10px', fontSize: '13px', marginBottom: 12 }}
                  onClick={() => { navigate('/wealth-manager'); setIsMenuOpen(false); }}
                >
                  💰 Wealth Manager
                </button>
                {user.role === 'admin' && (
                  <button 
                    className="btn-primary" 
                    style={{ width: '100%', background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', border: 'none', padding: '10px', fontSize: '13px' }}
                    onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}
                  >
                    🛠️ Admin Panel
                  </button>
                )}
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
    gap: '4px',
    background: '#f1f5f9',
    padding: '6px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
  },
  tab: {
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 28px',
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textTransform: 'none',
    letterSpacing: '-0.02em',
  },
  tabActive: {
    color: 'var(--primary)',
    background: '#ffffff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
    transform: 'translateY(-1px)',
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
  aiSetupBtnMini: {
    background: 'none',
    color: '#10b981',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '10px',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.2s',
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
  themeToggle: {
    background: 'var(--bg-main)',
    border: '1px solid var(--border)',
    fontSize: '18px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
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