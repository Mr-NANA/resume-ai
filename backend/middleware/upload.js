// backend/middleware/upload.js
const multer = require('multer')

const ALLOWED_MIMES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
]

const MAX_SIZE_MB = 5

// Store file in memory (no disk I/O — good for serverless/Render)
const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      const err = new Error('Only PDF and DOCX files are accepted.')
      err.status = 400
      cb(err, false)
    }
  },
})

module.exports = upload
