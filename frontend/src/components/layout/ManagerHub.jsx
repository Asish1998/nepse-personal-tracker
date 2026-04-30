import SecuritySettings from '../auth/SecuritySettings'
import JournalManager from '../journal/JournalManager'
import AlertsManager from '../alerts/AlertsManager'
import WatchlistManager from '../watchlist/WatchlistManager'
import CorporateActionScanner from '../portfolio/CorporateActionScanner'

export default function ManagerHub() {
  return (
    <div style={styles.outer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Trading Hub</h1>
          <p style={styles.subtitle}>Unified control for your strategy and monitoring.</p>
        </div>

        <div className="hub-grid" style={styles.grid}>
          <div style={styles.columnMain}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>📝</span>
              <h2 style={styles.sectionTitle}>Trade Journal</h2>
            </div>
            <div style={styles.cardWrapper}>
              <JournalManager />
            </div>

            <div style={{ marginTop: '40px' }} />
            
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>📢</span>
              <h2 style={styles.sectionTitle}>Corporate Actions</h2>
            </div>
            <div style={styles.cardWrapper}>
              <CorporateActionScanner />
            </div>
          </div>
          
          <div style={styles.columnSide}>
            <div style={styles.sticky}>
              <SecuritySettings />
              
              <div style={styles.sectionHeader}>
                <span style={styles.sectionIcon}>👀</span>
                <h2 style={styles.sectionTitle}>Watchlist</h2>
              </div>
              <div style={styles.cardWrapper}>
                <WatchlistManager />
              </div>
              
              <div style={{ height: '32px' }} />
              
              <div style={styles.sectionHeader}>
                <span style={styles.sectionIcon}>🔔</span>
                <h2 style={styles.sectionTitle}>Price Alerts</h2>
              </div>
              <div style={styles.cardWrapper}>
                <AlertsManager />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  outer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    background: 'var(--bg-main)',
    minHeight: '100vh',
  },
  container: {
    width: '100%',
    maxWidth: '1400px',
    padding: '48px 40px',
  },
  header: {
    marginBottom: '48px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '900',
    color: 'var(--text-main)',
    margin: 0,
    letterSpacing: '-0.05em',
  },
  subtitle: {
    fontSize: '15px',
    color: 'var(--text-muted)',
    marginTop: '8px',
    fontWeight: '500',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 400px',
    gap: '48px',
    alignItems: 'start',
  },
  columnMain: {
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  columnSide: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  sticky: {
    position: 'sticky',
    top: '100px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: '20px',
  },
  sectionIcon: {
    width: '40px',
    height: '40px',
    background: 'var(--bg-card)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--text-main)',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  cardWrapper: {
    width: '100%',
  }
}
