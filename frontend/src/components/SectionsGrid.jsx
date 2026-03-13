const SECTION_META = [
  { key: 'summary',         label: 'Summary',         icon: '👤' },
  { key: 'experience',      label: 'Experience',       icon: '💼' },
  { key: 'education',       label: 'Education',        icon: '🎓' },
  { key: 'skills',          label: 'Skills',           icon: '⚡' },
  { key: 'projects',        label: 'Projects',         icon: '🚀' },
  { key: 'certifications',  label: 'Certifications',   icon: '🏅' },
  { key: 'achievements',    label: 'Achievements',     icon: '🏆' },
]

export default function SectionsGrid({ sections = {} }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
      {SECTION_META.map(s => {
        const found = sections[s.key]
        return (
          <div key={s.key} style={{
            padding: '12px 14px', borderRadius: 10,
            border: `1px solid ${found ? 'rgba(110,231,183,.25)' : 'var(--border)'}`,
            background: found ? 'rgba(110,231,183,.06)' : 'var(--bg3)',
            display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all .2s',
          }}>
            <span style={{ fontSize: '1rem' }}>{s.icon}</span>
            <div>
              <p style={{ margin: 0, fontSize: '.78rem', fontWeight: 500, color: found ? 'var(--accent)' : 'var(--muted)' }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: '.68rem', fontFamily: 'JetBrains Mono', color: found ? 'rgba(110,231,183,.6)' : 'var(--border2)' }}>
                {found ? '✓ detected' : '✗ missing'}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
