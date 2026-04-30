import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (user) navigate('/');
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user, navigate]);

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');
        
        :root {
          --primary: #00f2ff;
          --accent: #7000ff;
          --bg: #020617;
          --glass: rgba(255, 255, 255, 0.03);
          --border: rgba(255, 255, 255, 0.08);
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }

        @keyframes slide-infinite {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .glass-panel {
          background: var(--glass);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .glass-panel:hover {
          border-color: rgba(0, 242, 255, 0.3);
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -10px rgba(0, 242, 255, 0.1);
        }

        .neon-text {
          text-shadow: 0 0 20px rgba(0, 242, 255, 0.5);
        }

        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s linear infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .ticker-scroll {
          display: flex;
          white-space: nowrap;
          animation: slide-infinite 40s linear infinite;
        }
      `}</style>

      {/* Grid Background */}
      <div style={styles.gridOverlay}></div>
      <div style={styles.glowSpot}></div>

      {/* Header */}
      <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
        <div style={styles.logo}>
          <div style={styles.logoMark}>
            <span style={{ color: 'white' }}>α</span>
          </div>
          <span style={styles.logoLabel}>ALPHA TERMINAL</span>
        </div>
        <div style={styles.navLinks}>
          <span style={styles.navItem}>Markets</span>
          <span style={styles.navItem}>Intelligence</span>
          <span style={styles.navItem}>Pricing</span>
          <button style={styles.btnSignIn} onClick={() => navigate('/login')}>TERMINAL ACCESS</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            <span style={styles.pulseDot}></span>
            GEN-3 AI INTELLIGENCE SYSTEM
          </div>
          <h1 style={styles.heroTitle}>
            AI Intelligence for <br />
            <span style={styles.gradientText}>Nepal Stock Market</span>
          </h1>
          <p style={styles.heroSub}>
            Track smart money, predict momentum, detect opportunities, and make better NEPSE decisions using institutional-grade AI built for retail traders.
          </p>
          <div style={styles.heroActions}>
            <button style={styles.btnPrimary} onClick={() => navigate('/register')}>START TRADING FREE</button>
            <button style={styles.btnSecondary}>BOOK INSTITUTIONAL DEMO</button>
          </div>
          <div style={styles.heroPartners}>
            <span style={styles.partnerLabel}>DATA POWERED BY</span>
            <div style={styles.partnerIcons}>NEPSE • MEROLAGANI • NEPSEALPHA • CDSC</div>
          </div>
        </div>

        <div style={styles.heroVisual}>
          <div className="glass-panel" style={styles.terminalMock}>
            <div style={styles.terminalHeader}>
              <div style={styles.dots}><span style={{background: '#ff5f56'}}></span><span style={{background: '#ffbd2e'}}></span><span style={{background: '#27c93f'}}></span></div>
              <div style={styles.terminalTitle}>ALPHA_INTELLIGENCE_V4.exe</div>
            </div>
            <div style={styles.terminalBody}>
               <div style={styles.mockChart}>
                  <div style={{...styles.mockBar, height: '40%'}}></div>
                  <div style={{...styles.mockBar, height: '60%'}}></div>
                  <div style={{...styles.mockBar, height: '90%', background: 'var(--primary)'}}></div>
                  <div style={{...styles.mockBar, height: '75%'}}></div>
                  <div style={{...styles.mockBar, height: '50%'}}></div>
               </div>
               <div style={styles.mockSignal}>
                  <div style={styles.signalHeader}>PREDICTION_ENGINE</div>
                  <div style={styles.signalVal}>NICA: <span style={{color: 'var(--primary)'}}>STRONG BUY @ 894</span></div>
                  <div style={styles.signalConfidence}>94.2% AI CONFIDENCE</div>
               </div>
            </div>
          </div>
          {/* Floating cards */}
          <div className="glass-panel floating" style={{ ...styles.overlapCard, top: '10%', right: '-10%' }}>
             <div style={styles.cardStatLabel}>WHALE ALERT</div>
             <div style={styles.cardStatVal}>1.2M Units Accumulation</div>
             <div style={styles.cardStatSub}>Commercial Banks Sector</div>
          </div>
          <div className="glass-panel floating" style={{ ...styles.overlapCard, bottom: '20%', left: '-15%', animationDelay: '1s' }}>
             <div style={styles.cardStatLabel}>MOMENTUM SCORE</div>
             <div style={styles.cardStatVal}>98.4 / 100</div>
             <div style={{...styles.cardStatSub, color: 'var(--primary)'}}>BREAKOUT IMMINENT</div>
          </div>
        </div>
      </section>

      {/* Live Ticker Snapshot */}
      <div style={styles.tickerContainer}>
        <div className="ticker-scroll">
          {[1,2,3].map(i => (
            <div key={i} style={styles.tickerGroup}>
              <TickerItem sym="NEPSE" val="2,744.45" chg="-25.81" pct="-0.93" />
              <TickerItem sym="NICA" val="890.00" chg="+12.00" pct="+1.37" />
              <TickerItem sym="HDL" val="2,150.00" chg="-45.00" pct="-2.05" />
              <TickerItem sym="UPPER" val="410.00" chg="+2.00" pct="+0.49" />
              <TickerItem sym="NTC" val="920.00" chg="0.00" pct="0.00" />
              <TickerItem sym="BULL_SENTIMENT" val="64%" chg="OPTIMISTIC" pct="" isSentiment />
              <TickerItem sym="TURNOVER" val="4.2B" chg="HIGH" pct="" />
            </div>
          ))}
        </div>
      </div>

      {/* Core Features */}
      <section style={styles.features}>
        <div style={styles.sectionHeader}>
          <div style={styles.accentLine}></div>
          <h2 style={styles.sectionTitle}>Precision Edge Technology</h2>
          <p style={styles.sectionSub}>Institutional features redefined for the individual NEPSE investor.</p>
        </div>

        <div style={styles.featureGrid}>
          <FeatureCard 
            title="AI Buy/Sell Signals" 
            icon="⚡" 
            desc="Predict momentum shifts before they happen with our neural network trained on 10 years of NEPSE data." 
          />
          <FeatureCard 
            title="Smart Money Tracker" 
            icon="🐋" 
            desc="Detect large accumulation zones and institutional distribution patterns in real-time." 
          />
          <FeatureCard 
            title="Portfolio Intelligence" 
            icon="📊" 
            desc="Advanced WACC tracking, auto-dividend calculation, and real-time CGT liability reporting." 
          />
          <FeatureCard 
            title="Swing Trade Scanner" 
            icon="🎯" 
            desc="Scanning 250+ scrips per second to find high-probability breakout and reversal patterns." 
          />
          <FeatureCard 
            title="AI News Impact Engine" 
            icon="📰" 
            desc="Sentiment analysis on thousands of financial headlines to gauge market impact before the bell." 
          />
          <FeatureCard 
            title="NEPSE Heatmap" 
            icon="🧱" 
            desc="Visualizing the entire market health in one glance. See where the money is flowing instantly." 
          />
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section style={styles.preview}>
        <div className="glass-panel" style={styles.previewContainer}>
           <div style={styles.previewSidebar}>
              <div style={styles.sideItem}>Portfolio</div>
              <div style={styles.sideItemActive}>Alpha Intelligence</div>
              <div style={styles.sideItem}>Strategy Journal</div>
           </div>
           <div style={styles.previewContent}>
              <div style={styles.previewHeader}>
                 <div>
                    <div style={styles.prevSub}>Terminal Overview</div>
                    <div style={styles.prevTitle}>NEPSE ALPHA OS</div>
                 </div>
                 <div style={styles.prevStats}>
                    <div className="shimmer" style={styles.prevStatBox}>Opportunity Index: 88</div>
                    <div style={styles.prevStatBox}>Risk Level: Low</div>
                 </div>
              </div>
              <div style={styles.prevGrid}>
                 <div style={styles.prevCard}>Sector Flow: Banking</div>
                 <div style={styles.prevCard}>Top Breakout: SHL</div>
                 <div style={styles.prevCard}>Momentum: NICA</div>
                 <div style={styles.prevCard}>AI Suggestion: HOLD</div>
              </div>
              <div style={styles.prevChartMock}>
                 {/* Visual Chart Mockup */}
                 <svg width="100%" height="100" style={{ opacity: 0.5 }}>
                   <path d="M0,80 Q100,20 200,60 T400,20 T600,80" fill="none" stroke="var(--primary)" strokeWidth="3" />
                 </svg>
              </div>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={styles.cta}>
        <div style={styles.ctaBlur}></div>
        <h2 style={styles.ctaTitle}>Stop Guessing. Start <br />Investing Intelligently.</h2>
        <p style={styles.ctaSub}>Join 12,000+ traders using the Alpha Intelligence Protocol to dominate the Nepal Stock Exchange.</p>
        <div style={styles.ctaActions}>
          <button style={styles.btnPrimaryLarge} onClick={() => navigate('/register')}>CREATE FREE TERMINAL ACCOUNT</button>
          <button style={styles.btnOutline}>TALK TO AN ADVISOR</button>
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerCol}>
            <div style={styles.logo}>ALPHA TERMINAL</div>
            <p style={styles.footerDesc}>The future of NEPSE investing, powered by high-precision AI models and institutional workflows.</p>
          </div>
          <div style={styles.footerCol}>
             <div style={styles.footerHead}>Product</div>
             <span style={styles.footerLink}>Intelligence</span>
             <span style={styles.footerLink}>Visual Trading</span>
             <span style={styles.footerLink}>Whale Tracker</span>
          </div>
          <div style={styles.footerCol}>
             <div style={styles.footerHead}>Support</div>
             <span style={styles.footerLink}>API Specs</span>
             <span style={styles.footerLink}>Contact Hub</span>
             <span style={styles.footerLink}>Legal</span>
          </div>
        </div>
        <div style={styles.footerBottom}>
          © 2026 Developed by Ashish Khanal. Precision engineered in the capital.
        </div>
      </footer>
    </div>
  );
}

function TickerItem({ sym, val, chg, pct, isSentiment }) {
  const isUp = chg.startsWith('+') || isSentiment;
  return (
    <div style={styles.tickerItem}>
      <span style={styles.tickerSym}>{sym}</span>
      <span style={styles.tickerVal}>{val}</span>
      <span style={{ ...styles.tickerChg, color: isUp ? '#00f2ff' : '#ff4d4d' }}>
        {chg} {pct && `(${pct})`}
      </span>
    </div>
  );
}

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="glass-panel" style={styles.fCard}>
      <div style={styles.fIcon}>{icon}</div>
      <h3 style={styles.fTitle}>{title}</h3>
      <p style={styles.fDesc}>{desc}</p>
    </div>
  );
}

const styles = {
  container: {
    background: '#020617',
    color: '#94a3b8',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    minHeight: '100vh',
    overflowX: 'hidden'
  },
  gridOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)`,
    backgroundSize: '40px 40px',
    zIndex: 0,
    pointerEvents: 'none'
  },
  glowSpot: {
    position: 'fixed',
    top: '10%', left: '10%',
    width: '600px', height: '600px',
    background: 'radial-gradient(circle, rgba(112,0,255,0.07) 0%, transparent 70%)',
    zIndex: 0,
    pointerEvents: 'none',
    animation: 'pulse-glow 10s ease-in-out infinite'
  },
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0,
    padding: '24px 64px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    zIndex: 1000,
    transition: 'all 0.4s'
  },
  navScrolled: {
    padding: '16px 64px',
    background: 'rgba(2, 6, 23, 0.8)',
    backdropFilter: 'blur(15px)',
    borderBottom: '1px solid rgba(255,255,255,0.05)'
  },
  logo: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoMark: { width: '32px', height: '32px', background: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '20px' },
  logoLabel: { fontWeight: '800', wordSpacing: '2px', color: '#fff', fontSize: '18px', letterSpacing: '-0.02em' },
  navLinks: { display: 'flex', gap: '32px', alignItems: 'center' },
  navItem: { fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s', '&:hover': { color: '#fff' } },
  btnSignIn: { background: 'var(--glass)', border: '1px solid var(--border)', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', letterSpacing: '0.05em' },

  hero: {
    padding: '200px 64px 140px 64px',
    maxWidth: '1400px', margin: '0 auto',
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px',
    position: 'relative', zIndex: 10
  },
  heroContent: { display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  heroBadge: { 
    display: 'flex', alignItems: 'center', gap: '10px',
    background: 'rgba(0, 242, 255, 0.05)', color: 'var(--primary)',
    padding: '8px 16px', borderRadius: '100px', fontSize: '11px', fontWeight: '800',
    width: 'fit-content', border: '1px solid rgba(0, 242, 255, 0.2)', marginBottom: '32px'
  },
  pulseDot: { width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--primary)' },
  heroTitle: { fontSize: '72px', fontWeight: '800', lineHeight: '1.1', color: '#fff', letterSpacing: '-0.04em', marginBottom: '32px' },
  gradientText: { background: 'linear-gradient(to right, #00f2ff, #7000ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroSub: { fontSize: '20px', lineHeight: '1.6', marginBottom: '56px', maxWidth: '550px' },
  heroActions: { display: 'flex', gap: '20px', marginBottom: '64px' },
  btnPrimary: { background: 'var(--primary)', color: '#000', border: 'none', padding: '18px 36px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0, 242, 255, 0.3)' },
  btnSecondary: { background: 'var(--glass)', border: '1px solid var(--border)', color: '#fff', padding: '18px 36px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: 'pointer' },
  heroPartners: { display: 'flex', flexDirection: 'column', gap: '12px' },
  partnerLabel: { fontSize: '10px', color: 'var(--text-dim)', fontWeight: '800', letterSpacing: '0.1em' },
  partnerIcons: { fontSize: '14px', fontWeight: '700', color: '#475569', letterSpacing: '0.05em' },

  heroVisual: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  terminalMock: { width: '400px', height: '320px', borderRadius: '24px', overflow: 'hidden', padding: '0' },
  terminalHeader: { background: '#1e293b', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  dots: { position: 'absolute', left: '20px', display: 'flex', gap: '6px' },
  terminalTitle: { fontSize: '10px', fontFamily: 'JetBrains Mono', color: '#94a3b8', fontWeight: '600' },
  terminalBody: { padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' },
  mockChart: { display: 'flex', alignItems: 'flex-end', gap: '12px', height: '100px' },
  mockBar: { flex: 1, background: '#334155', borderRadius: '4px' },
  mockSignal: { background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' },
  signalHeader: { fontSize: '9px', fontWeight: '800', color: 'var(--accent)' },
  signalVal: { fontSize: '20px', fontWeight: '800', color: '#fff', margin: '4px 0' },
  signalConfidence: { fontSize: '10px', fontWeight: '700', color: '#94a3b8' },
  overlapCard: { position: 'absolute', padding: '20px', borderRadius: '16px', minWidth: '180px' },
  cardStatLabel: { fontSize: '9px', fontWeight: '800', color: 'var(--accent)', textTransform: 'uppercase' },
  cardStatVal: { fontSize: '16px', fontWeight: '800', color: '#fff', margin: '4px 0' },
  cardStatSub: { fontSize: '10px', fontWeight: '600' },

  tickerContainer: { 
    background: 'rgba(255,255,255,0.02)', 
    borderTop: '1px solid var(--border)', 
    borderBottom: '1px solid var(--border)',
    overflow: 'hidden',
    padding: '16px 0'
  },
  tickerGroup: { display: 'flex' },
  tickerItem: { display: 'flex', alignItems: 'center', gap: '10px', margin: '0 32px' },
  tickerSym: { fontSize: '12px', fontWeight: '800', color: '#fff' },
  tickerVal: { fontSize: '12px', fontWeight: '600', color: '#94a3b8', fontFamily: 'JetBrains Mono' },
  tickerChg: { fontSize: '11px', fontWeight: '700', fontFamily: 'JetBrains Mono' },

  features: { padding: '120px 64px', maxWidth: '1400px', margin: '0 auto' },
  sectionHeader: { marginBottom: '80px' },
  accentLine: { width: '40px', height: '4px', background: 'var(--primary)', marginBottom: '24px' },
  sectionTitle: { fontSize: '48px', fontWeight: '800', color: '#fff', marginBottom: '16px', letterSpacing: '-0.03em' },
  sectionSub: { fontSize: '18px' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' },
  fCard: { padding: '40px' },
  fIcon: { fontSize: '32px', marginBottom: '24px' },
  fTitle: { fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '16px' },
  fDesc: { fontSize: '15px', lineHeight: '1.7' },

  preview: { padding: '60px 64px' },
  previewContainer: { 
    maxWidth: '1200px', margin: '0 auto', height: '600px',
    display: 'grid', gridTemplateColumns: '240px 1fr', overflow: 'hidden'
  },
  previewSidebar: { padding: '32px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' },
  sideItem: { padding: '12px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' },
  sideItemActive: { padding: '12px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--primary)', fontSize: '13px', fontWeight: '700' },
  previewContent: { padding: '48px' },
  previewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' },
  prevSub: { fontSize: '11px', fontWeight: '800', color: 'var(--accent)', textTransform: 'uppercase' },
  prevTitle: { fontSize: '28px', fontWeight: '800', color: '#fff' },
  prevStats: { display: 'flex', gap: '16px' },
  prevStatBox: { padding: '12px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px', color: '#fff', fontWeight: '700' },
  prevGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '48px' },
  prevCard: { padding: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '16px', fontSize: '13px', fontWeight: '700', color: '#fff', textAlign: 'center' },
  prevChartMock: { flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '24px', border: '1px solid var(--border)', minHeight: '180px' },

  cta: { 
    padding: '160px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden'
  },
  ctaBlur: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '800px', height: '400px', background: 'rgba(112,0,255,0.1)', filter: 'blur(100px)', zIndex: 0 },
  ctaTitle: { fontSize: '64px', fontWeight: '800', color: '#fff', marginBottom: '32px', position: 'relative', zIndex: 1, letterSpacing: '-0.04em' },
  ctaSub: { fontSize: '20px', maxWidth: '600px', margin: '0 auto 56px auto', position: 'relative', zIndex: 1 },
  ctaActions: { display: 'flex', justifyContent: 'center', gap: '20px', position: 'relative', zIndex: 1 },
  btnPrimaryLarge: { background: 'var(--primary)', color: '#000', border: 'none', padding: '20px 48px', borderRadius: '14px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 20px 40px rgba(0, 242, 255, 0.3)' },
  btnOutline: { background: 'transparent', border: '1px solid var(--border)', color: '#94a3b8', padding: '20px 48px', borderRadius: '14px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' },

  footer: { padding: '120px 64px 60px 64px', borderTop: '1px solid var(--border)' },
  footerInner: { maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '80px' },
  footerCol: { display: 'flex', flexDirection: 'column', gap: '24px' },
  footerDesc: { maxWidth: '300px', lineHeight: '1.7' },
  footerHead: { fontSize: '13px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' },
  footerLink: { fontSize: '14px', cursor: 'pointer', '&:hover': { color: '#fff' } },
  footerBottom: { maxWidth: '1400px', margin: '60px auto 0 auto', borderTop: '1px solid var(--border)', paddingTop: '40px', fontSize: '12px', textAlign: 'center' }
};
