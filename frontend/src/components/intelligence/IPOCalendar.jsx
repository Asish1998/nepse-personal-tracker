import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'

const MOCK_IPO_DATA = [
  { company: 'Upper Syange Hydropower', type: 'IPO', units: '650,000', openDate: '2024-05-02', closeDate: '2024-05-06', status: 'OPEN' },
  { company: 'Reliance Spinners', type: 'IPO (Book Building)', units: '1,155,960', openDate: '2024-05-10', closeDate: '2024-05-14', status: 'ANNOUNCED' },
  { company: 'Siddharth Investment Growth Scheme 3', type: 'Mutual Fund', units: '120,000,000', openDate: '2024-04-20', closeDate: '2024-05-05', status: 'OPEN' },
  { company: 'NMB Bank Debenture 2090', type: 'Debenture', units: '2,000,000', openDate: '2024-04-15', closeDate: '2024-04-28', status: 'CLOSED' },
]

export default function IPOCalendar() {
  const { state } = useApp()
  const [boids, setBoids] = useState(state.familyBOIDs || [])

  useEffect(() => {
    setBoids(state.familyBOIDs || [])
  }, [state.familyBOIDs])

  const checkResult = () => {
    // Open CDSC IPO Result page in a new window
    window.open('https://iporesult.cdsc.com.np/', '_blank')
  }

  return (
    <div className="card" style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h2 style={styles.title}>IPO Intelligence 2.0</h2>
          <p style={styles.subtitle}>Institutional IPO tracking and family result management.</p>
        </div>
        <button className="btn-primary" onClick={checkResult} style={styles.checkBtn}>
          🚀 One-Click Result Check
        </button>
      </div>

      <div style={styles.grid}>
        {/* Calendar Section */}
        <div style={styles.calendarSection}>
          <h3 style={styles.sectionTitle}>Active & Upcoming Issues</h3>
          <div style={styles.list}>
            {MOCK_IPO_DATA.map((ipo, i) => (
              <div key={i} style={styles.ipoRow}>
                <div style={styles.ipoInfo}>
                  <div style={styles.companyName}>{ipo.company}</div>
                  <div style={styles.ipoMeta}>
                    <span style={styles.typeTag}>{ipo.type}</span>
                    <span style={styles.dateRange}>{ipo.openDate} to {ipo.closeDate}</span>
                  </div>
                </div>
                <div style={{
                  ...styles.statusTag,
                  background: ipo.status === 'OPEN' ? 'rgba(0,192,118,0.1)' : (ipo.status === 'CLOSED' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)'),
                  color: ipo.status === 'OPEN' ? 'var(--profit)' : (ipo.status === 'CLOSED' ? 'var(--loss)' : 'var(--primary)')
                }}>
                  {ipo.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Family BOID Management Section (Quick Access) */}
        <div style={styles.boidSection}>
          <h3 style={styles.sectionTitle}>Family Accounts ({boids.length})</h3>
          <div style={styles.boidList}>
            {boids.length > 0 ? boids.map(b => (
              <div key={b.id} style={styles.boidRow}>
                <div style={styles.boidName}>{b.name}</div>
                <div style={styles.boidNumber}>{b.boid}</div>
                <button 
                  style={styles.copyBtn} 
                  onClick={() => {
                    navigator.clipboard.writeText(b.boid)
                    alert(`BOID for ${b.name} copied!`)
                  }}
                >
                  📋 Copy
                </button>
              </div>
            )) : (
              <div style={styles.emptyBoid}>
                No family BOIDs added. Manage them in the Trading Hub.
              </div>
            )}
          </div>
          {boids.length > 0 && (
            <p style={styles.tip}>Tip: Copy the BOID and paste it on the CDSC result page.</p>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '24px', marginBottom: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
  titleGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
  title: { fontSize: '20px', fontWeight: '850', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' },
  subtitle: { fontSize: '13px', color: 'var(--text-muted)' },
  checkBtn: { padding: '10px 20px', fontSize: '14px', fontWeight: '800' },
  grid: { display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) 1fr', gap: '32px' },
  sectionTitle: { fontSize: '14px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  ipoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border)' },
  ipoInfo: { display: 'flex', flexDirection: 'column', gap: '6px' },
  companyName: { fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' },
  ipoMeta: { display: 'flex', alignItems: 'center', gap: '12px' },
  typeTag: { fontSize: '10px', fontWeight: '800', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)', padding: '2px 8px', borderRadius: '4px' },
  dateRange: { fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' },
  statusTag: { fontSize: '10px', fontWeight: '800', padding: '4px 10px', borderRadius: '6px' },
  boidSection: { background: 'rgba(0,0,0,0.02)', padding: '20px', borderRadius: '16px', border: '1px dashed var(--border)' },
  boidList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  boidRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' },
  boidName: { fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', flex: 1 },
  boidNumber: { fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontWeight: '600' },
  copyBtn: { background: 'none', border: 'none', color: 'var(--primary)', fontSize: '11px', fontWeight: '800', cursor: 'pointer', padding: '4px' },
  emptyBoid: { fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '20px' },
  tip: { fontSize: '10px', color: 'var(--text-muted)', marginTop: '16px', textAlign: 'center' }
}
