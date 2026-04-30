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
        @keyframes chart-up {
          0% { height: 0%; opacity: 0; }
          100% { height: var(--h); opacity: 1; }
        }
        .floating { animation: float 6s ease-in-out infinite; }
        .fade-up { animation: fade-up 0.8s ease-out forwards; }
        .bar { animation: chart-up 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* Advanced Animated Mesh Background */}
      <div style={styles.movingBackground}></div>
      <div style={styles.overlayGlow}></div>
      
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>AK</div>
          <span style={styles.logoText}>NEPSE INTELLIGENCE</span>
        </div>
        <div style={styles.navLinks}>
          <button style={styles.loginBtn} onClick={() => navigate('/login')}>Sign In</button>
          <button style={styles.registerBtn} onClick={() => navigate('/register')}>Join Terminal</button>
        </div>
      </nav>

      <main style={styles.main}>
        <section style={styles.heroSection}>
          <div style={styles.heroContent} className="fade-up">
            <div style={styles.badge}>FINANCIAL OPERATING SYSTEM</div>
            <h1 style={styles.title}>Precision Assets <br /> <span style={styles.gradientText}>NEPSE & Wealth</span></h1>
            <p style={styles.subtitle}>
              The first cloud-native terminal for NEPSE trading 
              and localized wealth advisory. Dynamic WACC tracking, AI strategy auditing, and real-time portfolio intelligence.
            </p>
            <div style={styles.ctaGroup}>
              <button style={styles.mainCta} onClick={() => navigate('/register')}>Launch Your Terminal</button>
              <button style={styles.secondaryCta} onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                Explore Service Ecosystem
              </button>
            </div>
          </div>

          {/* Antigravity Visual Element */}
          <div style={styles.visualContainer} className="floating">
            <div style={styles.glassCard}>
              <div style={styles.abstractChart}>
                <div style={{...styles.chartBar, '--h': '40%', background: '#60a5fa'}} className="bar"></div>
                <div style={{...styles.chartBar, '--h': '75%', background: '#818cf8'}} className="bar"></div>
                <div style={{...styles.chartBar, '--h': '55%', background: '#34d399'}} className="bar"></div>
                <div style={{...styles.chartBar, '--h': '90%', background: '#a78bfa'}} className="bar"></div>
                <div style={{...styles.chartBar, '--h': '65%', background: '#f472b6'}} className="bar"></div>
              </div>
              <div style={styles.wealthOverlay}>
                <div style={styles.wealthLabel}>Wealth Advisor Localized</div>
                <div style={styles.wealthAmount}>Rs. 1,45,250.00</div>
                <div style={styles.wealthTrend}>+ 12.5% MTD Growth</div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" style={styles.features}>
          <div style={styles.sectionHeader} className="fade-up">
            <h2 style={styles.sectionTitle}>Built for Professional Excellence</h2>
            <div style={styles.sectionLine}></div>
          </div>

          <div style={styles.featureGrid}>
            <FeatureCard 
              icon="📈" 
              title="Secondary Market" 
              desc="Deep integration with NEPSE live feed. Accurate WACC, fee handling, and CGT liability auditing." 
              gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
            />
            <FeatureCard 
              icon="💰" 
              title="Wealth Advisor" 
              desc="Localized wealth management in NPR (Rs.) with automated asset distribution and expense tracking." 
              gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
            />
            <FeatureCard 
              icon="🧠" 
              title="AI Strategy Audit" 
              desc="Quant-driven insights using Gemini AI to evaluate your trade rationale and psychological discipline." 
              gradient="linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
            />
            <FeatureCard 
              icon="☁️" 
              title="Global Cloud Sync" 
              desc="Zero-loss data persistence powered by Supabase. Securely accessible from any mobile or desktop device." 
              gradient="linear-gradient(135deg, #10b981 0%, #047857 100%)"
            />
          </div>
        </section>

        <footer style={styles.footer}>
          <div style={styles.footerBrand}>
            <div style={styles.logoIconSmall}>AK</div>
            <span>AK-NEPSE Terminal v2.1</span>
          </div>
          <p style={styles.footerText}>© 2026 Developed by Ashish Khanal. Precision-engineered FinTech Solutions.</p>
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
    background: '#0f172a',
    color: '#fff',
    fontFamily: "'Inter', sans-serif",
    overflowX: 'hidden',
    position: 'relative'
  },
  movingBackground: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(-45deg, #0f172a, #1e1b4b, #1e293b, #0c4a6e)',
    backgroundSize: '400% 400%',
    animation: 'bg-slide 15s ease infinite',
    zIndex: 0
  },
  overlayGlow: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 60%)',
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
    maxWidth: '1200px',
    margin: '0 auto'
  },
  logo: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoIcon: { background: '#6366f1', color: '#fff', padding: '6px 10px', borderRadius: '8px', fontWeight: '900', fontSize: '14px' },
  logoText: { fontWeight: '800', fontSize: '20px', letterSpacing: '-0.02em', color: '#fff' },
  navLinks: { display: 'flex', gap: '24px', alignItems: 'center' },
  loginBtn: { background: 'none', border: 'none', color: '#94a3b8', fontWeight: '700', fontSize: '14px', cursor: 'pointer' },
  registerBtn: { background: '#fff', color: '#0f172a', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' },
  
  main: { position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '0 24px' },
  
  heroSection: {
    padding: '100px 0 120px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '60px',
    flexWrap: 'wrap'
  },
  heroContent: { flex: 1, minWidth: '400px' },
  badge: { display: 'inline-block', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', padding: '6px 16px', borderRadius: '40px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', marginBottom: '24px', border: '1px solid rgba(99, 102, 241, 0.2)' },
  title: { fontSize: '72px', fontWeight: '900', lineHeight: '1.05', letterSpacing: '-0.04em', color: '#fff', marginBottom: '28px' },
  gradientText: { background: 'linear-gradient(to right, #818cf8, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { fontSize: '20px', color: '#94a3b8', maxWidth: '600px', lineHeight: '1.6', marginBottom: '48px', fontWeight: '500' },
  ctaGroup: { display: 'flex', gap: '16px' },
  mainCta: { background: '#6366f1', color: '#fff', border: 'none', padding: '18px 40px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.4)' },
  secondaryCta: { background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '18px 40px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', backdropFilter: 'blur(10px)' },

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
    width: '380px',
    height: '380px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '40px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(40px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)',
    position: 'relative'
  },
  abstractChart: {
    width: '100%',
    height: '140px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '40px'
  },
  chartBar: {
    width: '36px',
    borderRadius: '8px 8px 4px 4px',
    opacity: 0.9,
    boxShadow: '0 10px 20px -5px rgba(0,0,0,0.3)'
  },
  wealthOverlay: {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    padding: '24px',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.1)',
    textAlign: 'center'
  },
  wealthLabel: { fontSize: '11px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' },
  wealthAmount: { fontSize: '28px', fontWeight: '950', color: '#fff', marginBottom: '4px' },
  wealthTrend: { fontSize: '12px', color: '#34d399', fontWeight: '800' },

  features: { padding: '100px 0' },
  sectionHeader: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '80px' },
  sectionTitle: { fontSize: '42px', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em', textAlign: 'center' },
  sectionLine: { width: '60px', height: '6px', background: '#6366f1', marginTop: '24px', borderRadius: '10px' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' },
  fCard: { padding: '48px 40px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.05)', transition: 'all 0.3s ease' },
  fIcon: { width: '72px', height: '72px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 32px auto', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)' },
  fTitle: { fontSize: '24px', fontWeight: '850', color: '#fff', marginBottom: '16px', textAlign: 'center' },
  fDesc: { fontSize: '16px', color: '#94a3b8', lineHeight: '1.7', fontWeight: '500', textAlign: 'center' },
  
  footer: { padding: '100px 0 60px 0', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' },
  footerBrand: { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontWeight: '800', color: '#fff', fontSize: '16px' },
  logoIconSmall: { background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: '900', fontSize: '11px', marginRight: '8px' },
  footerText: { fontSize: '14px', color: '#64748b', fontWeight: '500' }
};
