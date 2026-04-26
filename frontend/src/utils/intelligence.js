import sectorMap from './sectors.json'

// 1. Trade Intelligence
export function getTradeIntelligence(trades) {
  // Only look at SELL trades to see realized outcomes
  const sellTrades = trades.filter(t => t.type === 'SELL')
  
  const totalTrades = sellTrades.length
  if (totalTrades === 0) return { 
    totalTrades: 0, 
    wins: 0, 
    losses: 0, 
    winRate: 0, 
    avgProfit: 0, 
    avgLoss: 0, 
    riskReward: 0, 
    insights: ["You haven't completed any trades yet. Sell a holding to generate insights!"] 
  }

  let wins = 0
  let losses = 0
  let totalProfitAmount = 0
  let totalLossAmount = 0

  sellTrades.forEach(t => {
    // Profit = Net Revenue (after fees) - Total Cost Basis (qty * WACC buy price)
    const costBasis = t.qty * t.buyPrice
    const profit = t.net - costBasis

    if (profit > 0) {
      wins++
      totalProfitAmount += profit
    } else {
      losses++
      totalLossAmount += Math.abs(profit)
    }
  })

  const winRate = (wins / totalTrades) * 100
  const avgProfit = wins > 0 ? totalProfitAmount / wins : 0
  const avgLoss = losses > 0 ? totalLossAmount / losses : 0
  
  // Risk/Reward ratio: average profit / average loss
  const riskReward = avgLoss === 0 ? (avgProfit > 0 ? 999 : 0) : avgProfit / avgLoss

  // Generate Insights
  const insights = []
  
  if (winRate < 50) {
    insights.push({ icon: '⚠️', text: `Your win rate is ${winRate.toFixed(1)}%. It is below 50% — strategy needs improvement or a massive risk/reward ratio to stay profitable.` })
  } else if (winRate >= 60) {
    insights.push({ icon: '🚀', text: `Excellent win rate (${winRate.toFixed(1)}%). Your setups are highly accurate.` })
  }

  if (avgLoss > avgProfit && losses > 0 && wins > 0) {
    insights.push({ icon: '🚨', text: `Your average loss (NPR ${avgLoss.toFixed(0)}) is larger than your average profit. Consider a tighter stop loss.` })
  }

  if (riskReward >= 2) {
    insights.push({ icon: '💡', text: `Great Risk/Reward ratio (${riskReward.toFixed(2)}x). You are cutting losses quickly and letting winners run.` })
  } else if (riskReward > 0 && riskReward < 1) {
    insights.push({ icon: '📉', text: `Poor Risk/Reward ratio (${riskReward.toFixed(2)}x). You are risking too much to make too little.` })
  }

  if (wins > losses && totalProfitAmount > totalLossAmount) {
    insights.push({ icon: '✅', text: 'You are profitable overall — keep up the consistency and strict risk management.' })
  }

  return {
    totalTrades,
    wins,
    losses,
    winRate,
    avgProfit,
    avgLoss,
    riskReward,
    insights
  }
}

