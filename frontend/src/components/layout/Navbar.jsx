import { useState } from 'react'

const tabs = [
  { key: 'portfolio',  label: 'Portfolio'      },
  { key: 'journal',    label: 'Trade Journal'  },
  { key: 'alerts',     label: 'Alerts'         },
  { key: 'watchlist',  label: 'Watchlist'      },
]

export default function Navbar({ active, onChange }) {
  return (
    <header className="glass" style={styles.header}>
      <div style={styles.brand}>
        <div style={styles.logoGlow}></div>
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
    </header>
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
    borderRadius: '16px',
    boxShadow: 'var(--shadow)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoGlow: {
    width: 32,
    height: 32,
    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
    position: 'relative',
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
}