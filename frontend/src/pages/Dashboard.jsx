import { useState } from 'react'
import { AppProvider } from '../context/AppContext'
import Navbar    from '../components/layout/Navbar'
import Layout    from '../components/layout/Layout'
import Portfolio from '../components/portfolio/Portfolio'
import AlertsManager from '../components/alerts/AlertsManager'
import JournalManager from '../components/journal/JournalManager'
import WatchlistManager from '../components/watchlist/WatchlistManager'
import TechnicalChart from '../components/charts/TechnicalChart'
import IntelligenceDashboard from '../components/intelligence/IntelligenceDashboard'
import ManagerHub from '../components/layout/ManagerHub'
import TickerTape from '../components/layout/TickerTape'
import WealthManager from './WealthManager'

import MarketIntelligence from '../components/intelligence/MarketIntelligence'

// keep other stubs for now

import { useAuth } from '../context/AuthContext'

const sections = { 
  home: MarketIntelligence,
  portfolio: Portfolio, 
  hub: ManagerHub,
  charts: TechnicalChart,
  intelligence: IntelligenceDashboard,
  wealth: WealthManager
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [active, setActive] = useState('home')
  
  // Show brief loader while profile status is being fetched
  if (user?.status === 'loading') {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', color: 'var(--text-muted)', fontWeight: 600 }}>
        ⚡ Loading dashboard...
      </div>
    )
  }

  if (user?.status === 'pending') {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>⏳</div>
        <h1 style={{ fontSize: '28px', color: 'var(--primary)', marginBottom: '12px' }}>Account Review in Progress</h1>
        <p style={{ maxWidth: '450px', color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '15px' }}>
          Welcome, <strong style={{color: 'var(--primary)'}}>{user.name || user.email}</strong>. Your NEPSE Intelligence account is currently under review for premium access verification. 
          We manually verify all quant-trading terminals to ensure compliance.
        </p>
        <div style={{ marginTop: '32px', padding: '16px 24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '13px', color: 'var(--text-muted)' }}>
          Expected approval time: <span style={{ fontWeight: 700, color: 'var(--accent)' }}>2-4 Business Hours</span>
        </div>
        <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 24px', borderRadius: '8px', background: 'var(--primary)', color: 'white', fontWeight: 700, cursor: 'pointer', border: 'none' }}>
            🔄 Refresh Status
          </button>
          <button onClick={() => { logout(); window.location.href = '/login'; }} style={{ padding: '10px 24px', borderRadius: '8px', background: 'none', color: 'var(--danger)', fontWeight: 700, cursor: 'pointer', border: '1px solid var(--danger)' }}>
            Logout
          </button>
        </div>
      </div>
    )
  }

  const Section = sections[active]

  return (
    <>
      <Navbar active={active} onChange={setActive} />
      <TickerTape />
      <Layout>
        <Section onNavigate={setActive} />
      </Layout>
    </>
  )
}