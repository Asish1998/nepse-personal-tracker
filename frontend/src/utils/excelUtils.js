import * as XLSX from 'xlsx'

/**
 * Exports current holdings to an Excel file
 * @param {Array} holdings 
 */
export function exportHoldingsToExcel(holdings) {
  if (!holdings || holdings.length === 0) return alert('No holdings to export')

  // Prepare data for export
  const data = holdings.map(h => ({
    'Symbol': h.sym,
    'Quantity': h.qty,
    'Buy Price': h.buy,
    'Current Price': h.cur,
    'Purchase Date': h.date,
    'Total Cost': (h.qty * h.buy).toFixed(2),
    'Current Value': (h.qty * h.cur).toFixed(2),
    'P/L': ((h.cur - h.buy) * h.qty).toFixed(2)
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Holdings')

  // Generate and download file
  XLSX.writeFile(workbook, `NEPSE_Portfolio_${new Date().toISOString().split('T')[0]}.xlsx`)
}

/**
 * Parses an Excel file and returns an array of holding objects
 * @param {File} file 
 * @returns {Promise<Array>}
 */
export function importHoldingsFromExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const bstr = e.target.result
        const workbook = XLSX.read(bstr, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        
        // Convert to array of arrays for deep scanning
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        if (rows.length === 0) return resolve([])

        // 1. Identify the Header Row (the one with the most stock keywords)
        // Priority-ordered keys (most specific first)
        const symKeys = ['symbol', 'sym', 'scrip', 'ticker', 'scripname', 'particular', 'stock']
        const qtyKeys = ['qty', 'quantity', 'currentholding', 'units', 'balance', 'holding', 'vol', 'share', 'totalqty', 'availableqty']
        const buyKeys = ['wacc', 'averageprice', 'avgprice', 'buy', 'cost', 'rate', 'purchase', 'price', 'entry', 'purchaseprice']
        const invKeys = ['inv', 'totalcost', 'purchaseamount', 'amount', 'costvalue', 'investment', 'totalcostamount']
        const curKeys = ['ltp', 'lastpriced', 'cur', 'market', 'current', 'price', 'marketprice']
        const mktKeys = ['mktvalue', 'marketvalue', 'valueatltp', 'currentvalue', 'value', 'mktamt', 'totalmarketvalue']
        const plKeys  = ['pl', 'profitloss', 'unrealizedpl', 'gainloss', 'overallpl', 'totalprofitloss']

        let headerIdx = -1
        let colMap = { sym: -1, qty: -1, buy: -1, cur: -1, date: -1, inv: -1, mkt: -1, pl: -1 }

        for (let i = 0; i < Math.min(rows.length, 30); i++) {
          const row = rows[i]
          if (!row || !Array.isArray(row)) continue
          
          // Aggressive normalization: remove non-alphanumeric, lower case
          const rowStr = row.map(c => (c || '').toString().toLowerCase().replace(/[^a-z0-9]/g, ''))
          
          let matches = 0
          let tempMap = { sym: -1, qty: -1, buy: -1, cur: -1, inv: -1, mkt: -1, pl: -1, date: -1 }
          
          rowStr.forEach((cell, idx) => {
            if (symKeys.includes(cell) && tempMap.sym === -1) { tempMap.sym = idx; matches++ }
            if (qtyKeys.includes(cell) && tempMap.qty === -1) { tempMap.qty = idx; matches++ }
            if (buyKeys.includes(cell) && tempMap.buy === -1) { tempMap.buy = idx; matches++ }
            if (invKeys.includes(cell) && tempMap.inv === -1) { tempMap.inv = idx; matches++ }
            if (curKeys.includes(cell) && tempMap.cur === -1) { tempMap.cur = idx; matches++ }
            if (mktKeys.includes(cell) && tempMap.mkt === -1) { tempMap.mkt = idx; matches++ }
            if (plKeys.includes(cell)  && tempMap.pl === -1)  { tempMap.pl  = idx; matches++ }
            if (['date', 'time', 'bought'].some(k => cell.includes(k))) tempMap.date = idx
          })

          if (matches >= 2) { 
            headerIdx = i
            colMap = tempMap
            break
          }
        }

        if (headerIdx === -1) {
          return reject(new Error('Could not find a valid table header (Symbol, Quantity, Price) in the file.'))
        }

        // 2. Parse data rows below the header
        const headers = rows[headerIdx]
        const mapped = rows.slice(headerIdx + 1).map((row, index) => {
          if (!row || row[colMap.sym] === undefined) return null
          
          const cleanNum = (val) => {
            if (val === undefined || val === null || val === '') return NaN
            if (typeof val === 'number') return val
            // Remove commas, currency symbols, and spaces
            const cleaned = val.toString().replace(/[$,\s]/g, '')
            return parseFloat(cleaned)
          }

          const symStr = row[colMap.sym]?.toString().trim().toUpperCase()
          const qtyVal = cleanNum(row[colMap.qty])
          
          // Cross-calculate Buy/Investment
          let buyVal = cleanNum(row[colMap.buy])
          let invVal = colMap.inv !== -1 ? cleanNum(row[colMap.inv]) : NaN
          
          if (isNaN(buyVal) && !isNaN(invVal) && qtyVal > 0) {
            buyVal = invVal / qtyVal
          } else if (isNaN(invVal) && !isNaN(buyVal)) {
            invVal = qtyVal * buyVal
          }

          if (!symStr || isNaN(qtyVal) || qtyVal <= 0 || isNaN(buyVal) || buyVal <= 0) return null
          
          // Mkt and P/L derivation
          let mktVal = colMap.mkt !== -1 ? cleanNum(row[colMap.mkt]) : NaN
          let plVal  = colMap.pl  !== -1 ? cleanNum(row[colMap.pl])  : NaN
          let curVal = colMap.cur !== -1 ? cleanNum(row[colMap.cur]) : NaN

          if (isNaN(curVal) && !isNaN(mktVal) && qtyVal > 0) {
            curVal = mktVal / qtyVal
          } else if (isNaN(mktVal) && !isNaN(curVal)) {
            mktVal = qtyVal * curVal
          }

          const finalCur = isNaN(curVal) ? buyVal : curVal
          const finalMkt = isNaN(mktVal) ? (qtyVal * finalCur) : mktVal
          const finalPL  = isNaN(plVal)  ? (finalMkt - invVal) : plVal

          // Preservation for original fields
          const displayObj = {}
          headers.forEach((h, i) => {
            if (h) displayObj[h] = row[i]
          })

          return {
            id: Date.now() + index,
            sym: symStr,
            qty: qtyVal,
            buy: buyVal,
            cur: finalCur,
            inv: invVal,
            mkt: finalMkt,
            pl:  finalPL,
            date: colMap.date !== -1 ? row[colMap.date] : new Date().toISOString().split('T')[0],
            isImported: true,
            _displayData: displayObj
          }
        }).filter(Boolean)

        resolve(mapped)
      } catch (err) {
        reject(err)
      }
    }

    reader.onerror = reject
    reader.readAsBinaryString(file)
  })
}