// 2. Stock-wise Intelligence
export function getStockIntelligence(trades, holdings) {
  const stockMap = {}

  // Aggregate Realized P/L from SELL trades
  trades.filter(t => t.type === 'SELL').forEach(t => {
    if (!stockMap[t.sym]) stockMap[t.sym] = { realizedPL: 0, unrealizedPL: 0, wins: 0, losses: 0 }
    
    const costBasis = t.qty * t.buyPrice
    const profit = t.net - costBasis
    
    stockMap[t.sym].realizedPL += profit
    if (profit > 0) stockMap[t.sym].wins++
    else stockMap[t.sym].losses++
  })

  // Aggregate Unrealized P/L from Current Holdings
  // P/L = Current Value - Invested Value
  holdings.forEach(h => {
    if (!stockMap[h.sym]) stockMap[h.sym] = { realizedPL: 0, unrealizedPL: 0, wins: 0, losses: 0 }
    
    // If cur is 0 or missing, we can't compute properly, so fallback to 0 PL
    const currentPrice = h.cur > 0 ? h.cur : h.buy
    const currentValue = h.qty * currentPrice
    const investedVal = h.inv > 0 ? h.inv : (h.qty * h.buy)
    
    stockMap[h.sym].unrealizedPL += (currentValue - investedVal)
  })

  const stocks = Object.keys(stockMap).map(sym => {
    const data = stockMap[sym]
    data.totalPL = data.realizedPL + data.unrealizedPL
    data.sector = sectorMap[sym] || 'Others'
    data.sym = sym
    return data
  })

  stocks.sort((a, b) => b.totalPL - a.totalPL)

  const insights = []
  if (stocks.length > 0) {
    const bestStock = stocks[0]
    const worstStock = stocks[stocks.length - 1]

    if (bestStock.totalPL > 0) {
      insights.push({ icon: '🏆', text: `You perform best in ${bestStock.sym} (${bestStock.sector}) with NPR ${bestStock.totalPL.toFixed(0)} total profit.` })
    }
    if (worstStock.totalPL < 0) {
      insights.push({ icon: '💸', text: `You have consistently lost in ${worstStock.sym} (${worstStock.sector}). Consider avoiding this stock.` })
    }

    // Sector intelligence
    const sectorStats = {}
    stocks.forEach(s => {
      if (!sectorStats[s.sector]) sectorStats[s.sector] = 0
      sectorStats[s.sector] += s.totalPL
    })
    
    const sortedSectors = Object.entries(sectorStats).sort((a,b) => b[1] - a[1])
    if (sortedSectors.length >= 2) {
      const bestSector = sortedSectors[0]
      const worstSector = sortedSectors[sortedSectors.length - 1]
      
      if (bestSector[1] > 0) {
        insights.push({ icon: '🌟', text: `Your strongest sector is ${bestSector[0]} (NPR ${bestSector[1].toFixed(0)} P/L).` })
      }
      if (worstSector[1] < 0) {
        insights.push({ icon: '⚠️', text: `You are bleeding money in the ${worstSector[0]} sector (NPR ${Math.abs(worstSector[1]).toFixed(0)} loss).` })
      }
    }
  } else {
    insights.push({ icon: 'ℹ️', text: 'No stock data to analyze yet.' })
  }

  return { stocks, insights }
}

// 3. Portfolio Intelligence
export function getPortfolioIntelligence(holdings) {
  if (holdings.length === 0) return { 
    totalInvested: 0, 
    totalCurrent: 0, 
    totalPL: 0, 
    plPercent: 0, 
    insights: [{ icon: 'ℹ️', text: 'Your portfolio is empty. Add a holding.'}] 
  }

  let totalInvested = 0
  let totalCurrent = 0

  holdings.forEach(h => {
    const invested = h.inv > 0 ? h.inv : (h.qty * h.buy)
    const currentPrice = h.cur > 0 ? h.cur : h.buy
    const currentVal = h.qty * currentPrice

    totalInvested += invested
    totalCurrent += currentVal
  })

  const totalPL = totalCurrent - totalInvested
  const plPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0

  const insights = []
  
  if (holdings.length === 1) {
    insights.push({ icon: '🚨', text: `Your entire portfolio is heavily dependent on 1 stock (${holdings[0].sym}). Consider diversifying to reduce specific risk.` })
  } else if (holdings.length > 0) {
    // Check concentration
    let maxConcentration = 0
    let topStock = ''
    holdings.forEach(h => {
      const val = h.qty * (h.cur > 0 ? h.cur : h.buy)
      const conc = val / totalCurrent
      if (conc > maxConcentration) {
        maxConcentration = conc
        topStock = h.sym
      }
    })

    if (maxConcentration > 0.4) {
      insights.push({ icon: '⚠️', text: `High Risk: ${topStock} makes up ${(maxConcentration*100).toFixed(1)}% of your portfolio.` })
    } else {
      insights.push({ icon: '🛡️', text: `Your portfolio is well diversified. No single stock dominates your exposure.` })
    }
  }

  if (plPercent < -10) {
    insights.push({ icon: '🩸', text: `Your portfolio is down ${Math.abs(plPercent).toFixed(1)}%. Ensure your long term investments are fundamentally sound.` })
  }

  return {
    totalInvested,
    totalCurrent,
    totalPL,
    plPercent,
    insights
  }
}
