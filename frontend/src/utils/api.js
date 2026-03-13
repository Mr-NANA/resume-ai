// src/utils/api.js
import axios from 'axios'

// In production (Vercel), set VITE_API_URL to your Render backend URL.
// In dev, Vite proxy forwards /api → localhost:5000 automatically.
const BASE_URL = import.meta.env.VITE_API_URL || ''

const client = axios.create({ baseURL: BASE_URL, timeout: 60000 })

/**
 * Upload a resume file for analysis.
 * @param {File} file
 * @param {(pct: number) => void} onProgress
 * @returns {Promise<object>} analysis result
 */
export async function analyzeResume(file, onProgress) {
  const form = new FormData()
  form.append('resume', file)

  const { data } = await client.post('/api/analyze', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    },
  })

  if (!data.success) throw new Error(data.error || 'Analysis failed')
  return data.data
}
