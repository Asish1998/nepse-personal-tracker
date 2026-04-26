import { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext(null)

const initialState = {
  holdings: [],
  trades: [],
  importedHoldings: [],
  alerts: [],
  watchlist: [],
  emailConfig: {
    serviceId: '',
    templateId: '',
    publicKey: '',
    toEmail: '',
    enabled: false
  },
  aiConfig: {
    geminiKey: ''
  }
}

function reducer(state, action) {
  // Helper to merge holdings with Weighted Average Cost of Capital (WACC)
  const mergeHoldings = (existing, incoming) => {
    const merged = [...existing]
    incoming.forEach(newH => {
      const symStr = newH.sym.toUpperCase()
      const index = merged.findIndex(exist => exist.sym.toUpperCase() === symStr)
      if (index !== -1) {
        const exist = merged[index]
        const totalQty = exist.qty + newH.qty

        // Calculate WACC
        const existInv = (exist.inv !== undefined && exist.isImported) ? exist.inv : (exist.qty * exist.buy)
        const newInv = (newH.inv !== undefined && newH.isImported) ? newH.inv : (newH.qty * newH.buy)
        const avgBuy = (existInv + newInv) / totalQty

        // Keep most recently added/updated current price if valid
        const nextCur = (newH.cur && !isNaN(newH.cur) && newH.cur > 0) ? newH.cur : exist.cur

        merged[index] = {
          ...exist,
          qty: totalQty,
          buy: avgBuy,
          cur: nextCur,
          inv: existInv + newInv,
          isImported: exist.isImported || newH.isImported
        }

        // Aggregate Excel truth data if present
        if (newH.mkt !== undefined) merged[index].mkt = (exist.mkt || (exist.qty * exist.cur)) + newH.mkt
        if (newH.pl !== undefined) merged[index].pl = (exist.pl || 0) + newH.pl

      } else {
        merged.push({ ...newH, sym: symStr })
      }
    })
    return merged
  }

  switch (action.type) {

    case 'ADD_HOLDING': {
      const isManualAdd = !!action.payload.reason || action.payload.netCost !== undefined

      const nextHoldings = mergeHoldings(state.holdings, [action.payload])

      // Hook into Trade Journal engine for manual additions to enforce discipline
      if (isManualAdd) {
        const newTrade = {
          id: Date.now() + Math.random(),
          sym: action.payload.sym,
          type: 'BUY',
          qty: action.payload.qty,
          price: action.payload.buy,
          date: action.payload.date,
          notes: action.payload.reason || 'No strategy provided.',
          tradeCategory: action.payload.tradeCategory || 'Investment',
          stopLoss: action.payload.stopLoss || null,
          profitTarget: action.payload.profitTarget || null,
          gross: action.payload.qty * action.payload.buy,
          net: action.payload.netCost || (action.payload.qty * action.payload.buy),
          fees: action.payload.netCost ? (action.payload.netCost - (action.payload.qty * action.payload.buy)) : 0,
          shareType: action.payload.shareType || 'Secondary'
        }
        return {
          ...state,
          holdings: nextHoldings,
          trades: [newTrade, ...state.trades]
        }
      }

      return { ...state, holdings: nextHoldings }
    }
    case 'SET_HOLDINGS':
      return { ...state, holdings: action.payload }
    case 'ADD_HOLDINGS_BULK':
      return { ...state, holdings: mergeHoldings(state.holdings, action.payload) }
    case 'DELETE_HOLDING':
      return { ...state, holdings: state.holdings.filter(h => h.id !== action.payload) }
    case 'CLEAR_IMPORTED_HOLDINGS':
      return { ...state, holdings: state.holdings.filter(h => !h.isImported) }
    case 'SET_IMPORTED_HOLDINGS':
      return { ...state, importedHoldings: action.payload }
    case 'DELETE_IMPORTED_HOLDING':
      return { ...state, importedHoldings: state.importedHoldings.filter(h => h.id !== action.payload) }
    case 'UPDATE_HOLDING_PRICE':
      return {
        ...state,
        holdings: state.holdings.map(h =>
          h.sym === action.payload.sym
            ? { ...h, cur: action.payload.cur, prev: action.payload.prev || h.prev || action.payload.cur }
            : h
        ),
      }
    case 'UPDATE_HOLDINGS_PRICES_BULK': {
      let changed = false
      const nextHoldings = state.holdings.map(h => {
        const update = action.payload[h.sym]
        if (update && update !== h.cur) {
          changed = true
          return { ...h, cur: update, prev: h.cur }
        }
        return h
      })
      return changed ? { ...state, holdings: nextHoldings } : state
    }
    case 'SELL_HOLDING': {
      const { holdingId, qty, price, date, fees } = action.payload
      const holding = state.holdings.find(h => h.id === holdingId)
      if (!holding) return state

      // 1. Create trade record
      const newTrade = {
        id: Date.now(),
        sym: holding.sym,
        type: 'SELL',
        qty,
        price,
        date,
        gross: qty * price,
        net: fees.netAmount,
        fees: fees.totalFees,
        buyPrice: holding.buy,
        shareType: holding.shareType || 'Secondary', // Carry over shareType
        tradeCategory: holding.tradeCategory || 'Investment',
        stopLoss: holding.stopLoss || null,
        profitTarget: holding.profitTarget || null,
      }

      // 2. Update holdings
      let updatedHoldings
      if (holding.qty <= qty) {
        // Remove if fully sold
        updatedHoldings = state.holdings.filter(h => h.id !== holdingId)
      } else {
        // Decrease quantity
        updatedHoldings = state.holdings.map(h =>
          h.id === holdingId ? { ...h, qty: h.qty - qty } : h
        )
      }

      return {
        ...state,
        holdings: updatedHoldings,
        trades: [newTrade, ...state.trades]
      }
    }

    // ── Trades ───────────────────────────────────────
    case 'ADD_TRADE':
      return { ...state, trades: [action.payload, ...state.trades] }
    case 'DELETE_TRADE':
      return { ...state, trades: state.trades.filter(t => t.id !== action.payload) }

    // ── Alerts ───────────────────────────────────────
    case 'ADD_ALERT':
      return { ...state, alerts: [...state.alerts, action.payload] }
    case 'DELETE_ALERT':
      return { ...state, alerts: state.alerts.filter(a => a.id !== action.payload) }
    case 'UPDATE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(a =>
          a.id === action.payload.id ? { ...a, ...action.payload } : a
        ),
      }

    // ── Watchlist ────────────────────────────────────
    case 'ADD_WATCH':
      if (state.watchlist.includes(action.payload)) return state
      return { ...state, watchlist: [...state.watchlist, action.payload] }
    case 'REMOVE_WATCH':
      return { ...state, watchlist: state.watchlist.filter(w => w !== action.payload) }

    case 'UPDATE_EMAIL_CONFIG':
      return { ...state, emailConfig: { ...state.emailConfig, ...action.payload } }

    case 'UPDATE_AI_CONFIG':
      return { ...state, aiConfig: { ...state.aiConfig, ...action.payload } }

    default:
      return state
  }
}

