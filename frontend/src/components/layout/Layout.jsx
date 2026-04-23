export default function Layout({ children }) {
  return (
    <main style={{ padding: '24px 0', width: '100%', maxWidth: 1200, margin: '0 auto' }}>
      <div className="glass" style={{ padding: '32px', minHeight: 'calc(100vh - 160px)', margin: '0 24px' }}>
        {children}
      </div>
    </main>
  )
}