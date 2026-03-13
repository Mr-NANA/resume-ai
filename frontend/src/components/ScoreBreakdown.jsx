const BARS = [
  { key: 'skillsScore',     label: 'Technical Skills',  max: 40, color: '#6ee7b7' },
  { key: 'experienceScore', label: 'Experience Section', max: 20, color: '#7dd3fc' },
  { key: 'educationScore',  label: 'Education Section',  max: 20, color: '#c4b5fd' },
  { key: 'projectsScore',   label: 'Projects Section',   max: 20, color: '#fbbf24' },
]

export default function ScoreBreakdown({ breakdown = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {BARS.map(b => {
        const earned = breakdown[b.key] ?? 0
        const pct    = Math.round((earned / b.max) * 100)
        return (
          <div key={b.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '.825rem', color: 'var(--muted)' }}>{b.label}</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '.75rem', color: b.color }}>
                {earned}/{b.max}
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 999, background: 'var(--border2)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 999,
                background: b.color,
                width: `${pct}%`,
                transition: 'width 1s cubic-bezier(.4,0,.2,1) .3s',
                boxShadow: `0 0 8px ${b.color}60`,
              }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
