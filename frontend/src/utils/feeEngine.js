// ─────────────────────────────────────────────────────────────
// NEPSE Fee Engine — revised rates Jestha 2081 (May 2024)
// Pure utility. No React dependencies. Easy to unit test later.
// ─────────────────────────────────────────────────────────────

const SEBON_RATE   = 0.00015;  // 0.015% on every transaction
const DP_CHARGE    = 25;       // NPR 25 flat — sell only
const CGT_SHORT    = 0.075;    // < 365 days
const CGT_LONG     = 0.05;     // ≥ 365 days

const SLABS = [
  { limit: 50_000, rate: 0.0036 },
  { limit: 500_000, rate: 0.0033 },
  { limit: 2_000_000, rate: 0.0031 },
  { limit: 10_000_000, rate: 0.0027 },
  { limit: Infinity, rate: 0.0024 }
];

export function getCommissionInfo(amount) {
  let commission = 0;
  let remaining = amount;
  let lastLimit = 0;

  for (const slab of SLABS) {
    if (remaining <= 0) break;
    const slabSize = slab.limit - lastLimit;
    const applicable = Math.min(remaining, slabSize);
    commission += applicable * slab.rate;
    remaining -= applicable;
    lastLimit = slab.limit;
  }

  // NEPSE usually has a minimum commission of Rs 10
  commission = Math.max(10, commission);
  
  return { 
    commission, 
    effectiveRate: (commission / amount),
    label: (commission / amount * 100).toFixed(3) + '%'
  };
}

/**
 * Calculate all NEPSE charges for a transaction.
 *
 * @param {number} grossAmount   - price × quantity
 * @param {'BUY'|'SELL'} type
 * @param {number} holdingDays   - days held (for CGT on SELL)
 * @param {number} grossProfit   - profit before CGT (for SELL)
 * @returns {object} full fee breakdown
 */
export function calcFees(grossAmount, type, holdingDays = 0, grossProfit = 0) {
  if (!grossAmount || grossAmount <= 0) return { totalFees: 0, netAmount: 0, commission: 0, sebonFee: 0, dpCharge: 0, cgt: 0 };

  const { commission, label: tier } = getCommissionInfo(grossAmount);
  const sebonFee   = grossAmount * SEBON_RATE;
  
  // As per Merolagani/NEPSE rules: DP charge is Rs 25 for SELL. 
  // For BUY it's also often charged to the client.
  const dpCharge   = DP_CHARGE; 

  let cgt = 0;
  let cgtRate = 0;
  if (type === 'SELL' && grossProfit > 0) {
    cgtRate = holdingDays >= 365 ? CGT_LONG : CGT_SHORT;
    cgt = grossProfit * cgtRate;
  }

  const totalFees = commission + sebonFee + dpCharge + cgt;

  // BUY  → you pay gross + commission + sebon + dp (total outflow)
  // SELL → you receive gross - commission - sebon - dp - cgt (net inflow)
  const netAmount = type === 'BUY'
    ? grossAmount + commission + sebonFee + dpCharge
    : grossAmount - commission - sebonFee - dpCharge - cgt;

  return {
    grossAmount,
    tier,
    commission,
    sebonFee,
    dpCharge,
    cgt,
    cgtRate,
    totalFees,
    netAmount,
  };
}

/**
 * Get effective buy cost including all fees.
 * Use this as the real cost basis for P/L.
 */
export function effectiveBuyCost(qty, buyPrice) {
  const gross = qty * buyPrice;
  const fees  = calcFees(gross, 'BUY');
  if (!fees) return { totalCost: gross, effPricePerShare: buyPrice, fees: null };
  return {
    totalCost:       fees.netAmount,
    effPricePerShare: fees.netAmount / qty,
    fees,
  };
}

/**
 * Calculate holding days between two date strings.
 */
export function holdingDays(buyDateStr, sellDateStr = null) {
  const buy  = new Date(buyDateStr);
  const sell = sellDateStr ? new Date(sellDateStr) : new Date();
  return Math.floor((sell - buy) / (1000 * 60 * 60 * 24));
}