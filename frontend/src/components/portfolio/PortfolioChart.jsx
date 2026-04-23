import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useApp } from '../../context/AppContext'
import { fmtNPR } from '../../utils/formatters'

const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444', '#10b981', '#3b82f6']

export default function PortfolioChart() {
  const { state } = useApp()

  const data = state.holdings.map(h => ({
    name: h.sym,
    value: h.qty * h.cur
  })).filter(d => d.value > 0)

  if (data.length === 0) return null

  return (
    <div className="card" style={{ height: 350, display: 'flex', flexDirection: 'column', marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.02em', textTransform: 'uppercase', marginBottom: 16 }}>
        Portfolio Allocation
      </h3>
      <div style={{ flex: 1, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`NPR ${fmtNPR(value)}`, 'Value']}
              contentStyle={{ background: 'rgba(255,255,255,0.9)', borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow)' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
