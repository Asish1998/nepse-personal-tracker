import { useState, useEffect } from 'react'

const NEWS_SOURCES = [
  { name: 'Merolagani', url: 'https://merolagani.com/NewsList.aspx', color: '#e63946' },
  { name: 'Sharesansar', url: 'https://www.sharesansar.com/category/latest-news', color: '#1d3557' },
  { name: 'Bizshala', url: 'https://bizshala.com/', color: '#2a9d8f' },
  { name: 'NepseAlpha', url: 'https://nepsealpha.com/stock-market-news', color: '#f4a261' }
]

export default function MarketNews() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching news (Since scraping requires server-side/proxy, we provide high-quality mock data for now)
    const mockNews = [
      {
        id: 1,
        title: "NEPSE Index gains 12.45 points as commercial banks see heavy turnover",
        source: "Merolagani",
        time: "2 hours ago",
        link: "https://merolagani.com/NewsList.aspx",
        category: "Market Update",
        image: "https://merolagani.com/Handlers/GetNewsImage.ashx?id=123"
      },
      {
        id: 2,
        title: "Nepal Rastra Bank issues new circular on working capital loans; positive impact expected on equity market",
        source: "Sharesansar",
        time: "5 hours ago",
        link: "https://www.sharesansar.com/category/latest-news",
        category: "Policy",
      },
      {
        id: 3,
        title: "Upper Tamakoshi Hydropower (UPPER) announces 100% Right Share; Book closure date fixed",
        source: "Bizshala",
        time: "Today",
        link: "https://bizshala.com/",
        category: "Corporate",
      },
      {
        id: 4,
        title: "Deeper analysis into the 30% dividend yield of microfinance companies for this fiscal year",
        source: "NepseAlpha",
        time: "Yesterday",
        link: "https://nepsealpha.com/stock-market-news",
        category: "Analysis",
      }
    ]
    
    setTimeout(() => {
      setNews(mockNews)
      setLoading(false)
    }, 800)
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={styles.icon}>📰</span>
          <h2 style={styles.title}>Nepal Market News</h2>
        </div>
        <div style={styles.sources}>
          {NEWS_SOURCES.map(s => (
            <a key={s.name} href={s.url} target="_blank" rel="noreferrer" style={{ ...styles.sourceBadge, borderColor: s.color, color: s.color }}>
              {s.name}
            </a>
          ))}
        </div>
      </div>

      <div style={styles.grid}>
        {news.map(item => (
          <a key={item.id} href={item.link} target="_blank" rel="noreferrer" style={styles.newsCard}>
            <div style={styles.newsMeta}>
              <span style={styles.category}>{item.category}</span>
              <span style={styles.dot}>•</span>
              <span style={styles.time}>{item.time}</span>
            </div>
            <h3 style={styles.newsTitle}>{item.title}</h3>
            <div style={styles.newsFooter}>
              <span style={styles.newsSource}>via {item.source}</span>
              <span style={styles.readMore}>Read Full Article →</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    marginTop: '40px',
    padding: '32px',
    background: 'var(--bg-card)',
    borderRadius: '20px',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-card)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  icon: { fontSize: '24px' },
  title: { fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', margin: 0 },
  sources: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  sourceBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '6px',
    border: '1px solid',
    textDecoration: 'none',
    transition: 'all 0.2s',
    background: 'rgba(255,255,255,0.02)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  newsCard: {
    background: 'var(--bg-main)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '20px',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  },
  newsMeta: { display: 'flex', alignItems: 'center', gap: '8px' },
  category: { fontSize: '11px', fontWeight: '800', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  time: { fontSize: '12px', color: 'var(--text-muted)' },
  dot: { color: 'var(--border-dark)', fontSize: '12px' },
  newsTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-main)',
    lineHeight: '1.5',
    margin: 0,
    flexGrow: 1
  },
  newsFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid var(--border)',
    marginTop: '8px'
  },
  newsSource: { fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)' },
  readMore: { fontSize: '11px', fontWeight: '800', color: 'var(--primary)' }
}
