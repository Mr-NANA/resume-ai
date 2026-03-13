require('dotenv').config()
const express    = require('express')
const cors       = require('cors')
const helmet     = require('helmet')
const rateLimit  = require('express-rate-limit')
const analyzeRouter = require('./routes/analyze')

const app  = express()
const PORT = process.env.PORT || 5000

// ── Security middleware ───────────────────────────────────────────
app.use(helmet())

// CORS — allow your Vercel frontend + localhost dev
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL, // set this on Render: https://your-app.vercel.app
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl) in development
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS: origin ${origin} not allowed`))
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}))

// Rate limiting — 30 requests per 15 min per IP
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many requests. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
}))

app.use(express.json())

// ── Routes ────────────────────────────────────────────────────────
app.use('/api', analyzeRouter)

// Health check — Render pings this to keep the service alive
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message)
  const status = err.status || 500
  res.status(status).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

app.listen(PORT, () => {
  console.log(`\n🚀 Resume AI backend running on http://localhost:${PORT}`)
  console.log(`   Health check: http://localhost:${PORT}/health`)
  console.log(`   Analyze API:  POST http://localhost:${PORT}/api/analyze\n`)
})
