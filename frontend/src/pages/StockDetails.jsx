import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { fmtNPR } from '../utils/formatters'
import Layout from '../components/layout/Layout'
import TradingViewWidget from '../components/charts/TradingViewWidget'
import { getFundamentalData } from '../utils/stockData'

export default function StockDetails() {
  const { symbol } = useParams()
  const { state } = useApp()
  const [activeTab, setActiveTab] = useState('About')

  const symUpperCase = symbol?.toUpperCase()
  const holding = state.holdings.find(h => h.sym === symUpperCase)
  const facts = getFundamentalData(symUpperCase)

  if (!holding) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2 style={{ color: 'var(--text-muted)' }}>Stock Not Found</h2>
          <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: 24, textDecoration: 'none' }}>
            Back to Dashboard
          </Link>
        </div>
      </Layout>
    )
  }

  const fundamentalData = [
    { label: 'Sector', value: facts.sector || holding.sector, color: 'var(--accent)' },
    { label: 'Shares Outstanding', value: facts.sharesOutstanding?.toLocaleString() || 'N/A' },
    { label: 'Market Price', value: fmtNPR(holding.cur), color: 'var(--loss)' },
    { label: '% Change', value: '0 %', color: 'var(--loss)' },
    { label: '52 Weeks High - Low', value: facts.range52w },
    { label: '1 Year Yield', value: facts.yield, color: 'var(--profit)' },
    { label: 'EPS', value: facts.eps },
    { label: 'P/E Ratio', value: facts.pe },
    { label: 'Book Value', value: facts.bookValue },
    { label: 'PBV', value: facts.pbv },
    { label: '% Dividend', value: facts.dividend, color: 'var(--accent)' },
  ]

  const tabContent = {
    'About': [
      { label: 'Symbol', value: symUpperCase },
      { label: 'Company Name', value: holding.name || facts.name || 'Company Profile' },
      { label: 'Sector', value: facts.sector || holding.sector },
      { label: 'Listed Shares', value: facts.sharesOutstanding?.toLocaleString() || 'N/A' },
      { label: 'Paidup Value', value: '100.00' },
      { label: 'Total Equity Capital', value: facts.sharesOutstanding ? fmtNPR(facts.sharesOutstanding * 100, 0) : 'N/A' },
    ]
  }

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <Link to="/" style={styles.backLink}>← TERMINAL</Link>
          <div style={styles.divider}></div>
          <h1 style={styles.pageTitle}>{holding.name || symUpperCase}</h1>
          <span style={styles.symBadge}>{symUpperCase}</span>
        </div>
        <div style={styles.navRight}>
           <div style={styles.liveIndicator}>● LIVE</div>
        </div>
      </nav>

      <Layout>
        <div className="dashboard-grid" style={styles.topSection}>
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

          <div style={styles.chartColumn}>
            <div className="card" style={styles.chartWrapper}>
              <TradingViewWidget symbol={symUpperCase} />
            </div>
          </div>
        </div>

        <div style={styles.tabContainer}>
          <div className="tabs-wrapper" style={styles.tabs}>
            {['About', 'Announcements', 'News', 'Dividend'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ ...styles.tabBtn, ...(activeTab === tab ? styles.tabActive : {}) }}>{tab}</button>
            ))}
          </div>

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
              <div style={styles.emptyTab}>No {activeTab} data available for this position.</div>
            )}
          </div>
        </div>
      </Layout>
    </div>
  )
}

const styles = {
  page: { background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: 60 },
  nav: { background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 },
  navLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  backLink: { color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '800', fontSize: '11px', letterSpacing: '0.05em' },
  divider: { width: 1, height: 20, background: 'var(--border)' },
  pageTitle: { fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' },
  symBadge: { background: 'var(--primary)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '800', fontFamily: 'var(--mono)' },
  navRight: { display: 'flex', alignItems: 'center' },
  liveIndicator: { color: 'var(--profit)', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: 6 },
  topSection: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginTop: '32px', alignItems: 'stretch' },
  fundamentalColumn: { background: 'var(--bg-card)', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  cardHeader: { padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,0,0,0.02)' },
  cardIcon: { fontSize: '18px' },
  cardHeaderText: { fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  fundamentalTable: { width: '100%', borderCollapse: 'collapse', margin: 0 },
  labelCell: { padding: '12px 20px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' },
  valueCell: { padding: '12px 20px', fontSize: '13px', fontWeight: '800', textAlign: 'right', borderBottom: '1px solid var(--border)', fontFamily: 'var(--mono)' },
  chartColumn: { height: '600px' },
  chartWrapper: { height: '100%', padding: 0, overflow: 'hidden' },
  tabContainer: { marginTop: '40px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' },
  tabBtn: { background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '10px 20px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s' },
  tabActive: { background: 'var(--secondary)', color: 'white', borderColor: 'var(--secondary)', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' },
  tabData: { padding: 0, overflow: 'hidden' },
  infoTable: { width: '100%', borderCollapse: 'collapse' },
  infoLabel: { padding: '16px 24px', fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', width: '300px' },
  infoValue: { padding: '16px 24px', fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', borderBottom: '1px solid var(--border)', fontFamily: 'var(--mono)' },
  emptyTab: { padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600' }
}
