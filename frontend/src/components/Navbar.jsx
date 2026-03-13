import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      borderBottom: '1px solid var(--border)',
      background: 'rgba(10,10,15,0.85)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M3 2h9a1 1 0 011 1v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" fill="#0a0a0f" />
              <path d="M4.5 5h6M4.5 7.5h6M4.5 10h4" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', fontFamily: 'DM Sans' }}>
            Resume<span style={{ color: 'var(--accent)' }}>AI</span>
          </span>
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/" style={{
            padding: '6px 14px', borderRadius: 8, fontSize: '.875rem',
            color: pathname === '/' ? 'var(--accent)' : 'var(--muted)',
            textDecoration: 'none', fontWeight: 500,
            transition: 'color .2s',
          }}>Home</Link>

          <Link to="/upload" style={{
            padding: '8px 20px', borderRadius: 10,
            background: 'var(--accent)', color: '#0a0a0f',
            textDecoration: 'none', fontWeight: 600, fontSize: '.875rem',
            transition: 'background .2s, transform .15s',
          }}
            onMouseEnter={e => e.target.style.background = '#a7f3d0'}
            onMouseLeave={e => e.target.style.background = 'var(--accent)'}
          >
            Analyze Resume
          </Link>
        </div>
      </div>
    </nav>
  )
}
