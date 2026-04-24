import { useState } from 'react'

export default function TechnicalChart() {
  const provider = { name: 'NepseAlpha Advanced', url: 'https://nepsealpha.com/trading/chart' }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '85vh', minHeight: 800 }}>
      {/* Chart Header / Toolbar */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)' }}>
        <div>
          <h2 style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--profit)', display: 'inline-block' }}></span>
            Real-Time Technical Analysis
          </h2>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Powered by TradingView Engine</p>
        </div>
        
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.1em', background: 'rgba(15, 23, 42, 0.05)', padding: '6px 12px', borderRadius: 4 }}>
          {provider.name}
        </div>
      </div>

      {/* Embedded Chart Engine */}
      <div style={{ flex: 1, position: 'relative', background: '#000' }}>
        <iframe
          src={provider.url}
          title="NEPSE Technical Chart"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          loading="lazy"
          allowFullScreen
        ></iframe>
      </div>
      
      {/* Disclosure Footer */}
      <div style={{ padding: '8px 16px', background: 'var(--bg-main)', borderTop: '1px solid var(--border)', fontSize: 10, color: 'var(--text-muted)', textAlign: 'center' }}>
        Live charting data is embedded directly from {provider.name}. Drawings and session data are stored in your local browser cache.
      </div>
    </div>
  )
}
