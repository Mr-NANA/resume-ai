import { useEffect, useRef } from 'react'

export default function ScoreRing({ score = 0, size = 190 }) {
  const r    = 72
  const circ = 2 * Math.PI * r
  const ref  = useRef(null)

  const color =
    score >= 75 ? '#6ee7b7' :
    score >= 50 ? '#fbbf24' :
    '#f87171'

  const label =
    score >= 75 ? 'Excellent' :
    score >= 60 ? 'Good' :
    score >= 40 ? 'Average' :
    'Needs Work'

  useEffect(() => {
    if (!ref.current) return
    // Animate from full offset → target offset
    const target = circ - (score / 100) * circ
    ref.current.style.strokeDashoffset = circ  // start
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (ref.current) ref.current.style.strokeDashoffset = target
      })
    })
  }, [score, circ])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: 'visible' }}>
        {/* Shadow glow */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="12" />

        {/* Progress arc */}
        <circle
          ref={ref}
          cx="80" cy="80" r={r}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ}
          transform="rotate(-90 80 80)"
          style={{
            transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)',
            filter: `drop-shadow(0 0 6px ${color}90)`,
          }}
        />

        {/* Score number */}
        <text x="80" y="74" textAnchor="middle" dominantBaseline="middle"
          fill={color} fontSize="34" fontWeight="700" fontFamily="DM Sans, sans-serif">
          {score}
        </text>
        <text x="80" y="96" textAnchor="middle" dominantBaseline="middle"
          fill="rgba(255,255,255,.3)" fontSize="11" fontFamily="JetBrains Mono, monospace">
          / 100
        </text>
      </svg>
      <span style={{ fontFamily: 'JetBrains Mono', fontSize: '.72rem', letterSpacing: '.12em', textTransform: 'uppercase', color }}>
        {label}
      </span>
    </div>
  )
}
