const CAT_LABELS = {
  language:  'Languages',
  framework: 'Frameworks & Libraries',
  database:  'Databases',
  cloud:     'Cloud & DevOps',
  ml:        'ML / Data Science',
  tool:      'Tools',
  soft:      'Soft Skills',
}

export default function SkillsPanel({ skills = [] }) {
  if (!skills.length) return (
    <p style={{ color: 'var(--muted)', fontSize: '.875rem', textAlign: 'center', padding: '24px 0' }}>
      No skills detected. Add a clear "Technical Skills" section to your resume.
    </p>
  )

  // Group by category
  const grouped = skills.reduce((acc, s) => {
    const c = s.category || 'tool'
    if (!acc[c]) acc[c] = []
    acc[c].push(s)
    return acc
  }, {})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat}>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 10px' }}>
            {CAT_LABELS[cat] || cat} ({items.length})
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {items.map(s => (
              <span key={s.name} className={`chip chip-${s.category}`}>{s.name}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
