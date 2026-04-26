import SecuritySettings from '../auth/SecuritySettings'
import JournalManager from '../journal/JournalManager'
import AlertsManager from '../alerts/AlertsManager'
import WatchlistManager from '../watchlist/WatchlistManager'

export default function ManagerHub() {
  return (
    <div style={styles.outer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Trading Hub</h1>
          <p style={styles.subtitle}>Unified control for your strategy and monitoring.</p>
        </div>

        <div style={styles.grid}>
          <div style={styles.columnMain}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>📝</span>
              <h2 style={styles.sectionTitle}>Trade Journal</h2>
            </div>
            <div style={styles.cardWrapper}>
              <JournalManager />
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
    padding: '0 24px'
  },
  container: {
    width: '100%',
    maxWidth: '1440px',
    padding: '32px 0'
  },
  header: {
    marginBottom: '40px'
  },
  title: {
    fontSize: '34px',
    fontWeight: '850',
    color: 'var(--text-main)',
    margin: 0,
    letterSpacing: '-0.03em'
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-muted)',
    marginTop: '10px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 420px',
    gap: '40px',
    alignItems: 'start'
  },
  columnMain: {
    minWidth: 0, // critical for grid flex items
    display: 'flex',
    flexDirection: 'column'
  },
  columnSide: {
    display: 'flex',
    flexDirection: 'column'
  },
  sticky: {
    position: 'sticky',
    top: '120px'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    paddingLeft: '4px'
  },
  sectionIcon: {
    fontSize: '22px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-main)',
    margin: 0
  },
  cardWrapper: {
    width: '100%',
    overflow: 'hidden'
  }
}
