import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { BarChart2, TrendingUp, History, PieChart, Activity, Bell, Menu, X, ArrowRight, Check } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [marketSummary, setMarketSummary] = useState(null);
  const [topSymbols, setTopSymbols] = useState([]);

  useEffect(() => {
    if (user) navigate('/');

    let isMounted = true;
    const fetchLive = async () => {
      try {
        const API_BASE = import.meta.env.VITE_NEPSE_API;
        if (!API_BASE) return;
        const [sumRes, symRes] = await Promise.all([
          fetch(`${API_BASE}/market/summary`).catch(() => null),
          fetch(`${API_BASE}/symbols`).catch(() => null)
        ]);

        if (sumRes?.ok && isMounted) setMarketSummary(await sumRes.json());
        if (symRes?.ok && isMounted) {
          const syms = await symRes.json();
          // Mix it up slightly or just take top 10
          setTopSymbols(syms.slice(0, 10));
        }
      } catch (err) { }
    };

    fetchLive();
    return () => { isMounted = false; };
  }, [user, navigate]);

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { display: flex; white-space: nowrap; animation: marquee 25s linear infinite; }
        .ticker-item { margin-right: 3rem; display: inline-flex; align-items: center; gap: 0.5rem; font-family: monospace; font-size: 0.9rem; font-weight: 600; }
        
        @keyframes pulse-cycle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.98); }
        }
        
        @keyframes count-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .glass-card {
          background: #111827;
          border: 1px solid #1F2937;
          border-radius: 1rem;
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          border-color: rgba(16, 185, 129, 0.4);
          box-shadow: 0 10px 40px -10px rgba(16, 185, 129, 0.15);
        }
      `}</style>

      {/* [A] NAVBAR */}
      <nav style={styles.nav}>
        <div style={styles.logo} onClick={() => window.scrollTo(0, 0)}>
          <BarChart2 size={28} color="#10B981" />
          <span style={styles.logoText}>Astrix Alpha</span>
        </div>

        <div style={styles.desktopNav}>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#demo" style={styles.navLink}>Market</a>
          <a href="#how-it-works" style={styles.navLink}>Portfolio</a>
          <a href="#pricing" style={styles.navLink}>Pricing</a>
        </div>

        <div style={styles.authGroup}>
          <button style={styles.ghostBtn} onClick={() => navigate('/login')}>Sign In</button>
          <button style={styles.primaryBtn} onClick={() => navigate('/register')}>Get Started Free</button>
        </div>

        <button style={styles.mobileMenuBtn} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} color="#F9FAFB" /> : <Menu size={24} color="#F9FAFB" />}
        </button>
      </nav>

      <main>
        {/* [B] HERO SECTION */}
        <section style={styles.heroSection}>
          <div style={styles.heroContent}>
            <h1 style={styles.title}>
              Track Your NEPSE Portfolio <br />
              <span style={styles.gradientText}>Like a Pro</span>
            </h1>
            <p style={styles.subtitle}>
              Real-time portfolio tracking, profit/loss analytics, and smart insights — built for Nepali investors.
            </p>
            <div style={styles.ctaGroup}>
              <button style={{ ...styles.primaryBtn, padding: '1rem 2rem', fontSize: '1.1rem' }} onClick={() => navigate('/register')}>
                Start Free <ArrowRight size={20} style={{ marginLeft: 8 }} />
              </button>
              <button style={styles.outlineBtn} onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                See Live Demo
              </button>
            </div>
          </div>

          <div style={styles.heroVisual}>
            <div style={styles.mockupCard}>
              <div style={styles.mockupHeader}>Live Portfolio Sync</div>
              {topSymbols.length >= 4 ? (
                <>
                  <MockupRow symbol={topSymbols[0].symbol} ltp={topSymbols[0].ltp} pct={((topSymbols[0].change / (topSymbols[0].ltp - topSymbols[0].change)) * 100).toFixed(2)} isUp={topSymbols[0].change >= 0} />
                  <MockupRow symbol={topSymbols[1].symbol} ltp={topSymbols[1].ltp} pct={((topSymbols[1].change / (topSymbols[1].ltp - topSymbols[1].change)) * 100).toFixed(2)} isUp={topSymbols[1].change >= 0} />
                  <MockupRow symbol={topSymbols[2].symbol} ltp={topSymbols[2].ltp} pct={((topSymbols[2].change / (topSymbols[2].ltp - topSymbols[2].change)) * 100).toFixed(2)} isUp={topSymbols[2].change >= 0} />
                  <MockupRow symbol={topSymbols[3].symbol} ltp={topSymbols[3].ltp} pct={((topSymbols[3].change / (topSymbols[3].ltp - topSymbols[3].change)) * 100).toFixed(2)} isUp={topSymbols[3].change >= 0} />
                </>
              ) : (
                <>
                  <MockupRow symbol="NABIL" ltp="1,320" pct="+12.5" isUp={true} />
                  <MockupRow symbol="EBL" ltp="820" pct="-2.3" isUp={false} />
                  <MockupRow symbol="UPPER" ltp="395" pct="+5.8" isUp={true} />
                  <MockupRow symbol="SHIVM" ltp="540" pct="+1.1" isUp={true} />
                </>
              )}
            </div>
          </div>
        </section>

        {/* MARQUEE TICKER */}
        <div style={styles.tickerStrip}>
          <div className="animate-marquee">
            {[1, 2].map(k => (
              <div key={k} style={{ display: 'flex' }}>
                <span className="ticker-item" style={{ color: '#F9FAFB' }}>
                  NEPSE {marketSummary ? marketSummary.nepseIndex?.toLocaleString() : '2,744.56'}
                  <span style={{ color: (marketSummary?.nepseChange >= 0) ? '#10B981' : '#EF4444' }}>
                    {marketSummary?.nepseChange >= 0 ? '▲' : '▼'} {Math.abs(marketSummary?.nepseChange || 1.2)}
                  </span>
                </span>

                {topSymbols.length > 0 ? topSymbols.map((sym, idx) => {
                  const prior = sym.ltp - sym.change;
                  const pct = prior > 0 ? (sym.change / prior) * 100 : 0;
                  const isUp = sym.change >= 0;
                  return (
                    <span key={idx + '-' + sym.symbol} className="ticker-item" style={{ color: '#9CA3AF' }}>
                      {sym.symbol} रू {sym.ltp} <span style={{ color: isUp ? '#10B981' : '#EF4444' }}>{isUp ? '▲' : '▼'} {Math.abs(pct).toFixed(2)}%</span>
                    </span>
                  )
                }) : (
                  <>
                    <span className="ticker-item" style={{ color: '#9CA3AF' }}>NABIL रू 1,320 <span style={{ color: '#10B981' }}>▲ 2.5%</span></span>
                    <span className="ticker-item" style={{ color: '#9CA3AF' }}>EBL रू 820 <span style={{ color: '#EF4444' }}>▼ 1.1%</span></span>
                    <span className="ticker-item" style={{ color: '#9CA3AF' }}>UPPER रू 395 <span style={{ color: '#10B981' }}>▲ 5.8%</span></span>
                    <span className="ticker-item" style={{ color: '#9CA3AF' }}>SHIVM रू 540 <span style={{ color: '#10B981' }}>▲ 1.1%</span></span>
                    <span className="ticker-item" style={{ color: '#9CA3AF' }}>NICA रू 850 <span style={{ color: '#EF4444' }}>▼ 0.5%</span></span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* [C] LIVE STATS BAR */}
        <section style={styles.statsBar}>
          <div style={styles.statItem}>
            <h3 style={styles.statNum}>12,000+</h3>
            <p style={styles.statLabel}>Investors Tracking</p>
          </div>
          <div style={styles.statItem}>
            <h3 style={styles.statNum}>रू 2.4B+</h3>
            <p style={styles.statLabel}>Portfolio Value Tracked</p>
          </div>
          <div style={styles.statItem}>
            <h3 style={styles.statNum}>200+</h3>
            <p style={styles.statLabel}>NEPSE Stocks Covered</p>
          </div>
        </section>

        {/* [D] FEATURES SECTION */}
        <section id="features" style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Built for Intelligent Trading</h2>
            <p style={styles.sectionSub}>Everything you need to manage your NEPSE holdings in one minimal interface.</p>
          </div>

          <div style={styles.featureGrid}>
            <FeatureCard
              icon={<TrendingUp size={32} color="#10B981" />}
              title="Real-Time Portfolio"
              desc="Track your holdings with live LTP from NEPSE. See P&L updated every market session."
            />
            <FeatureCard
              icon={<Activity size={32} color="#F59E0B" />}
              title="WACC Calculator"
              desc="Automatically calculates your Weighted Average Cost including broker fee, SEBON & DP charges."
            />
            <FeatureCard
              icon={<History size={32} color="#3B82F6" />}
              title="Transaction History"
              desc="Log BUY, SELL, BONUS, IPO, RIGHT shares. Full history with date and cost breakdown."
            />
            <FeatureCard
              icon={<PieChart size={32} color="#8B5CF6" />}
              title="Gain/Loss Analytics"
              desc="Visual charts showing portfolio performance, sector allocation, and realized vs unrealized gains."
            />
            <FeatureCard
              icon={<BarChart2 size={32} color="#EC4899" />}
              title="IPO Tracker"
              desc="Track upcoming IPOs, applied units, and allotment status in one secure place."
            />
            <FeatureCard
              icon={<Bell size={32} color="#EF4444" />}
              title="Dividend Tracker"
              desc="Never miss a book close date. Track cash and bonus dividends across all your holdings."
            />
          </div>
        </section>

        {/* [E] HOW IT WORKS */}
        <section id="how-it-works" style={{ ...styles.section, background: 'rgba(17, 24, 39, 0.4)' }}>
          <h2 style={{ ...styles.sectionTitle, textAlign: 'center', marginBottom: '4rem' }}>How It Works</h2>
          <div style={styles.stepsContainer}>
            <Step number="1" title="Create Account" desc="Sign up free with your email in seconds." />
            <div style={styles.stepLine}></div>
            <Step number="2" title="Add Transactions" desc="Enter your BUY, SELL, or BONUS transactions." />
            <div style={styles.stepLine}></div>
            <Step number="3" title="Track & Profit" desc="Watch your wealth grow in real-time." />
          </div>
        </section>

        {/* [F] PORTFOLIO PREVIEW SCREENSHOT */}
        <section id="demo" style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Everything You Need In One Dashboard</h2>
            <p style={styles.sectionSub}>Institutional-grade analytics paired with an intuitive UI.</p>
          </div>

          <div style={styles.previewContainer}>
            <div style={styles.previewMockup}>
              <div style={styles.previewMockupHeader}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }}></div>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }}></div>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981' }}></div>
                </div>
                <div style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'monospace' }}>Astrix Alpha Terminal</div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.previewTable}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Symbol</th>
                      <th style={styles.th}>Shares</th>
                      <th style={styles.th}>Avg Cost</th>
                      <th style={styles.th}>LTP</th>
                      <th style={styles.th}>Value</th>
                      <th style={styles.th}>P&L</th>
                      <th style={styles.th}>P&L%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ ...styles.td, fontWeight: 700, color: '#F9FAFB' }}>NABIL</td>
                      <td style={styles.td}>100</td>
                      <td style={styles.td}>रू1,050</td>
                      <td style={styles.td}>रू1,320</td>
                      <td style={{ ...styles.td, fontWeight: 600 }}>रू1,32,000</td>
                      <td style={{ ...styles.td, color: '#10B981', fontWeight: 600 }}>+रू27,000</td>
                      <td style={{ ...styles.td, color: '#10B981', fontWeight: 600 }}>+25.7%</td>
                    </tr>
                    <tr>
                      <td style={{ ...styles.td, fontWeight: 700, color: '#F9FAFB' }}>EBL</td>
                      <td style={styles.td}>200</td>
                      <td style={styles.td}>रू740</td>
                      <td style={styles.td}>रू820</td>
                      <td style={{ ...styles.td, fontWeight: 600 }}>रू1,64,000</td>
                      <td style={{ ...styles.td, color: '#10B981', fontWeight: 600 }}>+रू16,000</td>
                      <td style={{ ...styles.td, color: '#10B981', fontWeight: 600 }}>+10.8%</td>
                    </tr>
                    <tr>
                      <td style={{ ...styles.td, fontWeight: 700, color: '#F9FAFB' }}>UPPER</td>
                      <td style={styles.td}>150</td>
                      <td style={styles.td}>रू380</td>
                      <td style={styles.td}>रू395</td>
                      <td style={{ ...styles.td, fontWeight: 600 }}>रू59,250</td>
                      <td style={{ ...styles.td, color: '#10B981', fontWeight: 600 }}>+रू2,250</td>
                      <td style={{ ...styles.td, color: '#10B981', fontWeight: 600 }}>+3.9%</td>
                    </tr>
                    <tr style={{ background: 'rgba(239, 68, 68, 0.05)' }}>
                      <td style={{ ...styles.td, fontWeight: 700, color: '#F9FAFB' }}>NICA</td>
                      <td style={styles.td}>50</td>
                      <td style={styles.td}>रू920</td>
                      <td style={styles.td}>रू850</td>
                      <td style={{ ...styles.td, fontWeight: 600 }}>रू42,500</td>
                      <td style={{ ...styles.td, color: '#EF4444', fontWeight: 600 }}>-रू3,500</td>
                      <td style={{ ...styles.td, color: '#EF4444', fontWeight: 600 }}>-7.6%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* [G] TESTIMONIALS */}
        <section style={{ ...styles.section, background: 'rgba(17, 24, 39, 0.4)' }}>
          <h2 style={{ ...styles.sectionTitle, textAlign: 'center', marginBottom: '3rem' }}>Loved by Traders</h2>
          <div style={styles.testimonialGrid}>
            <Testimonial text="Finally a portfolio tracker that understands NEPSE!" author="Rajesh K." location="Kathmandu" />
            <Testimonial text="The WACC calculation saves me so much time tracking broken broker logs." author="Priya S." location="Pokhara" />
            <Testimonial text="Love the IPO tracker feature. Everything is just so smooth." author="Bikash T." location="Biratnagar" />
          </div>
        </section>

        {/* [H] PRICING */}
        <section id="pricing" style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Simple Pricing</h2>
            <p style={styles.sectionSub}>Pick the plan that suits your trading volume.</p>
          </div>

          <div style={styles.pricingGrid}>
            <div style={styles.pricingCard}>
              <h3 style={styles.pricingPlan}>FREE</h3>
              <div style={styles.pricingPrice}>रू0<span style={styles.pricingPeriod}>/forever</span></div>
              <ul style={styles.pricingList}>
                <li style={styles.pricingItem}><Check size={18} color="#10B981" /> Up to 10 stocks</li>
                <li style={styles.pricingItem}><Check size={18} color="#10B981" /> Manual transactions</li>
                <li style={styles.pricingItem}><Check size={18} color="#10B981" /> Basic P&L view</li>
                <li style={{ ...styles.pricingItem, color: '#6B7280' }}><X size={18} color="#6B7280" /> Realtime prices</li>
                <li style={{ ...styles.pricingItem, color: '#6B7280' }}><X size={18} color="#6B7280" /> Advanced analytics</li>
              </ul>
              <button style={styles.outlineBtn} onClick={() => navigate('/register')}>Sign Up Free</button>
            </div>

            <div style={{ ...styles.pricingCard, border: '2px solid #F59E0B', transform: 'scale(1.05)', background: 'linear-gradient(180deg, #111827 0%, rgba(245, 158, 11, 0.05) 100%)' }}>
              <div style={styles.pricingBadge}>MOST POPULAR</div>
              <h3 style={styles.pricingPlan}>PRO</h3>
              <div style={styles.pricingPrice}>रू999<span style={styles.pricingPeriod}>/year</span></div>
              <ul style={styles.pricingList}>
                <li style={styles.pricingItem}><Check size={18} color="#10B981" /> Unlimited stocks</li>
                <li style={styles.pricingItem}><Check size={18} color="#10B981" /> Live LTP updates</li>
                <li style={styles.pricingItem}><Check size={18} color="#10B981" /> Advanced charts</li>
                <li style={styles.pricingItem}><Check size={18} color="#10B981" /> IPO & dividend tracker</li>
                <li style={styles.pricingItem}><Check size={18} color="#10B981" /> Export to CSV/Excel</li>
                <li style={styles.pricingItem}><Check size={18} color="#10B981" /> Priority support</li>
              </ul>
              <button style={{ ...styles.primaryBtn, width: '100%' }} onClick={() => navigate('/register')}>Upgrade to Pro</button>
            </div>
          </div>
        </section>
      </main>

      {/* [I] FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.logo}>
            <BarChart2 size={24} color="#10B981" />
            <span style={{ ...styles.logoText, fontSize: '1.2rem' }}>Astrix Alpha</span>
          </div>
          <p style={{ color: '#9CA3AF', marginTop: '1rem', fontStyle: 'italic' }}>Built for Nepali Investors 🇳🇵</p>
        </div>

        <div style={styles.footerLinks}>
          <a href="#" style={styles.footerLink}>About</a>
          <a href="#" style={styles.footerLink}>Privacy Policy</a>
          <a href="#" style={styles.footerLink}>Terms</a>
          <a href="#" style={styles.footerLink}>Contact</a>
        </div>

        <div style={{ marginTop: '3rem', color: '#6B7280', fontSize: '0.875rem' }}>
          © {new Date().getFullYear()} Astrix Alpha. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function MockupRow({ symbol, ltp, pct, isUp }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #1F2937' }}>
      <div style={{ fontWeight: 700, color: '#F9FAFB' }}>{symbol}</div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 600, color: '#F9FAFB' }}>रू {ltp}</div>
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: isUp ? '#10B981' : '#EF4444' }}>
          {isUp ? '↑' : '↓'} {pct}%
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-card" style={styles.fCard}>
      <div style={styles.fIconBox}>{icon}</div>
      <h3 style={styles.fTitle}>{title}</h3>
      <p style={styles.fDesc}>{desc}</p>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div style={styles.stepBox}>
      <div style={styles.stepNum}>{number}</div>
      <h4 style={styles.stepTitle}>{title}</h4>
      <p style={styles.stepDesc}>{desc}</p>
    </div>
  );
}

function Testimonial({ text, author, location }) {
  return (
    <div className="glass-card" style={styles.tCard}>
      <p style={styles.tText}>"{text}"</p>
      <div style={styles.tAuthor}>— {author}, <span style={{ color: '#9CA3AF', fontWeight: 'normal' }}>{location}</span></div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0A0F1E',
    color: '#F9FAFB',
    fontFamily: "'Inter', sans-serif",
    position: 'relative'
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 2rem',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(10, 15, 30, 0.8)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #1F2937'
  },
  logo: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  logoText: { fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#F9FAFB' },
  desktopNav: { display: 'flex', gap: '2rem' },
  navLink: { color: '#9CA3AF', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s', fontSize: '0.95rem' },
  authGroup: { display: 'flex', alignItems: 'center', gap: '1rem' },
  ghostBtn: { background: 'none', border: 'none', color: '#F9FAFB', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
  primaryBtn: { background: '#10B981', color: '#0A0F1E', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' },
  outlineBtn: { background: 'transparent', color: '#F9FAFB', border: '1px solid #374151', padding: '0.6rem 1.25rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' },
  mobileMenuBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'none' }, // Note: CSS overrides not strict here, assuming desktop first

  heroSection: { padding: '5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4rem', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap' },
  heroContent: { flex: 1, minWidth: '320px' },
  title: { fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '1.5rem' },
  gradientText: { background: 'linear-gradient(to right, #10B981, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { fontSize: '1.125rem', color: '#9CA3AF', marginBottom: '2.5rem', maxWidth: '480px', lineHeight: 1.6 },
  ctaGroup: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },

  heroVisual: { flex: 1, minWidth: '320px', display: 'flex', justifyContent: 'center' },
  mockupCard: { background: '#111827', width: '100%', maxWidth: '380px', borderRadius: '1rem', border: '1px solid #1F2937', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', overflow: 'hidden' },
  mockupHeader: { background: '#1F2937', padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' },

  tickerStrip: { background: '#111827', borderTop: '1px solid #1F2937', borderBottom: '1px solid #1F2937', padding: '0.75rem 0', overflow: 'hidden' },

  statsBar: { display: 'flex', justifyContent: 'center', gap: '4rem', padding: '4rem 2rem', flexWrap: 'wrap', borderBottom: '1px solid #1F2937', background: 'rgba(17, 24, 39, 0.4)' },
  statItem: { textAlign: 'center' },
  statNum: { fontSize: '2.5rem', fontWeight: 900, color: '#F9FAFB', marginBottom: '0.5rem' },
  statLabel: { fontSize: '1rem', color: '#9CA3AF', fontWeight: 500 },

  section: { padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' },
  sectionHeader: { textAlign: 'center', marginBottom: '4rem' },
  sectionTitle: { fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' },
  sectionSub: { fontSize: '1.125rem', color: '#9CA3AF', maxWidth: '600px', margin: '0 auto' },

  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' },
  fCard: { padding: '2rem' },
  fIconBox: { width: '48px', height: '48px', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid #1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' },
  fTitle: { fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' },
  fDesc: { color: '#9CA3AF', lineHeight: 1.6 },

  stepsContainer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', maxWidth: '900px', margin: '0 auto', flexWrap: 'wrap' },
  stepBox: { flex: 1, textAlign: 'center', minWidth: '220px' },
  stepNum: { width: '40px', height: '40px', borderRadius: '50%', background: '#10B981', color: '#0A0F1E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, margin: '0 auto 1.5rem', fontSize: '1.25rem' },
  stepTitle: { fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' },
  stepDesc: { color: '#9CA3AF', lineHeight: 1.5 },
  stepLine: { height: '2px', flex: 1, background: '#1F2937', minWidth: '50px' },

  previewContainer: { display: 'flex', justifyContent: 'center' },
  previewMockup: { background: '#111827', width: '100%', borderRadius: '1rem', border: '1px solid #1F2937', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', overflow: 'hidden' },
  previewMockupHeader: { background: '#1F2937', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  previewTable: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' },
  th: { padding: '1rem', borderBottom: '1px solid #1F2937', color: '#9CA3AF', fontWeight: 600, fontSize: '0.875rem' },
  td: { padding: '1rem', borderBottom: '1px solid #1F2937' },

  testimonialGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' },
  tCard: { padding: '2rem' },
  tText: { fontSize: '1.125rem', color: '#F9FAFB', fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: 1.6 },
  tAuthor: { fontWeight: 700, color: '#10B981' },

  pricingGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '800px', margin: '0 auto', alignItems: 'center' },
  pricingCard: { padding: '3rem 2rem', background: '#111827', border: '1px solid #1F2937', borderRadius: '1rem', position: 'relative' },
  pricingBadge: { position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', background: '#F59E0B', color: '#0A0F1E', padding: '0.25rem 1rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em' },
  pricingPlan: { fontSize: '1.5rem', fontWeight: 800, color: '#F9FAFB', marginBottom: '1rem', textAlign: 'center' },
  pricingPrice: { fontSize: '3rem', fontWeight: 900, textAlign: 'center', marginBottom: '2rem' },
  pricingPeriod: { fontSize: '1rem', color: '#9CA3AF', fontWeight: 600 },
  pricingList: { listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' },
  pricingItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 },

  footer: { borderTop: '1px solid #1F2937', padding: '4rem 2rem', textAlign: 'center', background: '#111827' },
  footerContent: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' },
  footerLinks: { display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' },
  footerLink: { color: '#9CA3AF', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' },
};
