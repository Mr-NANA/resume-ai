const PRI = {
  high:   { border: 'rgba(248,113,113,.25)', bg: 'rgba(248,113,113,.06)', dot: '#f87171',  badge: 'rgba(248,113,113,.15)', badgeText: '#f87171',  label: 'High'   },
  medium: { border: 'rgba(251,191,36,.25)',  bg: 'rgba(251,191,36,.05)',  dot: '#fbbf24',  badge: 'rgba(251,191,36,.15)',  badgeText: '#fbbf24',  label: 'Medium' },
  low:    { border: 'rgba(107,114,128,.2)',  bg: 'rgba(107,114,128,.04)', dot: '#6b7280',  badge: 'rgba(107,114,128,.15)', badgeText: '#94a3b8',  label: 'Low'    },
}

export default function SuggestionsList({ suggestions = [] }) {
  if (!suggestions.length) return (
    <p style={{ color: 'var(--muted)', fontSize: '.875rem', textAlign: 'center', padding: '24px 0' }}>
      🎉 Your resume looks solid — no major issues found!
    </p>
  )

  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {suggestions.map((s, i) => {
        const p = PRI[s.priority] || PRI.low
        return (
          <li key={i} style={{
            display: 'flex', gap: 14, padding: '16px 18px',
            borderRadius: 12, border: `1px solid ${p.border}`,
            background: p.bg, alignItems: 'flex-start',
            transition: 'transform .15s, box-shadow .15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.3)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
          >
            {/* Number badge */}
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--bg3)', border: '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'JetBrains Mono', fontSize: '.7rem', color: 'var(--muted)' }}>
              {i + 1}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: s.detail ? 6 : 0 }}>
                <p style={{ margin: 0, fontWeight: 500, fontSize: '.9rem', color: 'var(--text)', lineHeight: 1.5 }}>{s.text}</p>
                <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 10px', borderRadius: 999, background: p.badge, color: p.badgeText, fontSize: '.7rem', fontFamily: 'JetBrains Mono', fontWeight: 500 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.dot }} />
                  {p.label}
                </span>
              </div>
              {s.detail && (
                <p style={{ margin: 0, fontSize: '.8rem', color: 'var(--muted)', lineHeight: 1.6 }}>{s.detail}</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
