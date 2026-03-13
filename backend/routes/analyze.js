// backend/routes/analyze.js
const express  = require('express')
const { v4: uuidv4 } = require('uuid')
const upload   = require('../middleware/upload')
const { extractText }   = require('../services/textExtractor')
const { analyzeResume } = require('../services/resumeAnalyzer')

const router = express.Router()

/**
 * POST /api/analyze
 * Accepts a PDF or DOCX file upload and returns full resume analysis.
 */
router.post('/analyze', upload.single('resume'), async (req, res, next) => {
  // Multer validation passes — req.file is guaranteed here
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded. Send a PDF or DOCX as multipart/form-data with key "resume".' })
  }

  const requestId = uuidv4().slice(0, 8)
  console.log(`[${requestId}] Analyzing: ${req.file.originalname} (${Math.round(req.file.size / 1024)} KB, ${req.file.mimetype})`)

  try {
    // 1. Extract text
    const text = await extractText(req.file.buffer, req.file.mimetype)
    console.log(`[${requestId}] Extracted ${text.length} chars`)

    // 2. Run analysis
    const result = analyzeResume(text, req.file.originalname)
    console.log(`[${requestId}] ATS Score: ${result.atsScore} | Skills: ${result.skillsDetected.length}`)

    // 3. Return result
    return res.json({
      success: true,
      requestId,
      data: result,
    })

  } catch (err) {
    console.error(`[${requestId}] Error:`, err.message)
    // Pass to global error handler
    next(err)
  }
})

/**
 * GET /api/skills
 * Returns the full list of detectable skills (useful for the frontend to display).
 */
router.get('/skills', (req, res) => {
  const { extractSkills } = require('../services/skillExtractor')
  // Return all skill names by passing a text that contains every keyword
  res.json({
    categories: ['language', 'framework', 'database', 'cloud', 'ml', 'tool', 'soft'],
    note: 'POST /api/analyze to detect skills from your resume',
  })
})

module.exports = router
