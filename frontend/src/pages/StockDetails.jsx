import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { fmtNPR } from '../utils/formatters'
import Layout from '../components/layout/Layout'
import TradingViewWidget from '../components/charts/TradingViewWidget'

export default function StockDetails() {
  const { symbol } = useParams()
  const { state } = useApp()
  const [activeTab, setActiveTab] = useState('About')

  const symUpperCase = symbol?.toUpperCase()
  const holding = state.holdings.find(h => h.sym === symUpperCase)

  if (!holding) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2 style={{ color: 'var(--text-muted)' }}>Stock Not Found</h2>
          <p style={{ marginTop: 16 }}>No data available for symbol "{symUpperCase}" in your portfolio.</p>
          <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: 24, textDecoration: 'none' }}>
            Back to Dashboard
          </Link>
        </div>
      </Layout>
    )
  }

  const fundamentalData = [
    { label: 'Sector', value: holding.sector || 'Commercial Banks', color: 'var(--accent)' },
    { label: 'Shares Outstanding', value: (holding.sharesOutstanding || 100000000).toLocaleString() },
    { label: 'Market Price', value: fmtNPR(holding.cur), color: 'var(--loss)' },
    { label: '% Change', value: '0 %', color: 'var(--loss)' },
    { label: 'Last Traded On', value: new Date().toLocaleDateString(), sub: 'At Market Close' },
    { label: '52 Weeks High - Low', value: '317.00 - 227.00' },
    { label: '120 Day Average', value: '271.32' },
    { label: '1 Year Yield', value: '18.04%', color: 'var(--profit)' },
    { label: 'EPS', value: '7.93' },
    { label: 'P/E Ratio', value: '33.80' },
    { label: 'Book Value', value: '103.69' },
    { label: 'PBV', value: '2.58' },
    { label: '% Dividend', value: '0.53', color: 'var(--accent)' },
    { label: '% Bonus', value: '-', color: 'var(--accent)' },
  ]

  const tabContent = {
    'About': [
      { label: 'Symbol', value: symUpperCase },
      { label: 'Company Name', value: holding.name || 'Sample Company Ltd.' },
      { label: 'Sector', value: holding.sector || 'Hydro Power' },
      { label: 'Listed Shares', value: (holding.sharesOutstanding || 38959421).toLocaleString() },
      { label: 'Paidup Value', value: '100.00' },
      { label: 'Total Paidup Value', value: fmtNPR(holding.qty * 100, 0) },
    ]
  }

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <Link to="/" style={styles.backLink}>← TERMINAL</Link>
          <div style={styles.divider}></div>
          <h1 style={styles.pageTitle}>{holding.name}</h1>
          <span style={styles.symBadge}>{symUpperCase}</span>
        </div>
        <div style={styles.navRight}>
           <div style={styles.liveIndicator}>● LIVE</div>
        </div>
      </nav>

      <Layout>
        <div className="dashboard-grid" style={styles.topSection}>
          {/* Left Column: Fundamental Scorecard */}
          <div className="card" style={styles.fundamentalColumn}>
             <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>📊</span>
                <span style={styles.cardHeaderText}>Holdings Fundamentals</span>
             </div>
            <table style={styles.fundamentalTable}>
              <tbody>
                {fundamentalData.map(row => (
                  <tr key={row.label}>
                    <td style={styles.labelCell}>{row.label}</td>
                    <td style={{ ...styles.valueCell, color: row.color || 'var(--text-main)' }}>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Column: Advanced Chart */}
          <div style={styles.chartColumn}>
            <div className="card" style={styles.chartWrapper}>
              <TradingViewWidget symbol={symUpperCase} />
            </div>
          </div>
        </div>

        {/* Tabbed Navigation */}
        <div style={styles.tabContainer}>
          <div className="tabs-wrapper" style={styles.tabs}>
            {['About', 'Announcements', 'News', 'Price History', 'Floorsheet', 'AGM', 'Dividend'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                style={{ ...styles.tabBtn, ...(activeTab === tab ? styles.tabActive : {}) }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Table */}
          <div className="card" style={styles.tabData}>
            {tabContent[activeTab] ? (
              <table style={styles.infoTable}>
                <tbody>
                  {tabContent[activeTab].map(row => (
                    <tr key={row.label}>
                      <td style={styles.infoLabel}>{row.label}</td>
                      <td style={styles.infoValue}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={styles.emptyTab}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🌑</div>
                No {activeTab} data available for this position in current session.
              </div>
            )}
          </div>
        </div>
      </Layout>
    </div>
  )
}

const styles = {
  page: { background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: 60 },
  nav: { 
    background: 'var(--bg-card)',
    borderBottom: '1px solid var(--border)',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  navLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  backLink: { color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '800', fontSize: '11px', letterSpacing: '0.05em' },
  divider: { width: 1, height: 20, background: 'var(--border)' },
  pageTitle: { fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' },
  symBadge: { background: 'var(--primary)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '800', fontFamily: 'var(--mono)' },
  navRight: { display: 'flex', alignItems: 'center' },
  liveIndicator: { color: 'var(--profit)', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: 6 },
  
  topSection: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
    gap: '24px', 
    marginTop: '32px',
    alignItems: 'stretch'
  },
  fundamentalColumn: { 
    background: 'var(--bg-card)',
    padding: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  cardHeader: { padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,0,0,0.02)' },
  cardIcon: { fontSize: '18px' },
  cardHeaderText: { fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  fundamentalTable: { width: '100%', borderCollapse: 'collapse', margin: 0 },
  labelCell: { 
    padding: '12px 20px', 
    fontSize: '13px', 
    fontWeight: '700', 
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border)'
  },
  valueCell: { 
    padding: '12px 20px', 
    fontSize: '13px', 
    fontWeight: '800', 
    textAlign: 'right',
    borderBottom: '1px solid var(--border)',
    fontFamily: 'var(--mono)'
  },
  chartColumn: { 
    height: '600px'
  },
  chartWrapper: {
    height: '100%',
    padding: 0,
    overflow: 'hidden'
  },
  tabContainer: { marginTop: '40px' },
  tabs: { 
    display: 'flex', 
    gap: '8px', 
    marginBottom: '16px',
    flexWrap: 'wrap'
  },
  tabBtn: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    padding: '10px 20px',
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.2s'
  },
  tabActive: {
    background: 'var(--secondary)',
    color: 'white',
    borderColor: 'var(--secondary)',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
  },
  tabData: {
    padding: 0,
    overflow: 'hidden'
  },
  infoTable: { width: '100%', borderCollapse: 'collapse' },
  infoLabel: { 
    padding: '16px 24px', 
    fontSize: '14px', 
    fontWeight: '700', 
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border)',
    width: '300px'
  },
  infoValue: {
    padding: '16px 24px',
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--text-main)',
    borderBottom: '1px solid var(--border)',
    fontFamily: 'var(--mono)'
  },
  emptyTab: { padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600' }
}
