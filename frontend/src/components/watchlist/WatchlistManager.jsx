import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'

export default function WatchlistManager() {
  const { state, dispatch } = useApp()
  const [newSym, setNewSym] = useState('')
  const [prices, setPrices] = useState({})
  const [symbols, setSymbols] = useState([])

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_NEPSE_API || 'http://localhost:3001'
    fetch(`${API_BASE}/symbols`).then(res => res.json()).then(data => {
      setSymbols(Array.isArray(data) ? data.map(d => (d.symbol||d.sym||'').toUpperCase()) : [])
    })

    // Initial price fetch for watchlist
    fetchPrices()
    const id = setInterval(fetchPrices, 60_000)
    return () => clearInterval(id)
  }, [state.watchlist])

  async function fetchPrices() {
    const API_BASE = import.meta.env.VITE_NEPSE_API || 'http://localhost:3001'
    const newPrices = { ...prices }
    for (const sym of state.watchlist) {
      try {
        const res = await fetch(`${API_BASE}/price?symbol=${sym}`)
        if (res.ok) {
          const data = await res.json()
          newPrices[sym] = data
        }
      } catch (err) {}
    }
    setPrices(newPrices)
  }

  function add() {
    const s = newSym.toUpperCase().trim()
    if (!s) return
    if (state.watchlist.includes(s)) return alert('Already in watchlist.')
    dispatch({ type: 'ADD_WATCH', payload: s })
    setNewSym('')
  }

  function remove(sym) {
    dispatch({ type: 'REMOVE_WATCH', payload: sym })
  }

  return (
    <div className="watchlist-container">
      <div style={styles.header}>
        <h2 style={styles.title}>Smart Watchlist</h2>
        <div style={styles.addArea}>
          <input 
            list="watchlist-symbols"
            placeholder="Add symbol..."
            value={newSym}
            onChange={e => setNewSym(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            style={styles.input}
          />
          <datalist id="watchlist-symbols">
            {symbols.map(s => <option key={s} value={s} />)}
          </datalist>
          <button className="btn-accent" onClick={add} style={styles.addBtn}>Add</button>
        </div>
      </div>

      <div style={styles.grid}>
        {state.watchlist.length === 0 ? (
          <div className="card" style={styles.empty}>
            <div style={{ fontSize: 44, marginBottom: 16 }}>🔭</div>
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>Watchlist is empty</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Add symbols to track real-time price movements.</p>
          </div>
        ) : (
          state.watchlist.map(sym => {
            const data = prices[sym]
            const price = data?.price || '--'
            const percent = data?.percentChange || 0
            const isUp = percent >= 0

            return (
              <div key={sym} className="card" style={styles.watchCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.symbol}>{sym}</div>
                  <button style={styles.removeBtn} onClick={() => remove(sym)} title="Remove from watchlist">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                
                <div style={styles.priceRow}>
                  <div style={styles.price}>{price !== '--' ? `NPR ${price}` : '--'}</div>
                  <div style={{ 
                    ...styles.change, 
                    color: isUp ? 'var(--profit)' : 'var(--loss)',
                    background: isUp ? 'hsla(142, 71%, 45%, 0.1)' : 'hsla(0, 84%, 60%, 0.1)'
                  }}>
                    {isUp ? '▲' : '▼'} {Math.abs(percent).toFixed(2)}%
                  </div>
                </div>

                <div style={styles.footer}>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', fontWeight: 600 }}>
                    Real-time Data • Alpha Feed
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 20, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' },
  addArea: { display: 'flex', gap: 8 },
  input: { width: 140, height: 40, fontSize: 13, fontWeight: 600 },
  addBtn: { height: 40, padding: '0 16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 },
  empty: { gridColumn: '1 / -1', padding: '64px 20px', textAlign: 'center', background: 'var(--bg-sidebar)', borderStyle: 'dashed' },
  watchCard: { padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  symbol: { fontSize: 22, fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-main)' },
  removeBtn: { background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
  price: { fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)' },
  change: { fontSize: 11, fontWeight: 900, padding: '4px 8px', borderRadius: 6 },
  footer: { marginTop: 4, paddingTop: 12, borderTop: '1px solid var(--border)' }
}

