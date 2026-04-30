import { useState } from 'react'
import { fmtNPR } from '../../utils/formatters'

const MOCK_DATA = {
  gainers: [
    { sym: 'HBLD86', ltp: 1148.40, pt: 33.40, pct: 3.00 },
    { sym: 'KSBBLD87', ltp: 1078.40, pt: 31.40, pct: 3.00 },
    { sym: 'ICFCD88', ltp: 1201.00, pt: 34.00, pct: 2.91 },
    { sym: 'SKHL', ltp: 990.00, pt: 28.00, pct: 2.91 },
    { sym: 'RSY', ltp: 10.30, pt: 0.24, pct: 2.39 },
  ],
  losers: [
    { sym: 'NABIL', ltp: 580.00, pt: -12.40, pct: -2.10 },
    { sym: 'UPPER', ltp: 312.00, pt: -8.00, pct: -2.50 },
    { sym: 'HIDCL', ltp: 198.00, pt: -5.00, pct: -2.46 },
    { sym: 'AKPL', ltp: 285.00, pt: -7.00, pct: -2.39 },
    { sym: 'SHL', ltp: 420.00, pt: -10.00, pct: -2.33 },
  ],
  turnover: [
    { sym: 'NICA', val: '124.5M', ltp: 890.00 },
    { sym: 'HDL', val: '98.2M', ltp: 2150.00 },
    { sym: 'SHL', val: '76.4M', ltp: 450.00 },
    { sym: 'NTC', val: '65.1M', ltp: 910.00 },
    { sym: 'NABIL', val: '54.2M', ltp: 585.00 },
  ],
  volume: [
    { sym: 'HIDCL', val: '840,210', ltp: 210.00 },
    { sym: 'AKPL', val: '650,400', ltp: 310.00 },
    { sym: 'UPPER', val: '420,100', ltp: 410.00 },
    { sym: 'NICA', val: '140,200', ltp: 890.00 },
    { sym: 'SHL', val: '120,500', ltp: 450.00 },
  ],
  transactions: [
    { sym: 'SHL', val: '2,410', ltp: 450.00 },
    { sym: 'NICA', val: '1,850', ltp: 890.00 },
    { sym: 'UPPER', val: '1,204', ltp: 410.00 },
    { sym: 'HDL', val: '980', ltp: 2150.00 },
    { sym: 'AKPL', val: '850', ltp: 310.00 },
  ],
  demand: [
    { sym: 'NICA', val: '125,000', orders: 450 },
    { sym: 'HDL', val: '84,000', orders: 210 },
    { sym: 'SHL', val: '12,500', orders: 120 },
    { sym: 'NTC', val: '8,400', orders: 85 },
    { sym: 'AKPL', val: '5,100', orders: 42 },
  ],
  supply: [
    { sym: 'UPPER', val: '980,000', orders: 1240 },
    { sym: 'HIDCL', val: '750,000', orders: 980 },
    { sym: 'NABIL', val: '45,000', orders: 310 },
    { sym: 'PRVU', val: '22,000', orders: 180 },
    { sym: 'PCBL', val: '15,000', orders: 120 },
  ],
  active: [
    { sym: 'SHL', val: '12,500', orders: 2410 },
    { sym: 'NICA', val: '8,400', orders: 1850 },
    { sym: 'UPPER', val: '5,100', orders: 1204 },
    { sym: 'HDL', val: '3,200', orders: 980 },
    { sym: 'AKPL', val: '2,100', orders: 850 },
  ]
}

function LeaderTable({ data, type }) {
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
          {data.map((row, i) => (
            <tr key={i} style={styles.tr}>
              <td style={styles.tdSym}>{row.sym}</td>
              {type === 'performance' && (
                <>
                  <td style={styles.tdPrice}>{row.ltp.toFixed(2)}</td>
                  <td style={{ ...styles.tdPrice, color: row.pt >= 0 ? 'var(--profit)' : 'var(--loss)' }}>{row.pt.toFixed(2)}</td>
                  <td style={{ ...styles.tdPrice, color: row.pct >= 0 ? 'var(--profit)' : 'var(--loss)', fontWeight: 800 }}>{row.pct.toFixed(2)}%</td>
                </>
              )}
              {type === 'activity' && (
                <>
                  <td style={styles.tdPrice}>{row.val}</td>
                  <td style={styles.tdPrice}>{row.ltp.toFixed(2)}</td>
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

export default function MarketLeadersGrid() {
  const [tab1, setTab1] = useState('gainers')
  const [tab2, setTab2] = useState('turnover')
  const [tab3, setTab3] = useState('demand')

  return (
    <div style={styles.container}>
      {/* Column 1: Performance */}
      <div className="card" style={styles.card}>
        <div style={styles.tabs}>
          <button style={{ ...styles.tabBtn, ...(tab1 === 'gainers' ? styles.tabActive : {}) }} onClick={() => setTab1('gainers')}>Top Gainers</button>
          <button style={{ ...styles.tabBtn, ...(tab1 === 'losers' ? styles.tabActive : {}) }} onClick={() => setTab1('losers')}>Top Losers</button>
        </div>
        <LeaderTable data={MOCK_DATA[tab1]} type="performance" />
      </div>

      {/* Column 2: Activity */}
      <div className="card" style={styles.card}>
        <div style={styles.tabs}>
          <button style={{ ...styles.tabBtn, ...(tab2 === 'turnover' ? styles.tabActive : {}) }} onClick={() => setTab2('turnover')}>Turnover</button>
          <button style={{ ...styles.tabBtn, ...(tab2 === 'volume' ? styles.tabActive : {}) }} onClick={() => setTab2('volume')}>Volume</button>
          <button style={{ ...styles.tabBtn, ...(tab2 === 'transactions' ? styles.tabActive : {}) }} onClick={() => setTab2('transactions')}>Transactions</button>
        </div>
        <LeaderTable data={MOCK_DATA[tab2]} type="activity" />
      </div>

      {/* Column 3: Market Depth */}
      <div className="card" style={styles.card}>
        <div style={styles.tabs}>
          <button style={{ ...styles.tabBtn, ...(tab3 === 'demand' ? styles.tabActive : {}) }} onClick={() => setTab3('demand')}>Top Demand</button>
          <button style={{ ...styles.tabBtn, ...(tab3 === 'supply' ? styles.tabActive : {}) }} onClick={() => setTab3('supply')}>Top Supply</button>
          <button style={{ ...styles.tabBtn, ...(tab3 === 'active' ? styles.tabActive : {}) }} onClick={() => setTab3('active')}>Active Scrips</button>
        </div>
        <LeaderTable data={MOCK_DATA[tab3]} type="market-depth" />
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
    paddingTop: '16px',
    '&:hover': {
        textDecoration: 'underline'
    }
  }
}
