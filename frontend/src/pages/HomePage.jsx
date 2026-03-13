import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'

const FEATURES = [
  { icon: '📄', title: 'PDF & DOCX Support',     desc: 'Upload any resume format. Text extracted server-side using battle-tested parsers.' },
  { icon: '🧠', title: '100+ Skills Detected',    desc: 'NLP keyword engine identifies languages, frameworks, databases, cloud, and soft skills.' },
  { icon: '📊', title: 'ATS Score (0–100)',        desc: 'Know exactly how applicant tracking systems score your resume before you apply.' },
  { icon: '🎯', title: 'Prioritised Suggestions', desc: 'High / medium / low improvements ranked by impact — not generic advice.' },
]

const STEPS = [
  { n: '01', title: 'Upload',  desc: 'Drag & drop your PDF or DOCX. Max 5 MB.' },
  { n: '02', title: 'Analyze', desc: 'Express API extracts text and runs NLP analysis in seconds.' },
  { n: '03', title: 'Improve', desc: 'Get your ATS score, skill map, and ranked action items.' },
]

const STATS = [
  { v: '100+', l: 'Skills Detected' },
  { v: '<3s',  l: 'Analysis Time'   },
  { v: '0$',   l: 'Cost to Use'     },
  { v: '4',    l: 'Score Categories'},
]

export default function HomePage() {
  const blobRef = useRef(null)

  useEffect(() => {
    let raf
    let t = 0
    const animate = () => {
      t += 0.003
      if (blobRef.current) {
        blobRef.current.style.transform =
          `translate(${Math.sin(t) * 30}px, ${Math.cos(t * 0.7) * 20}px)`
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <main style={{ paddingTop: 60 }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="grid-bg" style={{ position: 'relative', overflow: 'hidden', minHeight: '92vh', display: 'flex', alignItems: 'center' }}>

        {/* Ambient blob */}
        <div ref={blobRef} style={{
          position: 'absolute', width: 600, height: 600,
          borderRadius: '50%', top: '5%', right: '-10%',
          background: 'radial-gradient(circle, rgba(110,231,183,0.07) 0%, transparent 70%)',
          pointerEvents: 'none', transition: 'transform .1s linear',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400,
          borderRadius: '50%', bottom: '10%', left: '-5%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', position: 'relative' }}>
          {/* Badge */}
          <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, border: '1px solid rgba(110,231,183,.3)', background: 'rgba(110,231,183,.05)', marginBottom: 32 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse-ring 2s infinite' }} />
            <span style={{ fontSize: '.75rem', fontFamily: 'JetBrains Mono', color: 'var(--accent)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
              Fullstack · Node.js + React
            </span>
          </div>

          {/* Headline */}
          <h1 className="fade-up-d1" style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', lineHeight: 1.05, margin: '0 0 24px', color: 'var(--text)', letterSpacing: '-.02em' }}>
            Beat the ATS.<br />
            <span style={{ color: 'var(--accent)', display: 'inline-block' }}>Land more interviews.</span>
          </h1>

          <p className="fade-up-d2" style={{ fontSize: '1.15rem', color: 'var(--muted)', maxWidth: 520, lineHeight: 1.7, marginBottom: 40 }}>
            Upload your resume and get an instant ATS score, 100+ skill detection, and
            prioritised improvements — powered by a real Node.js backend.
          </p>

          <div className="fade-up-d3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/upload" className="btn-primary">
              Analyze My Resume
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a href="#how" className="btn-ghost">See how it works</a>
          </div>

          {/* Mini stats row */}
          <div className="fade-up-d4" style={{ display: 'flex', gap: 32, marginTop: 56, flexWrap: 'wrap' }}>
            {STATS.map(s => (
              <div key={s.l}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent)' }}>{s.v}</div>
                <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="how" style={{ padding: '100px 24px', background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '.75rem', color: 'var(--accent)', letterSpacing: '.15em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>How it works</p>
          <h2 style={{ fontWeight: 700, fontSize: 'clamp(1.8rem,4vw,2.8rem)', textAlign: 'center', margin: '0 0 64px', color: 'var(--text)' }}>Three steps to a better resume</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {STEPS.map((s, i) => (
              <div key={s.n} className="card" style={{ padding: 32, position: 'relative' }}>
                <span style={{ position: 'absolute', top: 16, right: 20, fontFamily: 'JetBrains Mono', fontSize: '4rem', fontWeight: 700, color: 'var(--border2)', lineHeight: 1, userSelect: 'none' }}>{s.n}</span>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(110,231,183,.1)', border: '1px solid rgba(110,231,183,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '.85rem', color: 'var(--accent)', fontWeight: 600 }}>{s.n}</span>
                </div>
                <h3 style={{ fontWeight: 600, fontSize: '1.15rem', color: 'var(--text)', margin: '0 0 10px' }}>{s.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '.9rem', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontWeight: 700, fontSize: 'clamp(1.8rem,4vw,2.8rem)', textAlign: 'center', margin: '0 0 64px', color: 'var(--text)' }}>Everything packed in</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card" style={{ padding: 28 }}>
                <div style={{ fontSize: '2rem', marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text)', margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '.875rem', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK CALLOUT ────────────────────────────────────── */}
      <section style={{ padding: '0 24px 100px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 40, borderRadius: 20, border: '1px solid var(--border2)', background: 'var(--bg2)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '.72rem', color: 'var(--accent)', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 16 }}>Tech Stack</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
            {['React 18', 'Vite', 'TailwindCSS', 'Node.js', 'Express', 'Multer', 'pdf-parse', 'mammoth', 'natural NLP'].map(t => (
              <span key={t} className="chip chip-framework">{t}</span>
            ))}
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '.875rem', marginBottom: 24 }}>
            Frontend on <strong style={{ color: 'var(--text)' }}>Vercel</strong> · Backend on <strong style={{ color: 'var(--text)' }}>Render</strong> · 100% free tier · No database · No auth
          </p>
          <Link to="/upload" className="btn-primary" style={{ display: 'inline-flex' }}>Try it now — free</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px', textAlign: 'center', color: 'var(--muted)', fontSize: '.8rem' }}>
        ResumeAI · React + Node.js · Deployed on Vercel & Render · Open Source
      </footer>
    </main>
  )
}
