import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const nav = useNavigate()

  return (
    <div className="page" style={{ justifyContent: 'center', minHeight: '100dvh' }}>
      {/* Background glow orbs */}
      <div className="glow-orb" style={{ width:320, height:320, background:'rgba(61,255,122,0.06)', top:'-80px', right:'-80px' }} />
      <div className="glow-orb" style={{ width:200, height:200, background:'rgba(61,255,122,0.04)', bottom:'120px', left:'-60px' }} />

      <div className="page-inner fade-up" style={{ position:'relative', zIndex:1 }}>

        {/* Logo area */}
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ fontSize:52, marginBottom:16 }}>🌿</div>
          <div className="brand" style={{ fontSize:40, marginBottom:12 }}>
            Aller<span>AI</span>
          </div>
          <p style={{ color:'var(--text-muted)', fontSize:15, lineHeight:1.6, maxWidth:300, margin:'0 auto' }}>
            Scan Korean food labels in seconds.<br />
            Know if it's safe — instantly.
          </p>
        </div>

        {/* Feature pills */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center', marginBottom:48 }}>
          {['📸 OCR Scanning','🔍 Allergy Detection','🛡️ Safe Alternatives','🌍 Made for Travelers'].map(f => (
            <span key={f} style={{
              background:'var(--surface)',
              border:'1px solid var(--border)',
              borderRadius:99,
              padding:'6px 14px',
              fontSize:12,
              color:'var(--text-muted)'
            }}>{f}</span>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <button className="btn btn-primary" onClick={() => nav('/signup')}>
            Get Started — It's Free
          </button>
          <button className="btn btn-ghost" onClick={() => nav('/login')}>
            Sign In
          </button>
        </div>

        <p style={{ textAlign:'center', marginTop:24, fontSize:12, color:'var(--text-dim)' }}>
          Designed for travelers with food allergies
        </p>
      </div>
    </div>
  )
}
