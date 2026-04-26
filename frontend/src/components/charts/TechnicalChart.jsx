import { useState } from 'react'
import SectorMomentum from './SectorMomentum'

export default function TechnicalChart() {
  const provider = { name: 'NepseAlpha Advanced', url: 'https://nepsealpha.com/trading/chart' }

  return (
    <div style={styles.technicalPage}>
       {/* Top Utility Bar */}
       <div style={styles.utilityBar}>
          <div style={styles.utilityLeft}>
            <h1 style={styles.pageTitle}>Technical Intelligence Center</h1>
            <div style={styles.breadcrumb}>MARKET PULSE / NEPSE TECHNICAL ANALYSIS</div>
          </div>
          <div style={styles.utilityRight}>
             <div style={styles.providerBadge}>ENGINE: {provider.name}</div>
          </div>
       </div>

       <div style={styles.mainLayout}>
          {/* Left Sidebar: Sector Flows */}
          <div style={styles.sidebar}>
             <div className="card" style={{ height: '100%', padding: 0 }}>
               <SectorMomentum />
             </div>
          </div>

          {/* Main Chart Area */}
          <div style={styles.chartArea}>
             <div className="card" style={styles.chartCard}>
                <div style={styles.chartHeader}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="pulse-dot"></div>
                      <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.05em' }}>LIVE NEPSE INTERACTIVE CHART</span>
                   </div>
                   <div style={styles.chartTools}>
                      <button style={styles.toolBtn}>⚡ FULLSCREEN</button>
                      <button style={styles.toolBtn}>📸 CAPTURE</button>
                   </div>
                </div>
                
                <div style={styles.iframeWrapper}>
                   <iframe
                      src={provider.url}
                      title="NEPSE Technical Chart"
                      style={styles.iframe}
                      loading="lazy"
                      allowFullScreen
                   ></iframe>
                </div>

                <div style={styles.chartFooter}>
                   Real-time data stream authenticated. Analysis tools and custom indicators active.
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}

const styles = {
  technicalPage: {
    height: 'calc(100vh - 120px)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  utilityBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 4px'
  },
  utilityLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--text-main)',
    margin: 0,
    letterSpacing: '-0.02em'
  },
  breadcrumb: {
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    letterSpacing: '0.1em'
  },
  providerBadge: {
    padding: '8px 16px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--primary)',
    letterSpacing: '0.05em'
  },
  mainLayout: {
    flex: 1,
    display: 'flex',
    gap: '20px',
    minHeight: 0 // Crucial for nested flexbox scrolling
  },
  sidebar: {
    flex: '0 0 350px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  chartArea: {
    flex: 1,
    height: '100%'
  },
  chartCard: {
    height: '100%',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  chartHeader: {
    padding: '16px 24px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(0,0,0,0.02)'
  },
  chartTools: {
    display: 'flex',
    gap: '12px'
  },
  toolBtn: {
    background: 'none',
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
    fontSize: '10px',
    fontWeight: '800',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  iframeWrapper: {
    flex: 1,
    position: 'relative',
    background: '#0a0a0a' // Dark background for the chart
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },
  chartFooter: {
    padding: '10px 24px',
    fontSize: '10px',
    color: 'var(--text-muted)',
    borderTop: '1px solid var(--border)',
    background: 'rgba(0,0,0,0.01)',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: '0.02em'
  }
}
