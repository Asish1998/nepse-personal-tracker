export const NEPSE_FINANCIALS = {
  "AKPL": {
    "sector": "Hydropower",
    "sharesOutstanding": 38959421,
    "eps": 7.93,
    "pe": 29.14,
    "bookValue": 103.69,
    "pbv": 2.58,
    "dividend": "10.00% Bonus, 0.5263% Cash",
    "yield": "18.04%",
    "range52w": "317.00 - 227.00"
  },
  "NICA": {
    "sector": "Commercial Bank",
    "sharesOutstanding": 149175669,
    "eps": 1.76,
    "pe": 190.01,
    "bookValue": 198.33,
    "pbv": 2.15,
    "dividend": "29.00% Bonus, 1.52% Cash",
    "yield": "2.4%",
    "range52w": "650.00 - 410.00"
  }
  // Add more as needed or fetch via AI
}

export function getFundamentalData(symbol) {
  return NEPSE_FINANCIALS[symbol?.toUpperCase()] || {
    sector: "Market Generic",
    sharesOutstanding: "Syncing...",
    eps: "N/A",
    pe: "N/A",
    bookValue: "N/A",
    pbv: "N/A",
    dividend: "No data",
    yield: "N/A",
    range52w: "N/A"
  }
}
