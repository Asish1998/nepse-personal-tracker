import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import FamilyBOIDManager from './FamilyBOIDManager'

const FALLBACK_COMPANIES = [
  { id: '271', name: 'Appolo Hydropower Limited' },
  { id: '269', name: 'Kalinchowk Hydropower Limited' },
  { id: '268', name: 'Taksar Pikhuwa Khola Hydropower' },
  { id: '265', name: 'Sopan Pharmaceuticals Limited' }
]

export default function IPOCenter() {
  const { state } = useApp()
  const [companies, setCompanies] = useState(FALLBACK_COMPANIES)
  const [selectedCompany, setSelectedCompany] = useState(FALLBACK_COMPANIES[0].id)
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetchingCompanies, setFetchingCompanies] = useState(false)

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    setFetchingCompanies(true)
    try {
      const API_BASE = import.meta.env.VITE_NEPSE_API || 'http://localhost:3001'
      const res = await fetch(`${API_BASE}/ipo/companies`)
      if (!res.ok) throw new Error('Failed to load companies')
      const data = await res.json()
      
      const list = data.body || data.companyShareList || []
      if (list.length > 0) {
        setCompanies(list)
        setSelectedCompany(list[0].id)
      }
    } catch (err) {
      console.error('Using fallback IPO list due to CDSC block:', err)
    } finally {
      setFetchingCompanies(false)
    }
  }

  const checkBulkResults = async () => {
    if (!selectedCompany) return alert('Please select a company.')
    if (state.familyBOIDs.length === 0) return alert('Please add at least one family BOID.')

    setLoading(true)
    const newResults = {}
    const API_BASE = import.meta.env.VITE_NEPSE_API || 'http://localhost:3001'

    for (const member of state.familyBOIDs) {
      try {
        const res = await fetch(`${API_BASE}/ipo/check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            boid: member.boid,
            companyShareId: selectedCompany
          })
        })
        const data = await res.json()
        newResults[member.id] = data
      } catch (err) {
        newResults[member.id] = { success: false, message: 'Server error' }
      }
      // Small delay to prevent CDSC server pressure
      await new Promise(r => setTimeout(r, 400))
    }

    setResults(newResults)
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>IPO Control Center</h1>
        <p style={styles.subtitle}>Check results for multiple accounts instantly.</p>
      </div>

      <FamilyBOIDManager />

      <div style={styles.actionCard}>
        <h3 style={styles.actionTitle}>Bulk Result Checker</h3>
        <div style={styles.controls}>
          <select 
            style={styles.select} 
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            disabled={fetchingCompanies}
          >
            {fetchingCompanies ? (
              <option>Loading active IPOs...</option>
            ) : (
              companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
            )}
          </select>
          <button 
            onClick={checkBulkResults} 
            disabled={loading || state.familyBOIDs.length === 0}
            style={styles.checkBtn}
          >
            {loading ? 'Checking All Accounts...' : '✨ Check Results Now'}
          </button>
        </div>

        {Object.keys(results).length > 0 && (
          <div style={styles.resultsGrid}>
            {state.familyBOIDs.map(member => {
              const res = results[member.id]
              const isAllotted = res?.success && res?.message?.toLowerCase()?.includes('allotted')
              const statusText = res?.message || 'Waiting for result...'

              return (
                <div 
                  key={member.id} 
                  style={{ 
                    ...styles.resultCard, 
                    borderColor: isAllotted ? '#22c55e' : (res?.success ? 'rgba(255,255,255,0.1)' : '#ef4444'),
                    background: isAllotted ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.02)'
                  }}
                >
                  <div style={styles.rmName}>{member.name}</div>
                  <div style={styles.rmBoid}>{member.boid}</div>
                  <div style={{ ...styles.rmStatus, color: isAllotted ? '#22c55e' : (res?.success ? 'var(--text-muted)' : '#ef4444') }}>
                    {isAllotted ? '🎉 ' + statusText : statusText}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '24px 0'
  },
  header: {
    marginBottom: '32px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: 'var(--text-main)',
    margin: 0
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-muted)',
    marginTop: '8px'
  },
  actionCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '24px'
  },
  actionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-main)',
    marginBottom: '20px'
  },
  controls: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px'
  },
  select: {
    flex: 1,
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: 'var(--text-main)',
    fontSize: '15px',
    outline: 'none'
  },
  checkBtn: {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: 'white',
    border: 'none',
    padding: '0 32px',
    borderRadius: '10px',
    fontWeight: '800',
    cursor: 'pointer',
    fontSize: '15px',
    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
  },
  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '16px',
    marginTop: '24px',
    borderTop: '1px solid var(--border)',
    paddingTop: '24px'
  },
  resultCard: {
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid transparent',
    transition: 'all 0.3s ease'
  },
  rmName: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--text-main)',
    marginBottom: '4px'
  },
  rmBoid: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontFamily: 'monospace',
    marginBottom: '16px'
  },
  rmStatus: {
    fontSize: '14px',
    fontWeight: '600'
  }
}
