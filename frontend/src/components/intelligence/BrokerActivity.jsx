import { fmtNPR } from '../../utils/formatters'

const BROKER_DATA = [
  { id: 58, name: 'Naasa Securities', buy: '142.5M', sell: '89.2M', net: 53.3 },
  { id: 45, name: 'Imperial Securities', buy: '98.1M', sell: '120.4M', net: -22.3 },
  { id: 34, name: 'Vision Securities', buy: '76.4M', sell: '45.1M', net: 31.3 },
  { id: 49, name: 'Online Securities', buy: '65.2M', sell: '72.8M', net: -7.6 },
  { id: 28, name: 'Shree Krishna', buy: '54.1M', sell: '32.1M', net: 22.0 }
]

export default function BrokerActivity() {
  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>BROKER-WISE ACTIVITY (TOP 5)</span>
        <span style={styles.live}>TRADE VOLUME</span>
      </div>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Broker</th>
              <th style={styles.thRight}>Buy</th>
              <th style={styles.thRight}>Sell</th>
              <th style={styles.thRight}>Net Flow</th>
            </tr>
          </thead>
          <tbody>
            {BROKER_DATA.map(b => (
              <tr key={b.id} style={styles.tr}>
                <td style={styles.tdName}>
                  <span style={styles.id}>#{b.id}</span> {b.name}
                </td>
                <td style={styles.tdPrice}>{b.buy}</td>
                <td style={styles.tdPrice}>{b.sell}</td>
                <td style={{ ...styles.tdPrice, color: b.net >= 0 ? 'var(--profit)' : 'var(--loss)' }}>
                  {b.net >= 0 ? '+' : ''}{b.net}M
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const styles = {
  card: { padding: '24px', background: 'var(--bg-card)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.08em' },
  live: { fontSize: '9px', fontWeight: '900', color: 'var(--accent)' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontSize: '10px', fontWeight: '800', color: 'var(--text-dim)', paddingBottom: '12px' },
  thRight: { textAlign: 'right', fontSize: '10px', fontWeight: '800', color: 'var(--text-dim)', paddingBottom: '12px' },
  tr: { borderBottom: '1px solid var(--border)' },
  tdName: { padding: '12px 0', fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' },
  id: { color: 'var(--accent)', marginRight: '6px', fontSize: '11px' },
  tdPrice: { padding: '12px 0', fontSize: '13px', fontWeight: '700', textAlign: 'right', fontFamily: 'var(--mono)' }
}
