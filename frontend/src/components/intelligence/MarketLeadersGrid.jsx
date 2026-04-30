import { useState, useEffect } from 'react'
import { fmtNPR } from '../../utils/formatters'

export default function MarketLeadersGrid() {
  const [tab1, setTab1] = useState('gainers')
  const [tab2, setTab2] = useState('turnover') // We'll map activity to 'active' for now
  const [tab3, setTab3] = useState('active')
  
  const [data, setData] = useState({
    gainers: [],
    losers: [],
    active: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const API_BASE = import.meta.env.VITE_NEPSE_API
        const res = await fetch(`${API_BASE}/market/leaders`)
        if (!res.ok) throw new Error('Failed to fetch leaders')
        const json = await res.json()
        setData(json)
        setLoading(false)
      } catch (err) {
        console.error('Leader fetch error:', err)
        setLoading(false)
      }
    }

    fetchLeaders()
    const id = setInterval(fetchLeaders, 60000) // update every minute
    return () => clearInterval(id)
  }, [])

  function LeaderTable({ tableData, type }) {
    if (loading && !tableData.length) {
      return <div style={{ padding: '40px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>Loading live data...</div>
    }

    if (!tableData?.length) {
      return <div style={{ padding: '40px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>No data available</div>
    }

    return (
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Symbol</th>
              {type === 'performance' && (
                <>
                  <th style={styles.thRight}>LTP</th>
                  <th style={styles.thRight}>Pt. Change</th>
                  <th style={styles.thRight}>% Change</th>
                </>
              )}
              {type === 'activity' && (
                <>
                  <th style={styles.thRight}>Metric</th>
                  <th style={styles.thRight}>LTP</th>
                </>
              )}
              {type === 'market-depth' && (
                <>
                  <th style={styles.thRight}>Top Quantity</th>
                  <th style={styles.thRight}>Orders</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {tableData.slice(0, 5).map((row, i) => (
              <tr key={i} style={styles.tr}>
                <td style={styles.tdSym}>{row.sym}</td>
                {type === 'performance' && (
                  <>
                    <td style={styles.tdPrice}>{parseFloat(row.ltp || 0).toFixed(2)}</td>
                    <td style={{ ...styles.tdPrice, color: row.pt >= 0 ? 'var(--profit)' : 'var(--loss)' }}>{parseFloat(row.pt || 0).toFixed(2)}</td>
                    <td style={{ ...styles.tdPrice, color: row.pct >= 0 ? 'var(--profit)' : 'var(--loss)', fontWeight: 800 }}>{parseFloat(row.pct || 0).toFixed(2)}%</td>
                  </>
                )}
                {type === 'activity' && (
                  <>
                    <td style={styles.tdPrice}>{row.val}</td>
                    <td style={styles.tdPrice}>{parseFloat(row.ltp || 0).toFixed(2)}</td>
                  </>
                )}
                {type === 'market-depth' && (
                  <>
                    <td style={styles.tdPrice}>{row.val}</td>
                    <td style={styles.tdPrice}>{row.orders}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <button style={styles.viewMore}>view more</button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Column 1: Performance */}
      <div className="card" style={styles.card}>
        <div style={styles.tabs}>
          <button style={{ ...styles.tabBtn, ...(tab1 === 'gainers' ? styles.tabActive : {}) }} onClick={() => setTab1('gainers')}>Top Gainers</button>
          <button style={{ ...styles.tabBtn, ...(tab1 === 'losers' ? styles.tabActive : {}) }} onClick={() => setTab1('losers')}>Top Losers</button>
        </div>
        <LeaderTable tableData={data[tab1]} type="performance" />
      </div>

      {/* Column 2: Activity (Simulated from Active for now) */}
      <div className="card" style={styles.card}>
        <div style={styles.tabs}>
          <button style={{ ...styles.tabBtn, ...(tab2 === 'turnover' ? styles.tabActive : {}) }} onClick={() => setTab2('turnover')}>Turnover</button>
          <button style={{ ...styles.tabBtn, ...(tab2 === 'volume' ? styles.tabActive : {}) }} onClick={() => setTab2('volume')}>Volume</button>
        </div>
        <LeaderTable tableData={data.active} type="activity" />
      </div>

      {/* Column 3: Market Depth */}
      <div className="card" style={styles.card}>
        <div style={styles.tabs}>
          <button style={{ ...styles.tabBtn, ...(tab3 === 'active' ? styles.tabActive : {}) }} onClick={() => setTab3('active')}>Active Scrips</button>
        </div>
        <LeaderTable tableData={data.active} type="market-depth" />
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    marginTop: '32px'
  },
  card: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg-card)',
    minHeight: '400px'
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '12px',
    flexWrap: 'wrap'
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '11px',
    fontWeight: '800',
    textTransform: 'uppercase',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    letterSpacing: '0.05em'
  },
  tabActive: {
    color: 'var(--accent)',
    background: 'var(--accent-glow)',
  },
  tableWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    fontSize: '10px',
    textTransform: 'uppercase',
    color: 'var(--text-dim)',
    paddingBottom: '12px',
    fontWeight: '800'
  },
  thRight: {
    textAlign: 'right',
    fontSize: '10px',
    textTransform: 'uppercase',
    color: 'var(--text-dim)',
    paddingBottom: '12px',
    fontWeight: '800'
  },
  tr: {
    borderBottom: '1px solid var(--border)',
  },
  tdSym: {
    padding: '12px 0',
    fontSize: '13px',
    fontWeight: '900',
    color: 'var(--text-main)',
    fontFamily: 'var(--mono)'
  },
  tdPrice: {
    padding: '12px 0',
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--text-main)',
    textAlign: 'right',
    fontFamily: 'var(--mono)'
  },
  viewMore: {
    background: 'none',
    border: 'none',
    color: 'var(--accent)',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: 'auto',
    textAlign: 'right',
    paddingTop: '16px'
  }
}
