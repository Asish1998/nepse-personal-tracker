import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes bg-slide {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .floating { animation: float 6s ease-in-out infinite; }
        .fade-up { animation: fade-up 0.8s ease-out forwards; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); }
        .comparison-row { border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.3s; }
        .comparison-row:hover { background: rgba(255, 255, 255, 0.02); }
      `}</style>

      {/* Background Layers */}
      <div style={styles.movingBackground}></div>
      <div style={styles.overlayGlow}></div>
      
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>A</div>
          <span style={styles.logoText}>ASTRIX ALPHA</span>
        </div>
        <div style={styles.navLinks}>
          <button style={styles.loginBtn} onClick={() => navigate('/login')}>Sign In</button>
          <button style={styles.registerBtn} onClick={() => navigate('/register')}>Launch Terminal</button>
        </div>
      </nav>

      <main style={styles.main}>
        {/* HERO SECTION */}
        <section style={styles.heroSection}>
          <div style={styles.heroContent} className="fade-up">
            <div style={styles.badge}>PRECISION FINTECH PROTOCOL</div>
            <h1 style={styles.title}>The Astrix Edge for <br /> <span style={styles.gradientText}>NEPSE Portfolios</span></h1>
            <p style={styles.subtitle}>
              Unleash the power of the Astrix Alpha protocol. 
              The most advanced high-frequency NEPSE terminal with neural signals and unified wealth intelligence.
            </p>
            <div style={styles.ctaGroup}>
              <button style={styles.mainCta} onClick={() => navigate('/register')}>Join 100+ Active Traders</button>
              <button style={styles.secondaryCta} onClick={() => document.getElementById('why-choose-us').scrollIntoView({ behavior: 'smooth' })}>
                Why Astrix Alpha?
              </button>
            </div>
          </div>

          <div style={styles.visualContainer} className="floating">
            <div style={styles.glassCard} className="glass">
              <div style={styles.abstractVisual}>
                <div style={styles.visualNode}>AI_PULSE_ACTIVE</div>
                <div style={styles.pulseBar}></div>
              </div>
              <div style={styles.heroStat}>
                <div style={styles.statLabel}>MARKET ACCURACY</div>
                <div style={styles.statVal}>99.4%</div>
                <div style={styles.statSub}>Real-time Feed Sync</div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section id="why-choose-us" style={styles.features}>
          <div style={styles.sectionHeader} className="fade-up">
            <h2 style={styles.sectionTitle}>Why Choose Astrix Alpha?</h2>
            <p style={styles.sectionSub}>Engineered for those who treat NEPSE as a professional discipline, not a game of chance.</p>
            <div style={styles.sectionLine}></div>
          </div>

          <div style={styles.featureGrid}>
            <FeatureCard 
              icon="⚡" 
              title="Global-Grade NEPSE Terminals" 
              desc="High-frequency data integration with real-time WACC, auto-dividend auditing, and automated CGT liability calculation." 
              gradient="linear-gradient(135deg, #00f2ff 0%, #006aff 100%)"
            />
            <FeatureCard 
              icon="🧠" 
              title="Neural Decision Auditing" 
              desc="Powered by Gemini AI (LLM-Gen3) to evaluate your trade rationale, filter noise, and enforce emotional discipline." 
              gradient="linear-gradient(135deg, #7000ff 0%, #d400ff 100%)"
            />
            <FeatureCard 
              icon="🛡️" 
              title="Asset Intelligence Protocol" 
              desc="Localized wealth management tracking NPR (Rs.) across sectors with institutional risk profiling and asset rotation alerts." 
              gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
            />
            <FeatureCard 
              icon="☁️" 
              title="Zero-Loss Cloud Infrastructure" 
              desc="Military-grade data persistence via Supabase RLS. Your portfolio is mirrored across all devices with instant sync." 
              gradient="linear-gradient(135deg, #10b981 0%, #047857 100%)"
            />
          </div>
        </section>

        <section style={styles.finalCta}>
          <h2 style={styles.finalTitle}>Start Investing Intelligently.</h2>
          <button style={styles.mainCtaLarge} onClick={() => navigate('/register')}>Launch Your Free Terminal</button>
        </section>

        <footer style={styles.footer}>
          <div style={styles.footerBrand}>
            <div style={styles.logoIconSmall}>A</div>
            <span>Astrix Alpha v4.0 // Global Wealth Protocol</span>
          </div>
          <p style={styles.footerText}>© 2026 Developed by Ashish Khanal. Audited Financial Intelligence for the Nepalese Market.</p>
        </footer>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc, gradient }) {
  return (
    <div style={styles.fCard} className="glass fade-up">
      <div style={{ ...styles.fIcon, background: gradient }}>{icon}</div>
      <h3 style={styles.fTitle}>{title}</h3>
      <p style={styles.fDesc}>{desc}</p>
    </div>
  );
}


const styles = {
  container: {
    minHeight: '100vh',
    background: '#020617',
    color: '#94a3b8',
    fontFamily: "'Inter', system-ui, sans-serif",
    overflowX: 'hidden',
    position: 'relative'
  },
  movingBackground: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(-45deg, #020617, #0f172a, #1e1b4b, #020617)',
    backgroundSize: '400% 400%',
    animation: 'bg-slide 15s ease infinite',
    zIndex: 0
  },
  overlayGlow: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)',
    zIndex: 1,
    pointerEvents: 'none'
  },
  nav: {
    padding: '32px 64px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
    maxWidth: '1400px',
    margin: '0 auto'
  },
  logo: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoIcon: { background: 'linear-gradient(135deg, #00f2ff, #7000ff)', color: '#fff', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '20px' },
  logoText: { fontWeight: '900', fontSize: '22px', letterSpacing: '-0.04em', color: '#fff' },
  navLinks: { display: 'flex', gap: '24px', alignItems: 'center' },
  loginBtn: { background: 'none', border: 'none', color: '#94a3b8', fontWeight: '800', fontSize: '14px', cursor: 'pointer' },
  registerBtn: { background: '#fff', color: '#020617', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '900', fontSize: '13px', cursor: 'pointer' },
  
  main: { position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '0 24px' },
  
  heroSection: {
    padding: '120px 0 160px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '60px',
    flexWrap: 'wrap'
  },
  heroContent: { flex: 1, minWidth: '400px' },
  badge: { display: 'inline-block', background: 'rgba(0, 242, 255, 0.05)', color: '#00f2ff', padding: '6px 16px', borderRadius: '40px', fontSize: '11px', fontWeight: '900', letterSpacing: '0.12em', marginBottom: '32px', border: '1px solid rgba(0, 242, 255, 0.1)' },
  title: { fontSize: '76px', fontWeight: '900', lineHeight: '1.02', letterSpacing: '-0.05em', color: '#fff', marginBottom: '32px' },
  gradientText: { background: 'linear-gradient(to right, #00f2ff, #7000ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { fontSize: '22px', color: '#64748b', maxWidth: '600px', lineHeight: '1.6', marginBottom: '56px', fontWeight: '500' },
  ctaGroup: { display: 'flex', gap: '16px' },
  mainCta: { background: '#006aff', color: '#fff', border: 'none', padding: '20px 48px', borderRadius: '14px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', boxShadow: '0 20px 40px -10px rgba(0, 106, 255, 0.4)' },
  secondaryCta: { background: 'rgba(255,255,255,0.03)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '20px 48px', borderRadius: '14px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' },

  visualContainer: {
    flex: 1,
    minWidth: '400px',
    height: '450px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  glassCard: {
    width: '400px',
    height: '400px',
    borderRadius: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    boxShadow: '0 40px 100px -20px rgba(0,0,0,0.6)',
    position: 'relative'
  },
  abstractVisual: {
    width: '100%',
    height: '120px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '48px'
  },
  visualNode: { 
    fontSize: '10px', 
    fontFamily: 'monospace', 
    color: '#00f2ff', 
    background: 'rgba(0, 242, 255, 0.1)', 
    padding: '4px 12px', 
    borderRadius: '4px',
    letterSpacing: '2px'
  },
  pulseBar: { width: '80%', height: '2px', background: 'linear-gradient(90deg, transparent, #00f2ff, transparent)', animation: 'pulse 2s infinite' },
  heroStat: {
    width: '100%',
    textAlign: 'center'
  },
  statLabel: { fontSize: '11px', color: '#475569', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' },
  statVal: { fontSize: '56px', fontWeight: '950', color: '#fff', marginBottom: '8px', letterSpacing: '-0.04em' },
  statSub: { fontSize: '13px', color: '#00f2ff', fontWeight: '800' },

  features: { padding: '120px 0' },
  sectionHeader: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '100px', textAlign: 'center' },
  sectionTitle: { fontSize: '52px', fontWeight: '900', color: '#fff', letterSpacing: '-0.04em', marginBottom: '16px' },
  sectionSub: { fontSize: '20px', color: '#64748b', maxWidth: '600px' },
  sectionLine: { width: '40px', height: '4px', background: '#00f2ff', marginTop: '32px', borderRadius: '10px' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' },
  fCard: { padding: '56px 48px', borderRadius: '32px', transition: 'all 0.3s ease' },
  fIcon: { width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '32px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)' },
  fTitle: { fontSize: '24px', fontWeight: '900', color: '#fff', marginBottom: '16px' },
  fDesc: { fontSize: '16px', color: '#64748b', lineHeight: '1.7', fontWeight: '500' },
  

  finalCta: { padding: '120px 0', textAlign: 'center' },
  finalTitle: { fontSize: '56px', fontWeight: '900', color: '#fff', marginBottom: '48px', letterSpacing: '-0.04em' },
  mainCtaLarge: { background: '#fff', color: '#020617', border: 'none', padding: '24px 64px', borderRadius: '16px', fontWeight: '900', fontSize: '18px', cursor: 'pointer', boxShadow: '0 30px 60px -12px rgba(255, 255, 255, 0.2)' },

  footer: { padding: '120px 0 80px 0', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' },
  footerBrand: { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontWeight: '900', color: '#fff', fontSize: '18px', gap: '16px' },
  logoIconSmall: { background: 'rgba(255,255,255,0.1)', color: '#fff', width: '28px', height: '28px', borderRadius: '6px', fontWeight: '900', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  footerText: { fontSize: '14px', color: '#475569', fontWeight: '600' }
};
