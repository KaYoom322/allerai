import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

export default function HomePage() {
  const nav = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const user = auth.currentUser
      if (!user) return
      const snap = await getDoc(doc(db, 'users', user.uid))
      if (snap.exists()) setProfile(snap.data())
      setLoading(false)
    }
    load()
  }, [])

  async function handleSignOut() {
    await signOut(auth)
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh' }}>
      <div className="big-spinner" />
    </div>
  )

  return (
    <div className="page">
      <div className="glow-orb" style={{ width:300, height:300, background:'rgba(61,255,122,0.05)', top:'-60px', right:'-60px' }} />

      <div className="page-inner fade-up" style={{ position:'relative', zIndex:1 }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:32 }}>
          <div className="brand" style={{ fontSize:24 }}>Aller<span>AI</span></div>
          <button className="btn btn-ghost" style={{ width:'auto', padding:'8px 14px', fontSize:13 }} onClick={handleSignOut}>
            Sign Out
          </button>
        </div>

        {/* Greeting */}
        <div style={{ marginBottom:24 }}>
          <p style={{ color:'var(--text-muted)', fontSize:13, marginBottom:4 }}>Welcome back 👋</p>
          <p className="section-title">Your Profile</p>
        </div>

        {/* Profile card */}
        <div className="card" style={{ marginBottom:20 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            <div>
              <p style={{ fontSize:11, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>Email</p>
              <p style={{ fontSize:14 }}>{profile?.email || '—'}</p>
            </div>

            <div style={{ height:1, background:'var(--border)' }} />

            <div>
              <p style={{ fontSize:11, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>Phone Number</p>
              <p style={{ fontSize:14 }}>{profile?.phone || '—'}</p>
            </div>

            <div style={{ height:1, background:'var(--border)' }} />

            <div>
              <p style={{ fontSize:11, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>My Allergens</p>
              {profile?.allergies?.length > 0 ? (
                <div style={{ display:'flex', flexWrap:'wrap' }}>
                  {profile.allergies.map(a => (
                    <span key={a} className="tag tag-red" style={{ margin:'3px' }}>{a}</span>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize:13, color:'var(--text-dim)' }}>No allergens set — edit your profile to add some.</p>
              )}
            </div>
          </div>
        </div>

        {/* Camera CTA */}
        <div style={{
          background:'linear-gradient(135deg, #0d1f12, #112619)',
          border:'1px solid rgba(61,255,122,0.2)',
          borderRadius:'var(--radius)',
          padding:'28px 24px',
          textAlign:'center',
          marginBottom:16,
          cursor:'pointer',
        }} onClick={() => nav('/camera')}>
          <div style={{ fontSize:48, marginBottom:12 }}>📸</div>
          <p style={{ fontFamily:'Syne', fontWeight:700, fontSize:18, letterSpacing:'-0.02em', marginBottom:6 }}>
            Scan a Food Label
          </p>
          <p style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.5, marginBottom:20 }}>
            Point your camera at the back of any Korean packaged food to check for your allergens instantly.
          </p>
          <button className="btn btn-primary">
            Open Camera →
          </button>
        </div>

        <p style={{ textAlign:'center', fontSize:12, color:'var(--text-dim)' }}>
          🇰🇷 Optimized for Korean packaged food labels
        </p>
      </div>
    </div>
  )
}
