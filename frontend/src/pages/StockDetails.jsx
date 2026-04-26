import { useParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { effectiveBuyCost } from '../utils/feeEngine'
import { fmtNPR } from '../utils/formatters'
import Layout from '../components/layout/Layout'

export default function StockDetails() {
  const { symbol } = useParams()
  const { state } = useApp()

  const symUpperCase = symbol?.toUpperCase()
  const holding = state.holdings.find(h => h.sym === symUpperCase)

  if (!holding) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2 style={{ color: 'var(--text-muted)' }}>Stock Not Found</h2>
          <p style={{ marginTop: 16 }}>No data available for symbol "{symUpperCase}" in your portfolio.</p>
          <Link to="/" style={{ display: 'inline-block', marginTop: 24, padding: '8px 16px', background: 'var(--primary)', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Back to Dashboard
          </Link>
        </div>
      </Layout>
    )
  }

  // Calculate deep features
  const investment = holding.isImported ? (holding.inv || (holding.qty * holding.buy)) : effectiveBuyCost(holding.qty, holding.buy).totalCost
  const mktValue = holding.isImported ? (holding.mkt || (holding.qty * holding.cur)) : (holding.qty * holding.cur)
  const pl = holding.isImported ? (holding.pl || (mktValue - investment)) : (mktValue - investment)
  const plPercent = ((pl / investment) * 100).toFixed(2)
  const breakEven = holding.isImported ? holding.buy : effectiveBuyCost(holding.qty, holding.buy).breakEven
  
  const prev = holding.prev || holding.cur
  const changeVal = holding.cur - prev
  const dailyPL = changeVal * holding.qty

  const isProfit = pl >= 0
  const plColor = isProfit ? 'var(--profit)' : 'var(--loss)'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Mini App Bar */}
      <nav style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>← BACK TO PORTFOLIO</Link>
        </div>
        <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--primary)', letterSpacing: '0.1em' }}>
          NEPSE TERMINAL
        </div>
      </nav>

      <Layout>
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h1 className="mono" style={{ fontSize: 48, letterSpacing: '-0.02em', marginBottom: 8, lineHeight: 1 }}>{symUpperCase}</h1>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {holding.isImported ? 'Imported Asset' : 'Manual Portfolio Entry'}
              </span>
              <span style={{ padding: '4px 8px', background: 'rgba(15, 23, 42, 0.05)', borderRadius: 4, fontSize: 11, fontWeight: 700, color: 'var(--primary)' }}>
                EQ
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
              Current Price
            </div>
            <div className="mono" style={{ fontSize: 36, fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>
              {fmtNPR(holding.cur)}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: changeVal >= 0 ? 'var(--profit)' : 'var(--loss)', marginTop: 8 }}>
              {changeVal > 0 ? '▲' : (changeVal < 0 ? '▼' : '')} {fmtNPR(Math.abs(changeVal))} Today
            </div>
          </div>
        </div>

        {/* Feature Grid - The Analytics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 40 }}>
          <div className="card">
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Position Size</div>
            <div className="mono" style={{ fontSize: 24, fontWeight: 700, marginTop: 8, color: 'var(--primary)' }}>{holding.qty.toLocaleString()} <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Units</span></div>
          </div>
          
          <div className="card">
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Target Break-Even</div>
            <div className="mono" style={{ fontSize: 24, fontWeight: 700, marginTop: 8, color: 'var(--primary)' }}>{fmtNPR(breakEven)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, fontWeight: 500 }}>Inc. 0.4% SEBON + 0.015% DP</div>
          </div>

          <div className="card">
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Total Capital Deployed</div>
            <div className="mono" style={{ fontSize: 24, fontWeight: 700, marginTop: 8, color: 'var(--primary)' }}>{fmtNPR(investment, 0)}</div>
          </div>
        </div>

        {/* Deep Performance Features */}
        <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', borderBottom: '2px solid var(--primary)', paddingBottom: 8, marginBottom: 24 }}>
          Position Intelligence & Returns
        </h3>
        
        <div className="card" style={{ padding: 0 }}>
          <table style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Metric</th>
                <th style={{ textAlign: 'right' }}>Value</th>
                <th style={{ textAlign: 'right' }}>Analysis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Current Market Value</td>
                <td className="mono" style={{ textAlign: 'right', fontWeight: 700 }}>{fmtNPR(mktValue, 0)}</td>
                <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>Real-time Valuation</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Total P/L</td>
                <td className="mono" style={{ textAlign: 'right', fontWeight: 700, color: plColor }}>
                  {pl > 0 ? '+' : ''}{fmtNPR(pl, 0)}
                </td>
                <td style={{ textAlign: 'right', color: plColor, fontWeight: 700 }}>
                  {pl > 0 ? '+' : ''}{plPercent}%
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Daily Momentum</td>
                <td className="mono" style={{ textAlign: 'right', fontWeight: 700, color: dailyPL >= 0 ? 'var(--profit)' : 'var(--loss)' }}>
                  {dailyPL > 0 ? '+' : ''}{fmtNPR(dailyPL, 0)}
                </td>
                <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>Movement today</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Placeholder for future charting / NEPSE deep integrations */}
        <div style={{ marginTop: 40, padding: 32, border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius)', textAlign: 'center', background: 'rgba(15, 23, 42, 0.02)' }}>
          <p style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: 13, letterSpacing: '0.05em' }}>ADVANCED CHARTING & NEPSE ORDERBOOK</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 8 }}>Market Depth and Technical Analytics engine deploying soon.</p>
        </div>

      </Layout>
    </div>
  )
}
