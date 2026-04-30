import AIChatbot from '../ai/AIChatbot'

export default function Layout({ children }) {
  return (
    <main className="dashboard-main-padding" style={{ padding: '24px 0', width: '100%', maxWidth: 1200, margin: '0 auto' }}>
      <div className="glass glass-main" style={{ padding: '32px', minHeight: 'calc(100vh - 160px)', margin: '0 24px' }}>
        {children}
      </div>
      <div style={{ marginTop: 64, padding: '40px 24px', backgroundColor: 'rgba(15, 23, 42, 0.02)', borderTop: '1px solid var(--border)', borderRadius: '0 0 var(--radius) var(--radius)', textAlign: 'center' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 8, letterSpacing: '0.02em' }}>
          "EMPOWERING GAINS, FOCUSED ON PRECISION."
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          INSPIRED BY THE VISION OF <span className="mono" style={{ color: 'var(--primary)', fontWeight: 800 }}>ASHISH KHANAL</span>
        </p>
        <div style={{ width: 40, height: 2, background: 'var(--border)', margin: '20px auto' }}></div>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>
          © 2026 NEPSE PORTFOLIO TRACKER | BUILT FOR EXCELLENCE
        </p>
      </div>
    </main>
  )
}