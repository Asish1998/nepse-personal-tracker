import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { fmtNPR } from '../utils/formatters'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const CATEGORIES = {
  INCOME: ['Salary', 'Business', 'Bonus', 'Rent Income', 'Share Dividend', 'Interest', 'Other Income'],
  EXPENSE: ['Khaja & Food', 'Rent', 'Yatayat (Transport)', 'Groceries', 'Education', 'Electricity & Water', 'Mobile & Internet', 'Entertainment', 'Health', 'Clothing', 'Travel', 'Other Expense']
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f43f5e', '#14b8a6']

export default function WealthManager() {
  const { user } = useAuth()
  const storageKey = `wealth_data_${user?.id}`
  
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : []
  })

  const [form, setForm] = useState({
    type: 'EXPENSE',
    category: CATEGORIES.EXPENSE[0],
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(transactions))
  }, [transactions, storageKey])

  const totals = useMemo(() => {
    return transactions.reduce((acc, t) => {
      const amt = parseFloat(t.amount) || 0
      if (t.type === 'INCOME') acc.income += amt
      else acc.expense += amt
      return acc
    }, { income: 0, expense: 0 })
  }, [transactions])

  const chartData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'EXPENSE')
    const grouped = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount)
      return acc
    }, {})
    return Object.entries(grouped).map(([name, value]) => ({ name, value }))
  }, [transactions])

  const addTransaction = (e) => {
    e.preventDefault()
    if (!form.amount || parseFloat(form.amount) <= 0) return alert('Enter a valid amount')
    const newTx = { ...form, id: Date.now() }
    setTransactions([newTx, ...transactions])
    setForm({ ...form, amount: '', note: '' })
  }

  const deleteTx = (id) => {
    if (confirm('Delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id))
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Wealth Manager & Expense Tracker</h1>
        <p style={styles.subtitle}>Localized financial management for your everyday life in Nepal.</p>
      </div>

      <div style={styles.statsGrid}>
        <div className="card" style={styles.statCard}>
          <div style={styles.label}>Net Balance</div>
          <div style={{ ...styles.value, color: (totals.income - totals.expense) >= 0 ? 'var(--profit)' : 'var(--loss)' }}>
            {fmtNPR(totals.income - totals.expense)}
          </div>
        </div>
        <div className="card" style={styles.statCard}>
          <div style={styles.label}>Total Monthly Income</div>
          <div style={{ ...styles.value, color: 'var(--profit)' }}>{fmtNPR(totals.income)}</div>
        </div>
        <div className="card" style={styles.statCard}>
          <div style={styles.label}>Total Monthly Expense</div>
          <div style={{ ...styles.value, color: 'var(--loss)' }}>{fmtNPR(totals.expense)}</div>
        </div>
      </div>

      <div style={styles.mainGrid}>
        <div className="card" style={styles.formCard}>
          <h2 style={styles.sectionTitle}>Add Transaction</h2>
          <form onSubmit={addTransaction} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.inputLabel}>Transaction Type</label>
                <select 
                  style={styles.select} 
                  value={form.type} 
                  onChange={e => setForm({ ...form, type: e.target.value, category: CATEGORIES[e.target.value][0] })}
                >
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.inputLabel}>Category</label>
                <select 
                  style={styles.select} 
                  value={form.category} 
                  onChange={e => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES[form.type].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.inputLabel}>Amount (NPR)</label>
              <input 
                type="number" 
                placeholder="Enter Amount" 
                style={styles.input} 
                value={form.amount} 
                onChange={e => setForm({ ...form, amount: e.target.value })} 
              />
            </div>

            <div style={styles.field}>
              <label style={styles.inputLabel}>Date</label>
              <input 
                type="date" 
                style={styles.input} 
                value={form.date} 
                onChange={e => setForm({ ...form, date: e.target.value })} 
              />
            </div>

            <div style={styles.field}>
              <label style={styles.inputLabel}>Note (Optional)</label>
              <input 
                type="text" 
                placeholder="E.g. Lunch at Office" 
                style={styles.input} 
                value={form.note} 
                onChange={e => setForm({ ...form, note: e.target.value })} 
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', marginTop: '12px' }}>
              Save Transaction
            </button>
          </form>
        </div>

        <div className="card" style={styles.chartCard}>
          <h2 style={styles.sectionTitle}>Expense Breakdown</h2>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                  formatter={(val) => fmtNPR(val)}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px', padding: '24px' }}>
        <h2 style={styles.sectionTitle}>Recent Transactions</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Note</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td style={{ fontSize: '13px' }}>{t.date}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        background: t.type === 'INCOME' ? 'var(--profit)' : 'var(--loss)' 
                      }}></span>
                      <span style={{ fontWeight: 700 }}>{t.category}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t.note || '-'}</td>
                  <td style={{ 
                    fontFamily: 'var(--mono)', 
                    fontWeight: 800, 
                    color: t.type === 'INCOME' ? 'var(--profit)' : 'var(--loss)' 
                  }}>
                    {t.type === 'INCOME' ? '+' : '-'}{fmtNPR(t.amount)}
                  </td>
                  <td>
                    <button 
                      onClick={() => deleteTx(t.id)} 
                      style={{ background: 'none', border: 'none', color: 'var(--loss)', cursor: 'pointer', fontSize: '18px' }}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No transactions found. Add your first income or expense above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '20px 0', paddingBottom: '100px' },
  header: { marginBottom: '32px' },
  title: { fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '8px' },
  subtitle: { fontSize: '15px', color: 'var(--text-muted)', fontWeight: '500' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' },
  statCard: { padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  label: { fontSize: '12px', textTransform: 'uppercase', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px' },
  value: { fontSize: '28px', fontWeight: '800', fontFamily: 'var(--mono)' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flexWrap: 'wrap' },
  sectionTitle: { fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '20px' },
  formCard: { padding: '24px' },
  chartCard: { padding: '24px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  inputLabel: { fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '14px' },
  select: { padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '14px', cursor: 'pointer' }
}
