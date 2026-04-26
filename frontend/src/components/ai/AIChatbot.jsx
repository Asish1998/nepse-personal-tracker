import { useState, useRef, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { tellGemini, generateContextString } from '../../utils/aiClient'

export default function AIChatbot() {
  const { state } = useApp()
  const apiKey = state.aiConfig?.geminiKey
  
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I'm your AI Portfolio Coach. Ask me anything about your current holdings, hypothetical trades, or market strategies!" }
  ])
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !apiKey) return
    const userMsg = input.trim()
    setInput('')
    
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const context = generateContextString(state)
      const prompt = `${context}\n\nUSER PROMPT:\n${userMsg}`
      
      const aiResponse = await tellGemini(prompt, apiKey)
      setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: `⚠️ Error: ${err.message}` }])
    } finally {
      setLoading(false)
    }
  }

  if (!apiKey) return null // Hide widget if AI not configured

  if (!open) {
    return (
      <button style={styles.fab} onClick={() => setOpen(true)} title="Ask AI Portfolio Coach">
        <span style={{ fontSize: '24px' }}>✨</span>
      </button>
    )
  }

  return (
    <div style={styles.chatWindow}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>✨</span>
          <h3 style={styles.title}>AI Portfolio Coach</h3>
        </div>
        <button style={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
      </div>

      <div style={styles.messageArea} ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} style={{
            ...styles.messageBox,
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            background: m.role === 'user' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: m.role === 'user' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div style={{...styles.messageBox, alignSelf: 'flex-start', color: 'var(--text-muted)' }}>
            Thinking...
          </div>
        )}
      </div>

      <div style={styles.inputArea}>
        <input 
          style={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your portfolio..."
          disabled={loading}
        />
        <button style={styles.sendBtn} onClick={handleSend} disabled={loading || !input.trim()}>
          ➤
        </button>
      </div>
    </div>
  )
}

const styles = {
  fab: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '60px',
    height: '60px',
    borderRadius: '30px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    border: 'none',
    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    transition: 'transform 0.2s',
  },
  chatWindow: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '350px',
    height: '500px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    boxShadow: 'var(--shadow-card)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 9999,
    backdropFilter: 'blur(16px)'
  },
  header: {
    padding: '16px',
    background: 'rgba(0,0,0,0.2)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--text-main)'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: '16px'
  },
  messageArea: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  messageBox: {
    padding: '10px 14px',
    borderRadius: '12px',
    fontSize: '13px',
    lineHeight: '1.5',
    color: 'var(--text-main)',
    maxWidth: '85%',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap'
  },
  inputArea: {
    padding: '12px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    gap: '8px',
    background: 'rgba(0,0,0,0.1)'
  },
  input: {
    flex: 1,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '13px',
    color: 'var(--text-main)',
    outline: 'none'
  },
  sendBtn: {
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    width: '40px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}
