import { useState, useEffect } from 'react'
import { tellGemini } from '../../utils/aiClient'
import { useApp } from '../../context/AppContext'

export default function MarketSentiment() {
  const { state } = useApp()
  const apiKey = state.aiConfig?.geminiKey
  
  const [news, setNews] = useState([])
  const [sentiment, setSentiment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const API_BASE = import.meta.env.VITE_NEPSE_API || 'http://localhost:3001'
      const res = await fetch(`${API_BASE}/news`)
      if (!res.ok) throw new Error('Failed to fetch news')
      const data = await res.json()
      setNews(data)
    } catch (err) {
      console.error(err)
      setError('Could not fetch latest market headlines.')
    }
  }

  const analyzeSentiment = async () => {
    if (!apiKey) return alert("Please configure your AI API Key in settings.")
    if (news.length === 0) return

    setLoading(true)
    setError('')
    try {
      const headlines = news.map(n => `- ${n.title} (${n.date})`).join('\n')
      const prompt = `
You are an expert NEPSE financial analyst. Here are the top headlines in the Nepal market today:
${headlines}

Analyze the overall market sentiment based ONLY on these headlines. 
Format your response exactly as follows (no markdown blocks, just raw text):
TAG: [BULLISH / BEARISH / NEUTRAL]
SUMMARY: [A strictly 2-sentence summary of the macro situation]
      `
      
      const res = await tellGemini(prompt, apiKey)
      
      const tagMatch = res.match(/TAG:\s*(.*)/i)
      const sumMatch = res.match(/SUMMARY:\s*(.*)/s)
      
      if (tagMatch && sumMatch) {
         setSentiment({
           tag: tagMatch[1].trim().toUpperCase(),
           summary: sumMatch[1].trim()
         })
      } else {
         setSentiment({ tag: 'NEUTRAL', summary: res })
      }

    } catch (err) {
      setError("AI Analysis failed: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const tagColor = sentiment?.tag === 'BULLISH' ? 'var(--success)' : (sentiment?.tag === 'BEARISH' ? 'var(--danger)' : 'var(--text-muted)')

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.emoji}>📰</span>
        <h2 style={styles.title}>Market Sentiment (AI)</h2>
      </div>

      <div style={styles.split}>
        <div style={styles.newsBox}>
          <div style={styles.newsTitle}>Latest NEPSE Headlines</div>
          {error ? <div style={styles.error}>{error}</div> : (
            <div style={styles.newsList}>
              {news.length === 0 ? "Loading news..." : news.map((n, i) => (
                <div key={i} style={styles.newsItem}>
                  <div style={styles.nt}>{n.title}</div>
                  <div style={styles.nd}>{n.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.analysisBox}>
          {!sentiment && !loading ? (
             <div style={styles.centerBox}>
               <p style={styles.promptText}>Run an AI pass over latest headlines to gauge market temperature.</p>
               <button style={styles.btn} onClick={analyzeSentiment} disabled={news.length===0}>
                 🧬 Analyze Sentiment
               </button>
             </div>
          ) : loading ? (
             <div style={styles.centerBox}>
                <div style={styles.spinner}>Processing...</div>
             </div>
          ) : (
             <div style={styles.resultBox}>
                <div style={styles.tagWrap}>
                  <div style={{ ...styles.tag, color: tagColor, borderColor: tagColor }}>
                    {sentiment.tag}
                  </div>
                </div>
                <div style={styles.summary}>{sentiment.summary}</div>
                <button style={styles.refreshBtn} onClick={analyzeSentiment}>Refresh Analysis</button>
             </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: 'var(--shadow-card)',
    marginTop: '32px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px'
  },
  emoji: {
    fontSize: '24px',
    background: 'rgba(255,255,255,0.05)',
    padding: '8px',
    borderRadius: '8px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-main)',
    margin: 0
  },
  split: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
    gap: '24px'
  },
  newsBox: {
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
    height: '300px',
    display: 'flex',
    flexDirection: 'column'
  },
  newsTitle: {
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '12px',
    letterSpacing: '0.05em'
  },
  newsList: {
    overflowY: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingRight: '8px'
  },
  newsItem: {
    background: 'rgba(255,255,255,0.03)',
    padding: '10px',
    borderRadius: '8px',
  },
  nt: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-main)',
    marginBottom: '4px',
    lineHeight: '1.4'
  },
  nd: {
    fontSize: '11px',
    color: 'var(--secondary)'
  },
  error: {
    color: 'var(--danger)',
    fontSize: '13px'
  },
  analysisBox: {
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
    height: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  centerBox: {
    textAlign: 'center',
    padding: '24px'
  },
  promptText: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    marginBottom: '16px'
  },
  btn: {
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '14px'
  },
  spinner: {
    color: 'var(--primary)',
    fontWeight: '700',
    fontSize: '14px',
    animation: 'pulse 1.5s infinite'
  },
  resultBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '16px',
    height: '100%'
  },
  tagWrap: {
    marginBottom: '16px'
  },
  tag: {
    fontSize: '24px',
    fontWeight: '800',
    letterSpacing: '0.05em',
    padding: '8px 24px',
    border: '2px solid',
    borderRadius: '12px',
    background: 'rgba(0,0,0,0.3)'
  },
  summary: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: 'var(--text-main)',
    flex: 1,
    display: 'flex',
    alignItems: 'center'
  },
  refreshBtn: {
    background: 'none',
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    marginTop: '16px'
  }
}
