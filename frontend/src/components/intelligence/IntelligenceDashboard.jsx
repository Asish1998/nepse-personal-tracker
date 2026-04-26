import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { getTradeIntelligence, getStockIntelligence, getPortfolioIntelligence } from '../../utils/intelligence'
import InsightCard from './InsightCard'
import MarketSentiment from './MarketSentiment'
import { fmtNPR } from '../../utils/formatters'
import { tellGemini } from '../../utils/aiClient'

function MetricCard({ title, value, sub, colorClass = 'text-main' }) {
  return (
    <div style={styles.metricCard}>
      <div style={styles.metricTitle}>{title}</div>
      <div style={styles.metricValue} className={colorClass}>{value}</div>
      {sub && <div style={styles.metricSub}>{sub}</div>}
    </div>
  )
}

function Section({ title, emoji, metrics, insights }) {
  return (
    <div style={styles.sectionWrap}>
      <div style={styles.sectionHeader}>
        <span style={styles.sectionEmoji}>{emoji}</span>
        <h2 style={styles.sectionTitle}>{title}</h2>
      </div>
      
      <div style={styles.metricsGrid}>
        {metrics.map((m, i) => <MetricCard key={i} {...m} />)}
      </div>

      <div style={styles.insightTitle}>Generated Insights</div>
      <div style={styles.insightsList}>
        {insights.map((ins, i) => (
          <InsightCard key={i} icon={ins.icon} text={ins.text} />
        ))}
      </div>
    </div>
  )
}

