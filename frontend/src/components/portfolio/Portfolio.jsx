import { useState, useRef } from 'react'
import SummaryCards  from './SummaryCards'
import HoldingForm   from './HoldingForm'
import HoldingsTable from './HoldingsTable'
import TradesTable   from '../journal/TradesTable'
import PortfolioChart from './PortfolioChart'
import { useApp } from '../../context/AppContext'
import { exportHoldingsToExcel, importHoldingsFromExcel } from '../../utils/excelUtils'

export default function Portfolio() {
  const { state, dispatch } = useApp()
  const [showForm, setShowForm] = useState(false)
  const fileInputRef = useRef(null)

  const handleExport = () => {
    exportHoldingsToExcel(state.holdings)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const imported = await importHoldingsFromExcel(file)
      if (imported.length > 0) {
        if (confirm(`Do you want to replace your current ${state.holdings.length} holdings with ${imported.length} holdings from the file?`)) {
          dispatch({ type: 'SET_HOLDINGS', payload: imported })
        }
      } else {
        alert('No valid data found in file.')
      }
    } catch (err) {
      alert('Error importing file: ' + err.message)
    }
    e.target.value = '' // Reset input
  }

  return (
    <div>
      <SummaryCards />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24, marginBottom: 24 }}>
        <PortfolioChart />
        {/* Placeholder for future charts or stats */}
      </div>

      <div className="card" style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}>Current Holdings</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".xlsx,.xls,.csv" 
              onChange={handleFileChange}
            />
            <button className="btn-secondary" style={{ fontSize: 13, padding: '8px 16px' }} onClick={handleImportClick}>Import</button>
            <button className="btn-secondary" style={{ fontSize: 13, padding: '8px 16px' }} onClick={handleExport}>Export</button>
            <button
              className={showForm ? 'btn-secondary' : 'btn-accent'}
              style={{ fontSize: 13, padding: '8px 16px' }}
              onClick={() => setShowForm(f => !f)}
            >
              {showForm ? 'Cancel' : '+ Add Holding'}
            </button>
          </div>
        </div>

        {showForm && <HoldingForm onClose={() => setShowForm(false)} />}
        <HoldingsTable />
      </div>

      <div className="card" style={{ ...styles.card, marginTop: 24 }}>
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}>Recent Trades</span>
        </div>
        <TradesTable />
      </div>
    </div>
  )
}

const styles = {
  card:       { padding: '24px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 },
  cardTitle:  { fontSize: 14, fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.02em', textTransform: 'uppercase' },
}