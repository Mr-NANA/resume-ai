import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import ScoreRing       from '../components/ScoreRing.jsx'
import ScoreBreakdown  from '../components/ScoreBreakdown.jsx'
import SkillsPanel     from '../components/SkillsPanel.jsx'
import SuggestionsList from '../components/SuggestionsList.jsx'
import SectionsGrid    from '../components/SectionsGrid.jsx'

/* ── Tiny stat card ─────────────────────────────────────────────── */
function StatCard({ value, label, color = 'var(--accent)' }) {
  return (
    <div style={{ padding: '18px 20px', borderRadius: 14, border: '1px solid var(--border)', background: 'var(--bg3)', textAlign: 'center' }}>
      <div style={{ fontWeight: 700, fontSize: '1.7rem', color, fontFamily: 'DM Sans' }}>{value}</div>
      <div style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: 3 }}>{label}</div>
    </div>
  )
}

/* ── Section wrapper ─────────────────────────────────────────────── */
function Panel({ title, badge, children, delay = 0 }) {
  return (
    <div className="card fade-up" style={{ padding: 28, animationDelay: `${delay}s` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: '.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.12em', margin: 0 }}>{title}</p>
        {badge && (
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '.7rem', color: 'var(--accent)', background: 'rgba(110,231,183,.1)', border: '1px solid rgba(110,231,183,.2)', padding: '2px 10px', borderRadius: 999 }}>{badge}</span>
        )}
      </div>
      {children}
    </div>
  )
}

export default function ResultPage() {
  const { state }  = useLocation()
  const navigate   = useNavigate()
  const result     = state?.result

  // Redirect if no result (e.g. direct URL access)
  useEffect(() => {
    if (!result) navigate('/upload', { replace: true })
  }, [result, navigate])

  if (!result) return null

  const {
    fileName        = 'Resume',
    atsScore        = 0,
    scoreBreakdown  = {},
    skillsDetected  = [],
    sections        = {},
    suggestions     = [],
    keywordDensity  = 0,
    stats           = {},
    analyzedAt,
  } = result

  const highCount   = suggestions.filter(s => s.priority === 'high').length
  const medCount    = suggestions.filter(s => s.priority === 'medium').length
  const sectFound   = Object.values(sections).filter(Boolean).length

  const dateStr = analyzedAt
    ? new Date(analyzedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Just now'

  return (
    <main style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* ── Page header ─────────────────────────────────── */}
        <div className="fade-up" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 36 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '.7rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.12em' }}>Analysis Complete</span>
            </div>
            <h1 style={{ fontWeight: 700, fontSize: '2rem', margin: '0 0 6px', color: 'var(--text)' }}>Resume Report</h1>
            <p style={{ color: 'var(--muted)', fontSize: '.85rem', margin: 0 }}>{fileName} · {dateStr}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/upload" className="btn-ghost" style={{ fontSize: '.85rem', padding: '9px 18px' }}>
              ↑ Analyze another
            </Link>
            <button
              className="btn-ghost"
              style={{ fontSize: '.85rem', padding: '9px 18px' }}
              onClick={() => {
                const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
                const url  = URL.createObjectURL(blob)
                const a    = document.createElement('a')
                a.href = url; a.download = 'resume-analysis.json'; a.click()
                URL.revokeObjectURL(url)
              }}
            >
              ↓ Export JSON
            </button>
          </div>
        </div>

        {/* ── Quick stats row ─────────────────────────────── */}
        <div className="fade-up-d1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 28 }}>
          <StatCard value={atsScore}               label="ATS Score"      color={atsScore >= 75 ? '#6ee7b7' : atsScore >= 50 ? '#fbbf24' : '#f87171'} />
          <StatCard value={skillsDetected.length}  label="Skills Found"   color="#7dd3fc" />
          <StatCard value={suggestions.length}     label="Suggestions"    color="#c4b5fd" />
          <StatCard value={`${highCount}`}          label="High Priority"  color="#f87171" />
          <StatCard value={`${sectFound}/7`}        label="Sections Found" color="#fbbf24" />
          <StatCard value={`${keywordDensity}%`}    label="Keyword Density" color="#34d399" />
        </div>

        {/* ── Main grid ───────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: 20, alignItems: 'start' }}>

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Score ring */}
            <Panel title="ATS Score" delay={0.1}>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 16px' }}>
                <ScoreRing score={atsScore} size={200} />
              </div>
              <p style={{ textAlign: 'center', fontSize: '.78rem', color: 'var(--muted)', fontFamily: 'JetBrains Mono', margin: 0 }}>
                {atsScore >= 75
                  ? '✓ Likely to pass most ATS filters'
                  : atsScore >= 50
                  ? '⚠ May be filtered by stricter ATS'
                  : '✗ Likely filtered before human review'
                }
              </p>
            </Panel>

            {/* Breakdown bars */}
            <Panel title="Score Breakdown" delay={0.15}>
              <ScoreBreakdown breakdown={scoreBreakdown} />
            </Panel>

            {/* Word count */}
            <Panel title="Document Stats" delay={0.2}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Word count',       value: stats.wordCount ?? '—' },
                  { label: 'Lines',             value: stats.lineCount ?? '—' },
                  { label: 'Keyword density',   value: `${keywordDensity}%`   },
                  { label: 'Skills detected',   value: skillsDetected.length  },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '.825rem', color: 'var(--muted)' }}>{r.label}</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '.825rem', color: 'var(--text)' }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Sections detected */}
            <Panel title="Resume Sections" badge={`${sectFound} of 7 found`} delay={0.15}>
              <SectionsGrid sections={sections} />
            </Panel>

            {/* Skills */}
            <Panel title="Detected Skills" badge={`${skillsDetected.length} found`} delay={0.2}>
              <SkillsPanel skills={skillsDetected} />
            </Panel>

            {/* Suggestions */}
            <Panel
              title="Improvement Suggestions"
              badge={highCount > 0 ? `${highCount} high priority` : `${suggestions.length} total`}
              delay={0.25}
            >
              <SuggestionsList suggestions={suggestions} />
            </Panel>
          </div>
        </div>

        {/* ── Bottom CTA ──────────────────────────────────── */}
        <div className="fade-up" style={{ marginTop: 48, padding: 36, borderRadius: 20, border: '1px solid var(--border2)', background: 'var(--bg2)', textAlign: 'center' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.4rem', margin: '0 0 10px', color: 'var(--text)' }}>
            {atsScore >= 75
              ? '🎉 Great score! Now tailor it for each job posting.'
              : `Fix the ${highCount} high-priority issues to boost your score significantly.`
            }
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '.9rem', margin: '0 0 24px' }}>
            Each high-priority fix can add 10–20 points to your ATS score.
          </p>
          <Link to="/upload" className="btn-primary" style={{ display: 'inline-flex' }}>
            Re-analyze Updated Resume
          </Link>
        </div>
      </div>
    </main>
  )
}
