export default function Skeleton({ width = '100%', height = '20px', borderRadius = '4px', margin = '0' }) {
  return (
    <div 
      className="skeleton-pulse"
      style={{
        width,
        height,
        borderRadius,
        margin,
        background: 'linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)',
        backgroundSize: '200% 100%'
      }} 
    />
  )
}