export function AppProvider({ children, storageKey = 'nepse_base_v2' }) {
  const [state, dispatch] = useReducer(reducer, initialState, (initial) => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return initial
      const parsed = JSON.parse(saved)
      // Merge logic: ensure new fields like emailConfig exist even for old users
      return {
        ...initial,
        ...parsed,
        emailConfig: { ...initial.emailConfig, ...(parsed.emailConfig || {}) },
        aiConfig: { ...initial.aiConfig, ...(parsed.aiConfig || {}) }
      }
    } catch {
      return initial
    }
  })

  // ── Alert Monitoring Logic ────────────────────────
  useEffect(() => {
    const activeAlerts = state.alerts.filter(a => a.status === 'ACTIVE')
    if (activeAlerts.length === 0) return

    const id = setInterval(async () => {
      const API_BASE = import.meta.env.VITE_NEPSE_API || 'http://localhost:3001'

      for (const alert of activeAlerts) {
        try {
          const res = await fetch(`${API_BASE}/price?symbol=${encodeURIComponent(alert.sym)}`)
          if (!res.ok) continue
          const data = await res.json()
          const ltp = typeof data.price === 'string' ? parseFloat(data.price.replace(/[^\d.-]/g, '')) : data.price

          if (ltp) {
            const triggered = alert.type === 'ABOVE' ? ltp >= alert.target : ltp <= alert.target
            if (triggered) {
              dispatch({
                type: 'UPDATE_ALERT',
                payload: { id: alert.id, status: 'TRIGGERED', triggeredAt: new Date().toISOString() }
              })

              // 1. Browser Notification
              if (Notification.permission === 'granted') {
                new Notification(`Signal Triggered: ${alert.sym}`, {
                  body: `${alert.sym} has reached ${ltp}. (Target: ${alert.target})`
                })
              }

              // 2. EmailJS Notification
              if (state.emailConfig.enabled && state.emailConfig.serviceId) {
                const { serviceId, templateId, publicKey, toEmail } = state.emailConfig
                fetch('https://api.emailjs.com/api/v1.0/email/send', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    service_id: serviceId,
                    template_id: templateId,
                    user_id: publicKey,
                    template_params: {
                      to_email: toEmail,
                      subject: `NEPSE ALERT: ${alert.sym} Triggered!`,
                      symbol: alert.sym,
                      type: alert.type,
                      target: alert.target,
                      ltp: ltp,
                      notes: alert.notes || 'None'
                    }
                  })
                }).catch(err => console.error('Email alert failed:', err))
              }
            }
          }
        } catch (err) { /* silent fail */ }
      }
    }, 60_000) // Check every minute

    return () => clearInterval(id)
  }, [state.alerts, state.emailConfig])

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // ── Holding Price Polling Logic ───────────────────
  useEffect(() => {
    if (state.holdings.length === 0) return

    const fetchPrices = async () => {
      try {
        const API_BASE = import.meta.env.VITE_NEPSE_API || 'http://localhost:3001'
        const res = await fetch(`${API_BASE}/symbols`)
        if (!res.ok) return
        const symbolsData = await res.json()

        const priceMap = {}
        for (const item of symbolsData) {
          const sym = (item.symbol || item.sym || '').toUpperCase()
          const ltp = item.ltp ?? item.price
          if (sym && ltp) {
            priceMap[sym] = parseFloat(ltp.toString().replace(/[^\d.-]/g, ''))
          }
        }

        dispatch({ type: 'UPDATE_HOLDINGS_PRICES_BULK', payload: priceMap })
      } catch (err) { /* silent fail on network errors */ }
    }

    // Ping prices immediately on mount/load
    fetchPrices()

    // Auto-update prices every 30 seconds while the app stays open
    const id = setInterval(fetchPrices, 30_000)
    return () => clearInterval(id)
  }, [state.holdings.length])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state))
  }, [state, storageKey])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

// Clean hook — components call this, never AppContext directly
export function useApp() {
  return useContext(AppContext)
}