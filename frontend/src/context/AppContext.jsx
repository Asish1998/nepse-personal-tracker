import { createContext, useContext, useReducer, useEffect, useState, useRef } from 'react'
import { syncTradeToWealth } from '../utils/wealthSync'
import { useAuth } from './AuthContext'
import { supabase } from '../utils/supabase'

const AppContext = createContext(null)

const initialState = {
  holdings: [],
  trades: [],
  alerts: [],
  watchlist: [],
  emailConfig: { enabled: false },
  aiConfig: { geminiKey: import.meta.env.VITE_GEMINI_API_KEY || '' },
  familyBOIDs: [],
  isPending: false // Added for account review logic
}

function reducer(state, action) {
  // WACC Merge Logic
  const mergeHoldings = (existing, incoming) => {
    const merged = [...existing]
    incoming.forEach(newH => {
      const symStr = newH.sym.toUpperCase()
      const index = merged.findIndex(exist => exist.sym.toUpperCase() === symStr)
      if (index !== -1) {
        const exist = merged[index]
        const totalQty = exist.qty + newH.qty
        const existInv = (exist.inv !== undefined) ? exist.inv : (exist.qty * exist.buy)
        const newInv   = (newH.inv !== undefined)   ? newH.inv   : (newH.qty * newH.buy)
        const totalBasis = existInv + newInv
        const avgBuy = totalBasis / totalQty
        const nextCur = (newH.cur && !isNaN(newH.cur) && newH.cur > 0) ? newH.cur : (exist.cur || exist.buy)

        merged[index] = { ...exist, qty: totalQty, buy: avgBuy, cur: nextCur, inv: totalBasis }
      } else {
        const initialInv = newH.inv || (newH.qty * (newH.buy || 0))
        merged.push({ ...newH, sym: symStr, inv: initialInv })
      }
    })
    return merged
  }

  switch (action.type) {
    case 'SET_INITIAL_STATE':
      return { ...state, ...action.payload }
    case 'ADD_HOLDING': {
      const isManual = !!action.payload.reason
      const nextHoldings = mergeHoldings(state.holdings, [action.payload])
      if (isManual) {
        const newTrade = {
          id: Date.now() + Math.random(),
          sym: action.payload.sym,
          type: 'BUY',
          qty: action.payload.qty,
          price: action.payload.buy,
          date: action.payload.date,
          notes: action.payload.reason,
          net: action.payload.netCost || (action.payload.qty * action.payload.buy)
        }
        return { ...state, holdings: nextHoldings, trades: [newTrade, ...state.trades] }
      }
      return { ...state, holdings: nextHoldings }
    }
    case 'UPDATE_HOLDING_PRICE':
      return {
        ...state,
        holdings: state.holdings.map(h => 
          h.sym === action.payload.sym ? { ...h, cur: action.payload.cur, prev: action.payload.prev || h.prev || action.payload.cur } : h
        )
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
      const { holdingId, qty, price, fees } = action.payload
      const holding = state.holdings.find(h => h.id === holdingId)
      if (!holding) return state
      const unitBasis = (holding.inv || (holding.qty * holding.buy)) / holding.qty
      
      const newTrade = {
        id: Date.now(), sym: holding.sym, type: 'SELL', qty, price,
        net: fees.netAmount, buyPrice: unitBasis, basisTotal: unitBasis * qty
      }

      let updatedHoldings = holding.qty <= qty 
        ? state.holdings.filter(h => h.id !== holdingId)
        : state.holdings.map(h => h.id === holdingId ? { ...h, qty: h.qty - qty, inv: h.inv - (unitBasis * qty) } : h)

      return { ...state, holdings: updatedHoldings, trades: [newTrade, ...state.trades] }
    }
    case 'UPDATE_AI_CONFIG':
      return { ...state, aiConfig: { ...state.aiConfig, ...action.payload } }
    case 'DELETE_HOLDING':
      return { ...state, holdings: state.holdings.filter(h => h.id !== action.payload) }
    case 'ADD_HOLDINGS_BULK':
      return { ...state, holdings: mergeHoldings(state.holdings, action.payload) }
    case 'CLEAR_IMPORTED_HOLDINGS':
      return { ...state, holdings: state.holdings.filter(h => !h.isImported) }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { user } = useAuth()
  const initialFetchRef = useRef(false)

  // 1. Load Data from Supabase
  useEffect(() => {
    if (user && user.id && !initialFetchRef.current) {
      const loadUserContent = async () => {
        const { data, error } = await supabase
          .from('user_data')
          .select('content')
          .eq('user_id', user.id)
          .single()

        if (!error && data) {
          dispatch({ type: 'SET_INITIAL_STATE', payload: data.content })
        }
        initialFetchRef.current = true
      }
      loadUserContent()
    }
  }, [user])

  // 2. Persist Data to Supabase on changes
  useEffect(() => {
    if (!user || !initialFetchRef.current) return

    const saveData = async () => {
      // Save structural state (holdings, trades, etc.)
      await supabase
        .from('user_data')
        .upsert({ 
          user_id: user.id, 
          content: state, 
          updated_at: new Date().toISOString() 
        }, { onConflict: 'user_id' })
    }
    
    const timeout = setTimeout(saveData, 2000)
    return () => clearTimeout(timeout)
  }, [state, user])

  // 3. Market Price Polling
  useEffect(() => {
    if (!state.holdings?.length) return
    const fetchPrices = async () => {
      try {
        const API_BASE = import.meta.env.VITE_NEPSE_API || 'http://localhost:3001'
        const res = await fetch(`${API_BASE}/symbols`)
        if (!res.ok) return
        const symbolsData = await res.json()
        const priceMap = {}
        for (const item of symbolsData) {
          const sym = (item.symbol || '').toUpperCase()
          const ltp = item.ltp ?? item.price
          if (sym && ltp) priceMap[sym] = parseFloat(ltp)
        }
        dispatch({ type: 'UPDATE_HOLDINGS_PRICES_BULK', payload: priceMap })
      } catch (err) {}
    }
    fetchPrices()
    const id = setInterval(fetchPrices, 30000)
    return () => clearInterval(id)
  }, [state.holdings?.length])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}