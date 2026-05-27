import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const ALLERGENS = [
  'Eggs','Milk','Buckwheat','Peanuts','Soybeans','Wheat',
  'Pine nuts','Walnuts','Crab','Shrimp','Squid','Mackerel',
  'Shellfish','Peach','Tomato','Chicken','Pork','Beef','Sulfites'
]

export default function SignupPage() {
  const nav = useNavigate()
  const [form, setForm]         = useState({ email:'', password:'', phone:'' })
  const [selected, setSelected] = useState([])
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  function toggleAllergen(a) {
    setSelected(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  }

  async function handleSignup() {
    setError('')
    if (!form.email || !form.password || !form.phone) {
      setError('Please fill in all required fields.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password)
      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', cred.user.uid), {
        email:     form.email,
        phone:     form.phone,
        allergies: selected,
        createdAt: new Date().toISOString(),
      })
      // App.jsx redirect handles navigation
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in.')
      } else if (e.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="glow-orb" style={{ width:260, height:260, background:'rgba(61,255,122,0.05)', top:0, left:'-60px' }} />

      <div className="page-inner fade-up" style={{ position:'relative', zIndex:1 }}>
        <button className="back-btn" onClick={() => nav('/')}>← Back</button>

        <div style={{ marginBottom:28 }}>
          <div className="brand" style={{ marginBottom:6 }}>Aller<span>AI</span></div>
          <p className="section-title">Create account</p>
          <p style={{ color:'var(--text-muted)', fontSize:14, marginTop:4 }}>Set up your allergy profile</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          <div className="input-group">
            <label>Email *</label>
            <input type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm(p=>({...p, email:e.target.value}))} />
          </div>
          <div className="input-group">
            <label>Password * (min. 6 characters)</label>
            <input type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm(p=>({...p, password:e.target.value}))} />
          </div>
          <div className="input-group" style={{ marginBottom:0 }}>
            <label>Phone Number *</label>
            <input type="tel" placeholder="+82 10 1234 5678"
              value={form.phone} onChange={e => setForm(p=>({...p, phone:e.target.value}))} />
          </div>
        </div>

        {/* Allergy selection */}
        <div style={{ marginTop:24 }}>
          <p style={{ fontSize:12, fontWeight:500, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>
            My Allergens
          </p>
          <p style={{ fontSize:13, color:'var(--text-dim)', marginBottom:12 }}>
            Select all that apply — you can update these later
          </p>

          <div className="allergy-grid">
            {ALLERGENS.map(a => (
              <label key={a} className={`allergy-item ${selected.includes(a) ? 'selected' : ''}`}>
                <input type="checkbox" checked={selected.includes(a)} onChange={() => toggleAllergen(a)} />
                <span className="allergy-check">{selected.includes(a) ? '✓' : ''}</span>
                {a}
              </label>
            ))}
          </div>

          {selected.length > 0 && (
            <p style={{ marginTop:10, fontSize:12, color:'var(--accent)' }}>
              ✓ {selected.length} allergen{selected.length > 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        <button className="btn btn-primary" style={{ marginTop:28 }} onClick={handleSignup} disabled={loading}>
          {loading ? <><span className="spinner" /> Creating account…</> : 'Create Account'}
        </button>

        <div className="divider">already have an account?</div>
        <button className="btn btn-ghost" onClick={() => nav('/login')}>Sign In</button>
      </div>
    </div>
  )
}
