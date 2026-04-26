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
    { label: 'Last Traded On', value: new Date().toLocaleString() },
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
      { label: 'Total Paidup Value', value: fmtNPR(holding.investment || 3895942100, 0) },
    ],
    'Announcements': [],
    'News': [],
    // Add more tabs as needed
  }

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <Link to="/" style={styles.backLink}>← BACK</Link>
          <h1 style={styles.pageTitle}>{holding.name} ({symUpperCase})</h1>
        </div>
      </nav>

      <Layout>
        <div style={styles.topSection}>
          {/* Left Column: Fundamental Scorecard */}
          <div style={styles.fundamentalColumn}>
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
            <div style={styles.chartWrapper}>
              <TradingViewWidget symbol={symUpperCase} />
            </div>
          </div>
        </div>

        {/* Tabbed Navigation */}
        <div style={styles.tabContainer}>
          <div style={styles.tabs}>
            {['About', 'Announcements', 'News', 'Price History', 'Floorsheet', 'AGM', 'Quarterly Report', 'Dividend'].map(tab => (
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
          <div style={styles.tabData}>
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
              <div style={styles.emptyTab}>No {activeTab} data available for this symbol.</div>
            )}
          </div>
        </div>
      </Layout>
    </div>
  )
}

const styles = {
  page: { background: 'var(--bg-main)', minHeight: '100vh' },
  nav: { 
    background: '#047783', // NEPSE/Merolagani style teal
    padding: '12px 24px',
    color: 'white',
    display: 'flex',
    alignItems: 'center'
  },
  navLeft: { display: 'flex', alignItems: 'center', gap: '20px' },
  backLink: { color: 'white', textDecoration: 'none', fontWeight: '700', fontSize: '13px' },
  pageTitle: { fontSize: '18px', fontWeight: '800', margin: 0 },
  topSection: { 
    display: 'flex', 
    gap: '24px', 
    marginTop: '24px',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  fundamentalColumn: { 
    flex: '0 0 350px',
    background: 'white',
    border: '1px solid #047783',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  fundamentalTable: { width: '100%', borderCollapse: 'collapse', margin: 0 },
  labelCell: { 
    padding: '10px 16px', 
    fontSize: '13px', 
    fontWeight: '700', 
    color: 'var(--text-main)',
    borderBottom: '1px solid #eee'
  },
  valueCell: { 
    padding: '10px 16px', 
    fontSize: '13px', 
    fontWeight: '700', 
    textAlign: 'right',
    borderBottom: '1px solid #eee'
  },
  chartColumn: { 
    flex: '1',
    minWidth: '400px',
    height: '550px'
  },
  chartWrapper: {
    height: '100%',
    width: '100%',
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  tabContainer: { marginTop: '32px' },
  tabs: { 
    display: 'flex', 
    gap: '4px', 
    borderBottom: '1px solid #ddd',
    paddingBottom: '0',
    flexWrap: 'wrap'
  },
  tabBtn: {
    background: '#eee',
    border: '1px solid #ddd',
    borderBottom: 'none',
    padding: '10px 20px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#047783',
    cursor: 'pointer',
    borderRadius: '4px 4px 0 0'
  },
  tabActive: {
    background: '#f4a261', // Orange active tab from screenshot
    color: 'white',
    borderColor: '#f4a261'
  },
  tabData: {
    background: 'white',
    border: '1px solid #ddd',
    borderTop: 'none',
    padding: '1px'
  },
  infoTable: { width: '100%', borderCollapse: 'collapse' },
  infoLabel: { 
    padding: '12px 20px', 
    fontSize: '13px', 
    fontWeight: '700', 
    color: 'var(--text-main)',
    borderBottom: '1px solid #efefef',
    width: '250px'
  },
  infoValue: {
    padding: '12px 20px',
    fontSize: '13px',
    color: 'var(--text-main)',
    borderBottom: '1px solid #efefef'
  },
  emptyTab: { padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }
}
