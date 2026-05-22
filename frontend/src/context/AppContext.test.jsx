import { describe, it, expect } from 'vitest'
import { appReducer } from './AppContext'

describe('AppContext Reducer', () => {
  const initialState = {
    holdings: [],
    trades: [],
    alerts: [],
    watchlist: [],
    emailConfig: { enabled: false },
    aiConfig: { geminiKey: '' },
    familyBOIDs: [],
    isPending: false,
    isCloudSynced: false
  }

  it('should correctly ADD_HOLDING and calculate WACC', () => {
    // 1. Initial buy
    const action1 = {
      type: 'ADD_HOLDING',
      payload: { sym: 'NABIL', qty: 10, buy: 100, date: '2023-01-01', netCost: 1000 }
    }
    const state1 = appReducer(initialState, action1)
    expect(state1.holdings).toHaveLength(1)
    expect(state1.holdings[0].sym).toBe('NABIL')
    expect(state1.holdings[0].qty).toBe(10)
    expect(state1.holdings[0].buy).toBe(100) // Average buy
    expect(state1.holdings[0].inv).toBe(1000)

    // 2. Second buy to test WACC average
    const action2 = {
      type: 'ADD_HOLDING',
      payload: { sym: 'NABIL', qty: 10, buy: 200, date: '2023-01-02', netCost: 2000 }
    }
    const state2 = appReducer(state1, action2)
    expect(state2.holdings).toHaveLength(1)
    expect(state2.holdings[0].qty).toBe(20)
    expect(state2.holdings[0].buy).toBe(150) // (10*100 + 10*200) / 20
    expect(state2.holdings[0].inv).toBe(3000)
  })

  it('should correctly SELL_HOLDING and adjust inverse', () => {
    const initialStateWithHolding = {
      ...initialState,
      holdings: [{ id: 1, sym: 'NICA', qty: 100, buy: 200, inv: 20000 }]
    }

    // Sell half
    const action = {
      type: 'SELL_HOLDING',
      payload: { holdingId: 1, qty: 50, price: 300, fees: { netAmount: 15000 } }
    }
    const state = appReducer(initialStateWithHolding, action)

    expect(state.holdings).toHaveLength(1)
    expect(state.holdings[0].qty).toBe(50)
    // Buy price shouldn't change, inv should be cut in half
    expect(state.holdings[0].inv).toBe(10000)
    
    // Check trade recorded
    expect(state.trades).toHaveLength(1)
    expect(state.trades[0].type).toBe('SELL')
  })

  it('should completely remove holding if sold fully', () => {
    const initialStateWithHolding = {
      ...initialState,
      holdings: [{ id: 1, sym: 'NICA', qty: 100, buy: 200, inv: 20000 }]
    }

    const action = {
      type: 'SELL_HOLDING',
      payload: { holdingId: 1, qty: 100, price: 300, fees: { netAmount: 30000 } }
    }
    const state = appReducer(initialStateWithHolding, action)

    expect(state.holdings).toHaveLength(0)
  })

  it('should correctly handle UPDATE_HOLDINGS_PRICES_BULK', () => {
    const initialStateWithHoldings = {
      ...initialState,
      holdings: [
        { id: 1, sym: 'NICA', qty: 10, buy: 200, cur: 200, prev: 200 },
        { id: 2, sym: 'NABIL', qty: 10, buy: 150, cur: 150, prev: 150 }
      ]
    }

    const action = {
      type: 'UPDATE_HOLDINGS_PRICES_BULK',
      payload: {
        'NICA': { cur: 250, prev: 240 }, // Changed
        'NABIL': { cur: 150, prev: 150 } // Unchanged
      }
    }

    const state = appReducer(initialStateWithHoldings, action)
    expect(state.holdings[0].cur).toBe(250)
    expect(state.holdings[0].prev).toBe(240)
    expect(state.holdings[1].cur).toBe(150) // unchanged
  })

  it('UPDATE_HOLDINGS_PRICES_BULK should not mutate reference if unchanged', () => {
    const initialStateWithHoldings = {
      ...initialState,
      holdings: [
        { id: 1, sym: 'NICA', qty: 10, buy: 200, cur: 200, prev: 200 }
      ]
    }

    const action = {
      type: 'UPDATE_HOLDINGS_PRICES_BULK',
      payload: {
        'NICA': { cur: 200, prev: 200 }
      }
    }

    const state = appReducer(initialStateWithHoldings, action)
    expect(state).toBe(initialStateWithHoldings) // strict equality because changed = false
  })
})
