import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import '../styles/global.css'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    if (!supabase) {
      setLoading(false)
      return
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setUsers(data)
      setStats({
        total: data.length,
        pending: data.filter(u => u.status === 'pending').length,
        approved: data.filter(u => u.status === 'approved').length
      })
    }
    setLoading(false)
  }

  const handleStatusUpdate = async (userId, newStatus) => {
    if (!supabase) return
    const { error } = await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', userId)

    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u))
      // Update stats
      const nextUsers = users.map(u => u.id === userId ? { ...u, status: newStatus } : u)
      setStats({
        total: nextUsers.length,
        pending: nextUsers.filter(u => u.status === 'pending').length,
        approved: nextUsers.filter(u => u.status === 'approved').length
      })
    } else {
      alert('Failed to update status: ' + error.message)
    }
  }

  if (user?.role !== 'admin') {
    return (
      <div style={styles.errorPage}>
        <h1 style={{ fontSize: '48px' }}>🚫</h1>
        <h2>Access Denied</h2>
        <p>This terminal is reserved for Service Providers only.</p>
        <button onClick={() => window.location.href = '/'} style={styles.backBtn}>Return to Terminal</button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <Navbar active="admin" onChange={() => {}} />
      
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Service Provider Central</h1>
            <p style={styles.subtitle}>Onboarding & Authentication Management System</p>
          </div>
          <div style={styles.statsRow}>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>Total Users</span>
              <span style={styles.statVal}>{stats.total}</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>Pending Approval</span>
              <span style={{ ...styles.statVal, color: 'var(--accent)' }}>{stats.pending}</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>Live Terminals</span>
              <span style={{ ...styles.statVal, color: 'var(--success)' }}>{stats.approved}</span>
            </div>
          </div>
        </header>

        <div className="card" style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h3 style={styles.tableTitle}>User Directory</h3>
            <button onClick={fetchUsers} style={styles.refreshBtn}>Refresh Data</button>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th style={styles.th}>User Details</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Date Joined</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.userName}>{u.name || 'Anonymous'}</div>
                      <div style={styles.userEmail}>{u.email}</div>
                    </td>
                    <td style={styles.td}>
                       <span style={{ ...styles.roleBadge, background: u.role === 'admin' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.05)', color: u.role === 'admin' ? '#8b5cf6' : 'var(--text-muted)' }}>
                         {u.role?.toUpperCase() || 'USER'}
                       </span>
                    </td>
                    <td style={styles.td}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, ...(u.status === 'approved' ? styles.statusApproved : (u.status === 'pending' ? styles.statusPending : styles.statusRejected)) }}>
                        {u.status?.toUpperCase() || 'PENDING'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        {u.status !== 'approved' && (
                          <button 
                            onClick={() => handleStatusUpdate(u.id, 'approved')} 
                            style={styles.approveBtn}
                          >
                            Approve
                          </button>
                        )}
                        {u.status === 'pending' && (
                          <button 
                            onClick={() => handleStatusUpdate(u.id, 'rejected')} 
                            style={styles.rejectBtn}
                          >
                            Reject
                          </button>
                        )}
                        {u.status === 'approved' && u.role !== 'admin' && (
                          <button 
                            onClick={() => handleStatusUpdate(u.id, 'pending')} 
                            style={styles.revokeBtn}
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && <div style={styles.loader}>Syncing with Supabase...</div>}
          </div>
        </div>
      </main>
    </div>
  )
}

const styles = {
  container: { background: 'var(--bg-main)', minHeight: '100vh' },
  main: { padding: '40px 32px', maxWidth: '1400px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' },
  title: { fontSize: '28px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '8px' },
  subtitle: { fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' },
  statsRow: { display: 'flex', gap: '16px' },
  statCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '16px 24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', minWidth: '160px' },
  statLabel: { fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' },
  statVal: { fontSize: '24px', fontWeight: '900', color: 'var(--text-main)' },
  tableCard: { padding: '0', overflow: 'hidden' },
  tableHeader: { padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tableTitle: { fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0 },
  refreshBtn: { background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thRow: { background: 'rgba(0,0,0,0.1)' },
  th: { padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr: { borderBottom: '1px solid var(--border)', transition: 'background 0.2s' },
  td: { padding: '16px 24px', fontSize: '14px' },
  userName: { fontWeight: '800', color: 'var(--text-main)' },
  userEmail: { fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' },
  roleBadge: { fontSize: '10px', fontWeight: '800', padding: '4px 8px', borderRadius: '4px' },
  statusBadge: { fontSize: '10px', fontWeight: '900', padding: '4px 8px', borderRadius: '4px' },
  statusPending: { background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' },
  statusApproved: { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  statusRejected: { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
  actions: { display: 'flex', gap: '8px' },
  approveBtn: { background: 'var(--success)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
  rejectBtn: { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
  revokeBtn: { background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
  loader: { padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' },
  errorPage: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '16px' },
  backBtn: { padding: '12px 24px', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer' }
}
