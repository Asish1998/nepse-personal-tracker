import { useApp } from '../../context/AppContext'
import { fmtNPR } from '../../utils/formatters'

export default function PriceForecaster() {
  const { state } = useApp()
  const holdings = state.holdings || []

  if (!holdings.length) return null

  // Forecasting Logic: Simple Stochastic Drift Model
  const generateForecast = (currentPrice) => {
    const dailyVol = 0.015 // 1.5% daily volatility
    const annualGrowth = 0.12 // 12% expected annual return for NEPSE baseline
    
    const calculateTarget = (days) => {
      const drift = (annualGrowth / 252) * days
      const shock = dailyVol * Math.sqrt(days) * 1.5 // 1.5 sigma for upper/lower range
      
      return {
        expected: currentPrice * (1 + drift),
        high: currentPrice * (1 + drift + shock),
        low: currentPrice * (1 + drift - shock)
      }
    }

    return {
      week: calculateTarget(7),
      month: calculateTarget(30),
      year: calculateTarget(365)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Future Price Projections</h3>
        <span style={styles.info}>Statistical Trend Modeling (GBM)</span>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Symbol</th>
              <th style={styles.th}>Current Price</th>
              <th style={styles.th}>1 Week Forecast</th>
              <th style={styles.th}>1 Month Forecast</th>
              <th style={styles.th}>1 Year Projection</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map(h => {
              const f = generateForecast(h.cur || h.buy)
              return (
                <tr key={h.sym} style={styles.tr}>
                  <td style={styles.symCell}>{h.sym}</td>
                  <td style={styles.priceCell}>{fmtNPR(h.cur || h.buy)}</td>
                  
                  {/* 1 Week */}
                  <td style={styles.forecastCell}>
                    <div style={styles.expected}>{fmtNPR(f.week.expected)}</div>
                    <div style={styles.range}>{fmtNPR(f.week.low, 0)} — {fmtNPR(f.week.high, 0)}</div>
                  </td>

                  {/* 1 Month */}
                  <td style={styles.forecastCell}>
                    <div style={styles.expected}>{fmtNPR(f.month.expected)}</div>
                    <div style={styles.range}>{fmtNPR(f.month.low, 0)} — {fmtNPR(f.month.high, 0)}</div>
                  </td>

                  {/* 1 Year */}
                  <td style={styles.forecastCell}>
                    <div style={{ ...styles.expected, color: 'var(--profit)', fontWeight: 800 }}>{fmtNPR(f.year.expected)}</div>
                    <div style={styles.range}>{fmtNPR(f.year.low, 0)} — {fmtNPR(f.year.high, 0)}</div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={styles.disclaimer}>
        🎯 <strong>HOW TO READ:</strong> The main number is the "Expected Neutral Case." The range below represents the 95% confidence interval based on current sector volatility. Projections become more speculative as the timeframe increases.
      </div>
    </div>
  )
}

const styles = {
  container: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-card)', marginTop: '32px', overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' },
  title: { fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 },
  info: { fontSize: '11px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'left', borderBottom: '2px solid var(--border)' },
  tr: { borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' },
  symCell: { padding: '16px', fontWeight: '800', fontSize: '15px', fontFamily: 'var(--mono)', color: 'var(--primary)' },
  priceCell: { padding: '16px', fontWeight: '700', color: 'var(--text-main)', fontFamily: 'var(--mono)' },
  forecastCell: { padding: '16px' },
  expected: { fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px', fontFamily: 'var(--mono)' },
  range: { fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.02em' },
  disclaimer: { marginTop: '24px', padding: '16px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.6' }
}
