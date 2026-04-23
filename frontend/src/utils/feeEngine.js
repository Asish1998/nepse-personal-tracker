// ─────────────────────────────────────────────────────────────
// NEPSE Fee Engine — revised rates Jestha 2081 (May 2024)
// Pure utility. No React dependencies. Easy to unit test later.
// ─────────────────────────────────────────────────────────────

const SEBON_RATE   = 0.00015;  // 0.015% on every transaction
const DP_CHARGE    = 25;       // NPR 25 flat — sell only
const CGT_SHORT    = 0.075;    // < 365 days
const CGT_LONG     = 0.05;     // ≥ 365 days

export function commissionRate(amount) {
  if (amount <= 50_000)    return 0.0036;
  if (amount <= 500_000)   return 0.0033;
  if (amount <= 2_000_000) return 0.0031;
  if (amount <= 10_000_000)return 0.0027;
  return 0.0024;
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
  if (!grossAmount || grossAmount <= 0) return null;

  const rate       = commissionRate(grossAmount);
  const commission = grossAmount * rate;
  const sebonFee   = grossAmount * SEBON_RATE;
  const dpCharge   = type === 'SELL' ? DP_CHARGE : 0;

  let cgt = 0;
  let cgtRate = 0;
  if (type === 'SELL' && grossProfit > 0) {
    cgtRate = holdingDays >= 365 ? CGT_LONG : CGT_SHORT;
    cgt = grossProfit * cgtRate;
  }

  const totalFees = commission + sebonFee + dpCharge + cgt;

  // BUY  → you pay gross + fees (total outflow)
  // SELL → you receive gross - fees (net inflow)
  const netAmount = type === 'BUY'
    ? grossAmount + commission + sebonFee
    : grossAmount - commission - sebonFee - dpCharge - cgt;

  return {
    grossAmount,
    rate,
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