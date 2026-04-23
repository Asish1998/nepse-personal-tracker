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
        const json = XLSX.utils.sheet_to_json(worksheet)

        // Map back to our internal holding structure
        const mapped = json.map((row, index) => {
          const sym = (row['Symbol'] || row['sym'] || row['Ticker'] || '').toString().trim().toUpperCase()
          const qty = parseFloat(row['Quantity'] || row['qty'] || row['Qty'] || 0)
          const buy = parseFloat(row['Buy Price'] || row['buy'] || row['Price'] || 0)
          const cur = parseFloat(row['Current Price'] || row['cur'] || buy || 0)
          const date = row['Purchase Date'] || row['date'] || new Date().toISOString().split('T')[0]

          if (!sym || qty <= 0 || buy <= 0) return null
          return { id: Date.now() + index, sym, qty, buy, cur, date }
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
