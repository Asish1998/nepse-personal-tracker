import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Auth.css'



export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }

    setLoading(true)

    try {
      await register(name, email, password)
      navigate('/')
    } catch (err) {
      console.error("Register Error:", err)
      setError(typeof err === 'string' ? err : (err.message || 'Registration failed. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      {/* Background Orbs */}
      <div className="auth-orb auth-orb-register-1" />
      <div className="auth-orb auth-orb-register-2" />
      
      {/* Container */}
      <div className="auth-card">
        
        <div className="auth-header">
           <h1 className="auth-title register">Create Account</h1>
           <p className="auth-subtitle">Join to start tracking your NEPSE portfolio</p>
         </div>


        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-input register"
              placeholder="John Doe"
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input register"
              placeholder="you@example.com"
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input register"
              placeholder="••••••••"
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Confirm Password</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="auth-input register"
              placeholder="••••••••"
            />
          </div>

          <div>
            <button 
              type="submit" 
              disabled={loading}
              className="auth-submit-btn register"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link register">
            Log in here
          </Link>
        </p>
      </div>

      {/* Designer Credit */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        width: '100%',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        opacity: 0.4,
        pointerEvents: 'none',
        zIndex: 1
      }}>
        Created & Designed by Ashish
      </div>
    </div>
  )
}