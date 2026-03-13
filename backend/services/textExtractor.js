// backend/services/textExtractor.js
const pdfParse = require('pdf-parse')
const mammoth  = require('mammoth')

/**
 * Extract plain text from a PDF buffer.
 */
async function extractFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer, { max: 15 })
    if (!data.text || data.text.trim().length < 30) {
      throw new Error(
        'This PDF appears to be image-based (scanned). ' +
        'Please upload a text-based PDF or convert it to DOCX first.'
      )
    }
    return data.text
  } catch (err) {
    if (err.message.includes('image-based')) throw err
    throw new Error(`PDF extraction failed: ${err.message}`)
  }
}

/**
 * Extract plain text from a DOCX buffer.
 */
async function extractFromDOCX(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer })
    return result.value || ''
  } catch (err) {
    throw new Error(`DOCX extraction failed: ${err.message}`)
  }
}

/**
 * Auto-detect file type and extract text.
 * @param {Buffer} buffer
 * @param {string} mimetype
 * @returns {Promise<string>}
 */
async function extractText(buffer, mimetype) {
  const isPDF  = mimetype === 'application/pdf'
  const isDOCX = mimetype.includes('wordprocessingml') || mimetype.includes('msword')

  let raw = ''
  if (isPDF)       raw = await extractFromPDF(buffer)
  else if (isDOCX) raw = await extractFromDOCX(buffer)
  else throw new Error(`Unsupported file type: ${mimetype}`)

  return cleanText(raw)
}

/**
 * Normalise extracted text.
 */
function cleanText(text) {
  return text
    .replace(/\0/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/ {3,}/g, '  ')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim()
}

module.exports = { extractText }
