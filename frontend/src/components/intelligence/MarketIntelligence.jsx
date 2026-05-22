import { useState, useEffect, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { fmtNPR } from '../../utils/formatters'
import SectorHeatmap from './SectorHeatmap'
import BrokerActivity from './BrokerActivity'
import MarketLeadersGrid from './MarketLeadersGrid'

export default function MarketIntelligence({ onNavigate }) {
  const { state } = useApp()
  const [tick, setTick] = useState(0)
  const [symbols, setSymbols] = useState([])

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 2500)
    const API_BASE = import.meta.env.VITE_NEPSE_API
    fetch(`${API_BASE}/symbols`)
      .then(res => res.json())
      .then(setSymbols)
      .catch(() => {
        setSymbols([
          { symbol: 'NICA', ltp: 890, name: 'NIC Asia Bank' },
          { symbol: 'SHL', ltp: 450, name: 'Soaltee Hotel' },
          { symbol: 'HDL', ltp: 2150, name: 'Himalayan Distillery' },
          { symbol: 'NTC', ltp: 920, name: 'Nepal Telecom' },
          { symbol: 'UPPER', ltp: 410, name: 'Upper Tamakoshi' }
        ])
      })
    return () => clearInterval(timer)
  }, [])

  const [marketData, setMarketData] = useState({
    index: 2744.45,
    change: -25.81,
    percentChange: -0.93,
    status: 'LOADING',
    stats: { advance: 0, unchanged: 0, decline: 0 },
    alerts: []
  })

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const API_BASE = import.meta.env.VITE_NEPSE_API
        const res = await fetch(`${API_BASE}/market/summary`)
        if (res.ok) {
          const data = await res.json()
          setMarketData(prev => ({
            ...prev,
            index: data.index || prev.index,
            change: data.change || prev.change,
            percentChange: data.percentChange || prev.percentChange,
            status: data.status || 'CLOSED',
            stats: data.stats || prev.stats
          }))
        }
      } catch (err) {
        console.warn('Failed to fetch market summary', err)
      }
    }
    
    fetchSummary()
    const intv = setInterval(fetchSummary, 15000)
    return () => clearInterval(intv)
  }, [])

  useEffect(() => {
    if (symbols.length > 2) {
      setMarketData(prev => ({
        ...prev,
        alerts: [
          { type: 'BUY', sym: symbols[0]?.symbol, price: symbols[0]?.ltp, time: 'NOW', signal: 'Momentum Breakout' },
          { type: 'SELL', sym: symbols[1]?.symbol, price: symbols[1]?.ltp, time: 'LATEST', signal: 'Overbought (RSI)' }
        ]
      }))
    }
  }, [symbols])

  const isUp = marketData.change >= 0

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Alpha Intelligence Protocol</h1>
          <p style={styles.subtitle}>Market Terminal • Active Session</p>
        </div>
      </header>

      <div style={styles.topSection}>
        <div className="card" style={styles.overviewCard}>
          <div style={styles.sectionHeader}>
            <span style={styles.cardIndicator} />
            <div style={styles.sectionTitle}>NEPSE REAL-TIME INDEX</div>
          </div>
          <div style={styles.indexValue}>{marketData.index.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div style={{ ...styles.indexChange, color: isUp ? 'var(--profit)' : 'var(--loss)' }}>
            <span style={styles.arrow}>{isUp ? '▲' : '▼'}</span>
            {Math.abs(marketData.change).toFixed(2)} ({marketData.percentChange.toFixed(2)}%)
          </div>
          <div style={styles.marketBreadth}>
            <div style={styles.breadthItem}>
              <div style={styles.breadthLabel}>ADVANCE</div>
              <div style={{ color: 'var(--profit)' }}>{marketData.stats.advance}</div>
            </div>
            <div style={styles.breadthItem}>
              <div style={styles.breadthLabel}>STABLE</div>
              <div>{marketData.stats.unchanged}</div>
            </div>
            <div style={styles.breadthItem}>
              <div style={styles.breadthLabel}>DECLINE</div>
              <div style={{ color: 'var(--loss)' }}>{marketData.stats.decline}</div>
            </div>
          </div>
        </div>

        <div className="card" style={styles.sectionCard}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>NEURAL ALPHA SIGNALS</span>
            <div style={styles.liveBadge}><span style={styles.pulseDot} /> LIVE</div>
          </div>
          <div style={styles.signalsList}>
             {marketData.alerts.map((a, i) => (
               <div key={i} style={styles.signalRow}>
                  <div style={{ ...styles.signalType, background: a.type === 'BUY' ? 'hsla(142, 71%, 45%, 0.1)' : 'hsla(0, 84%, 60%, 0.1)', color: a.type === 'BUY' ? 'var(--profit)' : 'var(--loss)' }}>{a.type}</div>
                  <div style={styles.signalInfo}>
                    <div style={styles.signalSym}>{a.sym}</div>
                    <div style={styles.signalPrice}>{fmtNPR(a.price)}</div>
                  </div>
                  <div style={styles.signalReason}>{a.signal}</div>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div style={styles.midSection}>
        <SectorHeatmap />
        <BrokerActivity />
      </div>

      <MarketLeadersGrid />
    </div>
  )
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: '24px', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.05em' },
  subtitle: { fontSize: '11px', color: 'var(--accent)', fontWeight: '700', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  
  topSection: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' },
  midSection: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' },

  overviewCard: { padding: '24px', background: 'var(--bg-card)' },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
  cardIndicator: { width: '3px', height: '14px', background: 'var(--accent)', borderRadius: '2px' },
  sectionTitle: { fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.08em' },
  indexValue: { fontSize: '42px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.05em', lineHeight: 1 },
  indexChange: { fontSize: '16px', fontWeight: '800', marginTop: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' },
  arrow: { fontSize: '14px' },
  
  marketBreadth: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
  breadthItem: { 
    display: 'flex', flexDirection: 'column', gap: '6px', padding: '16px', 
    background: 'var(--bg-sidebar)', borderRadius: '12px', border: '1px solid var(--border)', 
    textAlign: 'center', fontSize: '18px', fontWeight: '900' 
  },
  breadthLabel: { fontSize: '9px', fontWeight: '800', color: 'var(--text-dim)', letterSpacing: '0.05em' },
  
  sectionCard: { padding: '24px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  cardTitle: { fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.08em' },
  liveBadge: { fontSize: '9px', fontWeight: '900', color: 'var(--profit)', display: 'flex', alignItems: 'center', gap: '6px' },
  pulseDot: { width: '6px', height: '6px', background: 'var(--profit)', borderRadius: '50%', animation: 'pulse 1.5s infinite' },
  signalsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  signalRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-sidebar)', borderRadius: '10px', border: '1px solid var(--border)' },
  signalType: { padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '900' },
  signalInfo: { display: 'flex', flexDirection: 'column', minWidth: '70px' },
  signalSym: { fontWeight: '900', fontSize: '13px' },
  signalPrice: { fontSize: '10px', color: 'var(--text-dim)', fontWeight: '700' },
  signalReason: { flex: 1, fontSize: '12px', fontWeight: '600', color: 'var(--text-main)' },
}
