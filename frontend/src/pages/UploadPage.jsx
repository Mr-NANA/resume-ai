import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { analyzeResume } from '../utils/api.js'

const STAGES = [
  'Uploading file to server…',
  'Extracting text from document…',
  'Running NLP skill analysis…',
  'Calculating ATS score…',
  'Generating suggestions…',
  'Done!',
]

export default function UploadPage() {
  const navigate = useNavigate()
  const [file, setFile]         = useState(null)
  const [busy, setBusy]         = useState(false)
  const [stage, setStage]       = useState(0)
  const [uploadPct, setUploadPct] = useState(0)
  const [error, setError]       = useState(null)

  /* ── Dropzone ─────────────────────────────────────────────── */
  const onDrop = useCallback((accepted, rejected) => {
    setError(null)
    if (rejected.length) {
      const code = rejected[0].errors[0]?.code
      setError(
        code === 'file-too-large'    ? 'File exceeds 5 MB limit.' :
        code === 'file-invalid-type' ? 'Only PDF and DOCX files are accepted.' :
        'Invalid file. Please try again.'
      )
      return
    }
    if (accepted.length) setFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: busy,
  })

  /* ── Submit ───────────────────────────────────────────────── */
  async function handleSubmit() {
    if (!file || busy) return
    setError(null)
    setBusy(true)
    setStage(0)
    setUploadPct(0)

    // Advance fake stages while upload + analysis runs
    const stageTimer = (i, delay) =>
      setTimeout(() => setStage(i), delay)
    stageTimer(1, 800)
    stageTimer(2, 1800)
    stageTimer(3, 2800)
    stageTimer(4, 3600)

    try {
      const result = await analyzeResume(file, pct => setUploadPct(pct))
      setStage(5)
      setTimeout(() => navigate('/result', { state: { result } }), 500)
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Analysis failed. Please try again.')
      setBusy(false)
      setStage(0)
    }
  }

  /* ── UI ───────────────────────────────────────────────────── */
  const dropBorder =
    isDragReject  ? '#f87171' :
    isDragActive  ? 'var(--accent)' :
    file          ? 'rgba(110,231,183,.5)' :
    'var(--border2)'

  const dropBg =
    isDragReject  ? 'rgba(248,113,113,.05)' :
    isDragActive  ? 'rgba(110,231,183,.05)' :
    file          ? 'rgba(110,231,183,.03)' :
    'var(--bg2)'

  return (
    <main style={{ paddingTop: 60, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="grid-bg" style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: .4 }} />
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(110,231,183,.04) 0%, transparent 70%)', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 580, padding: '40px 24px' }}>

        {/* Header */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '.72rem', color: 'var(--accent)', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 12 }}>Step 1 of 1</p>
          <h1 style={{ fontWeight: 700, fontSize: '2.2rem', margin: '0 0 12px', color: 'var(--text)' }}>Upload Your Resume</h1>
          <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>PDF or DOCX · Max 5 MB · Processed server-side</p>
        </div>

        {/* ── Dropzone ─────────────────────────────────── */}
        {!busy && (
          <div className="fade-up-d1">
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${dropBorder}`,
                borderRadius: 16,
                background: dropBg,
                padding: '52px 32px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color .2s, background .2s',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <input {...getInputProps()} />

              {/* Scan line while dragging */}
              {isDragActive && !isDragReject && (
                <div className="scan-wrap" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <div className="scan-line" />
                </div>
              )}

              {file ? (
                /* File selected state */
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(110,231,183,.12)', border: '1px solid rgba(110,231,183,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
                    📄
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text)', margin: '0 0 4px' }}>{file.name}</p>
                    <p style={{ color: 'var(--muted)', fontSize: '.825rem', margin: 0 }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type.includes('pdf') ? 'PDF' : 'DOCX'}
                    </p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setFile(null) }}
                    style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '.8rem', cursor: 'pointer', padding: '4px 8px' }}
                  >
                    ✕ Remove
                  </button>
                </div>
              ) : (
                /* Empty state */
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, border: `1px solid ${isDragActive ? 'rgba(110,231,183,.4)' : 'var(--border2)'}`, background: isDragActive ? 'rgba(110,231,183,.08)' : 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isDragActive ? 'var(--accent)' : 'var(--muted)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--text)', margin: '0 0 6px', fontSize: '1rem' }}>
                      {isDragActive ? 'Drop it here!' : 'Drag & drop your resume'}
                    </p>
                    <p style={{ color: 'var(--muted)', fontSize: '.85rem', margin: 0 }}>
                      or <span style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: 3 }}>browse files</span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['PDF', 'DOCX'].map(t => (
                      <span key={t} className="chip chip-framework">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(248,113,113,.3)', background: 'rgba(248,113,113,.06)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1rem', marginTop: 1 }}>⚠️</span>
                <p style={{ color: 'var(--danger)', fontSize: '.875rem', margin: 0, lineHeight: 1.5 }}>{error}</p>
              </div>
            )}

            {/* Analyze button */}
            <button
              onClick={handleSubmit}
              disabled={!file}
              className="btn-primary"
              style={{ width: '100%', marginTop: 20, justifyContent: 'center', padding: '14px' }}
            >
              Analyze Resume →
            </button>

            <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '.78rem', marginTop: 14 }}>
              🔒 File processed server-side and never stored permanently
            </p>
          </div>
        )}

        {/* ── Progress panel ────────────────────────────── */}
        {busy && (
          <div className="card fade-in" style={{ padding: 36 }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: '.95rem' }}>Analyzing your resume…</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '.85rem', color: 'var(--accent)' }}>
                  {stage === 0 ? `${uploadPct}%` : `${Math.round((stage / (STAGES.length - 1)) * 100)}%`}
                </span>
              </div>
              {/* Progress bar */}
              <div style={{ height: 6, borderRadius: 999, background: 'var(--border2)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 999,
                  background: 'linear-gradient(90deg, var(--accent), #34d399)',
                  width: `${stage === 0 ? uploadPct : Math.round((stage / (STAGES.length - 1)) * 100)}%`,
                  transition: 'width .5s ease',
                  boxShadow: '0 0 10px rgba(110,231,183,.4)',
                }} />
              </div>
            </div>

            {/* Stage list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {STAGES.slice(0, -1).map((s, i) => {
                const done    = i < stage
                const active  = i === stage
                const pending = i > stage
                return (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: pending ? .3 : 1, transition: 'opacity .3s' }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: done ? 'var(--accent)' : 'transparent',
                      border: done ? 'none' : `2px solid ${active ? 'var(--accent)' : 'var(--border2)'}`,
                      transition: 'all .3s',
                    }}>
                      {done  && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse-ring 1.5s infinite' }} />}
                    </div>
                    <span style={{ fontSize: '.875rem', color: active ? 'var(--text)' : 'var(--muted)', fontWeight: active ? 500 : 400 }}>
                      {s}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