export default function IntelligenceDashboard() {
  const { state } = useApp()
  const trades = state.trades || []
  const holdings = state.holdings || []
  const apiKey = state.aiConfig?.geminiKey

  const tradeInt = getTradeIntelligence(trades)
  const stockInt = getStockIntelligence(trades, holdings)
  const portInt = getPortfolioIntelligence(holdings)

  const [aiReport, setAiReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateAIReport = async () => {
    if (!apiKey) return alert("Please configure your AI API Key in the settings first.")
    
    setLoading(true)
    try {
      const tradeData = trades.map(t => `${t.date} | ${t.sym} | ${t.type} | QTY:${t.qty} | IN:${t.buyPrice} OUT:${t.price} | P/L:${t.net - (t.buyPrice*t.qty)} | REASON: ${t.notes}`).join('\n')
      
      const prompt = `
Act as a world-class trading psychology coach. Analyze this trader's journal.
Identify patterns in their "REASON" notes vs their Profit/Loss (P/L).
If they make impulsive trades, call them out professionally.
Provide 3 highly actionable bullet points to improve their performance based exactly on their history.

TRADE JOURNAL DATA:
${tradeData || "No completed trades yet."}
`
      const report = await tellGemini(prompt, apiKey)
      setAiReport(report)
    } catch (err) {
      alert("AI Generation failed: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={styles.title}>Intelligence Center</h1>
            <p style={styles.subtitle}>Automated deep-dive analytics into your trading psychology and portfolio risk.</p>
          </div>
          <button style={styles.aiBtn} onClick={generateAIReport} disabled={loading}>
            {loading ? '🧠 Processing Journal...' : '✨ Generate Deep AI Report'}
          </button>
        </div>
      </div>

      {aiReport && (
        <div style={styles.aiReportBox}>
          <div style={styles.aiReportHeader}>
            <span>🤖 AI Trading Coach Analysis</span>
            <button onClick={() => setAiReport(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={styles.aiReportContent}>
            {aiReport.split('\n').map((line, i) => {
              if (line.startsWith('##')) return <h3 key={i} style={{color: 'var(--text-main)', marginTop: 12}}>{line.replace(/##/g, '')}</h3>
              if (line.startsWith('*') || line.startsWith('-')) return <li key={i} style={{marginLeft: 20}}>{line.substring(1)}</li>
              return <p key={i} style={{margin: '6px 0'}}>{line}</p>
            })}
          </div>
        </div>
      )}

      <MarketSentiment />

      <div style={{ padding: '16px 0' }}></div>

      <div style={styles.grid}>
        
        <Section 
          title="Trade Intelligence" 
          emoji="⚡"
          metrics={[
            { title: 'Win Rate', value: `${tradeInt.winRate.toFixed(1)}%`, sub: `${tradeInt.wins}W / ${tradeInt.losses}L`, colorClass: tradeInt.winRate >= 50 ? 'profit' : 'loss' },
            { title: 'Risk/Reward (Realized)', value: `${tradeInt.riskReward.toFixed(2)}x`, sub: `Avg Win: ${fmtNPR(tradeInt.avgProfit)}` },
            { title: 'Total Trades', value: tradeInt.totalTrades, sub: 'Completed cycles only' }
          ]}
          insights={tradeInt.insights}
        />

        <Section 
          title="Portfolio Intelligence" 
          emoji="🛡️"
          metrics={[
            { title: 'Total Return', value: `${portInt.plPercent > 0 ? '+' : ''}${portInt.plPercent.toFixed(2)}%`, sub: `NPR ${fmtNPR(portInt.totalPL)}`, colorClass: portInt.plPercent >= 0 ? 'profit' : 'loss' },
            { title: 'Total Invested', value: `NPR ${fmtNPR(portInt.totalInvested)}`, sub: 'Active holdings capital' },
            { title: 'Current Value', value: `NPR ${fmtNPR(portInt.totalCurrent)}`, sub: 'Live market valuation' }
          ]}
          insights={portInt.insights}
        />

        <Section 
          title="Stock & Sector Intelligence" 
          emoji="📊"
          metrics={[
            { title: 'Tracked Symbols', value: stockInt.stocks.length, sub: 'Over all time' },
            { title: 'Best Performer', value: stockInt.stocks[0] ? stockInt.stocks[0].sym : '-', sub: stockInt.stocks[0] ? `NPR ${fmtNPR(stockInt.stocks[0].totalPL)}` : '', colorClass: 'profit' },
            { title: 'Worst Performer', value: stockInt.stocks[stockInt.stocks.length-1] ? stockInt.stocks[stockInt.stocks.length-1].sym : '-', sub: stockInt.stocks[stockInt.stocks.length-1] ? `NPR ${fmtNPR(stockInt.stocks[stockInt.stocks.length-1].totalPL)}` : '', colorClass: 'loss' }
          ]}
          insights={stockInt.insights}
        />

      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '24px 32px',
    maxWidth: '1400px',
    margin: '0 auto',
    paddingBottom: '100px'
  },
  header: {
    marginBottom: '32px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'var(--text-main)',
    background: 'linear-gradient(135deg, white, var(--text-muted))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '15px',
    color: 'var(--text-muted)',
    fontWeight: '500'
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  },
  sectionWrap: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: 'var(--shadow-card)',
    position: 'relative',
    overflow: 'hidden'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px'
  },
  sectionEmoji: {
    fontSize: '24px',
    background: 'rgba(255,255,255,0.05)',
    padding: '8px',
    borderRadius: '8px',
    display: 'inline-flex'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-main)'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '28px'
  },
  metricCard: {
    background: 'var(--bg-main)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  metricTitle: {
    fontSize: '12px',
    textTransform: 'uppercase',
    fontWeight: '700',
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
    marginBottom: '8px'
  },
  metricValue: {
    fontSize: '24px',
    fontWeight: '800',
    fontFamily: 'var(--mono)',
    color: 'var(--text-main)'
  },
  metricSub: {
    fontSize: '11px',
    color: 'var(--secondary)',
    marginTop: '6px',
    fontWeight: '600'
  },
  insightTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '8px'
  },
  insightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  aiBtn: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
    transition: 'transform 0.2s',
  },
  aiReportBox: {
    background: 'rgba(139, 92, 246, 0.05)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '32px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)'
  },
  aiReportHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: '800',
    color: '#a78bfa',
    borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
    paddingBottom: '16px',
    marginBottom: '16px'
  },
  aiReportContent: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'var(--text-main)'
  }
}
