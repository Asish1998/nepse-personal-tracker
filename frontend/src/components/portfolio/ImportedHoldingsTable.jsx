import { useApp } from '../../context/AppContext'

export default function ImportedHoldingsTable() {
  const { state, dispatch } = useApp()

  if (!state.importedHoldings || state.importedHoldings.length === 0) return null

  // Get keys from the first item's display data
  const headers = Object.keys(state.importedHoldings[0]._displayData || {})

  return (
    <div className="card" style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
          📦 Imported Data (Exact Fields)
        </span>
        <button 
          className="btn-secondary" 
          style={{ fontSize: 11, padding: '4px 10px' }} 
          onClick={() => confirm('Clear all imported data?') && dispatch({ type: 'SET_IMPORTED_HOLDINGS', payload: [] })}
        >
          Clear All
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="modern-table">
          <thead>
            <tr>
              {headers.map(h => <th key={h}>{h}</th>)}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {state.importedHoldings.map(item => (
              <tr key={item.id}>
                {headers.map(h => {
                  const val = item._displayData[h]
                  return <td key={h} style={{ fontSize: 13 }}>{val?.toLocaleString() ?? '-'}</td>
                })}
                <td>
                  <button 
                    style={{ background: 'none', color: 'var(--loss)', border: 'none', cursor: 'pointer', padding: 0, fontSize: 11 }}
                    onClick={() => dispatch({ type: 'DELETE_IMPORTED_HOLDING', payload: item.id })}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
