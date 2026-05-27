import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

export default function LoginPage() {
  const nav = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin() {
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // App.jsx redirect handles navigation
    } catch (e) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="glow-orb" style={{ width:260, height:260, background:'rgba(61,255,122,0.05)', top:0, right:'-60px' }} />

      <div className="page-inner fade-up" style={{ position:'relative', zIndex:1 }}>
        <button className="back-btn" onClick={() => nav('/')}>
          ← Back
        </button>

        <div style={{ marginBottom:32 }}>
          <div className="brand" style={{ marginBottom:6 }}>Aller<span>AI</span></div>
          <p className="section-title">Welcome back</p>
          <p style={{ color:'var(--text-muted)', fontSize:14, marginTop:4 }}>Sign in to your account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          <div className="input-group">
            <label>Email / ID</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div className="input-group" style={{ marginBottom:24 }}>
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <button className="btn btn-primary" onClick={handleLogin} disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in…</> : 'Sign In'}
          </button>
        </div>

        <div className="divider">or</div>

        <button className="btn btn-outline" onClick={() => nav('/signup')}>
          Create an account
        </button>
      </div>
    </div>
  )
}
