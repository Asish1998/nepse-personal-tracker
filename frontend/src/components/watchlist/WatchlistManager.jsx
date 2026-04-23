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
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>Smart Watchlist</h2>
        <div style={styles.addArea}>
          <input 
            list="watchlist-symbols"
            placeholder="Add symbol (e.g. NTC)"
            value={newSym}
            onChange={e => setNewSym(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            style={styles.input}
          />
          <datalist id="watchlist-symbols">
            {symbols.map(s => <option key={s} value={s} />)}
          </datalist>
          <button className="btn-accent" onClick={add}>Add</button>
        </div>
      </div>

      <div style={styles.grid}>
        {state.watchlist.length === 0 ? (
          <div className="card" style={styles.empty}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔭</div>
            <p style={{ color: 'var(--text-muted)' }}>Your watchlist is empty. Add symbols to track them live.</p>
          </div>
        ) : (
          state.watchlist.map(sym => {
            const data = prices[sym]
            const price = data?.price || '--'
            const change = data?.change || 0
            const percent = data?.percentChange || 0
            const isUp = change >= 0

            return (
              <div key={sym} className="card" style={styles.watchCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.symbol}>{sym}</div>
                  <button style={styles.removeBtn} onClick={() => remove(sym)}>×</button>
                </div>
                
                <div style={styles.priceRow}>
                  <div style={styles.price}>{price !== '--' ? `NPR ${price}` : '--'}</div>
                  <div style={{ 
                    ...styles.change, 
                    color: isUp ? 'var(--profit)' : 'var(--loss)',
                    background: isUp ? 'rgba(0,192,118,0.1)' : 'rgba(239,68,68,0.1)'
                  }}>
                    {isUp ? '▲' : '▼'} {Math.abs(percent).toFixed(2)}%
                  </div>
                </div>

                <div style={styles.footer}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    LTP Updated 1m ago
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  addArea: { display: 'flex', gap: 10 },
  input: { width: 180, height: 40 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 },
  empty: { gridColumn: '1 / -1', padding: 60, textAlign: 'center' },
  watchCard: { padding: 20, display: 'flex', flexDirection: 'column' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  symbol: { fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' },
  removeBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 20, cursor: 'pointer', padding: 0 },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  price: { fontSize: 22, fontWeight: 700, fontFamily: 'var(--mono)' },
  change: { fontSize: 11, fontWeight: 800, padding: '4px 8px', borderRadius: 6 },
  footer: { marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border)' }
}
