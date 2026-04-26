import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Auth.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      {/* Background Orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      
      {/* Container */}
      <div className="auth-card">
        
        <div className="auth-header">
          <h1 className="auth-title login">Welcome Back</h1>
          <p className="auth-subtitle">Enter your details to access your portfolio</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input login"
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
              className="auth-input login"
              placeholder="••••••••"
            />
          </div>

          <div>
            <button 
              type="submit" 
              disabled={loading}
              className="auth-submit-btn login"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </div>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link login">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}