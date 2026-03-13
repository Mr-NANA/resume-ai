// backend/services/resumeAnalyzer.js
const { extractSkills } = require('./skillExtractor')

// ── Section detection ─────────────────────────────────────────────
const SECTIONS = {
  experience:     [/work\s+experience|professional\s+experience|employment|career\s+history/i],
  education:      [/\beducation\b|academic|degree|university|college|bachelor|master|b\.?tech|m\.?tech|phd/i],
  projects:       [/\bprojects?\b|personal\s+project|portfolio|open[- ]source/i],
  skills:         [/\bskills?\b|technical\s+skills?|tech\s+stack|core\s+competencies/i],
  summary:        [/summary|objective|profile|about\s+me|professional\s+summary/i],
  certifications: [/certifications?|certificates?|credentials?/i],
  achievements:   [/achievements?|accomplishments?|awards?|honors?/i],
}

function detectSections(text) {
  const result = {}
  for (const [key, patterns] of Object.entries(SECTIONS)) {
    result[key] = patterns.some(re => re.test(text))
  }
  return result
}

// ── ATS score (0-100) ─────────────────────────────────────────────
function calcScore(skills, sections) {
  const skillsScore     = Math.min(40, Math.round((skills.length / 20) * 40))
  const experienceScore = sections.experience ? 20 : 0
  const educationScore  = sections.education  ? 20 : 0
  const projectsScore   = sections.projects   ? 20 : 0
  return {
    total:          skillsScore + experienceScore + educationScore + projectsScore,
    skillsScore,
    experienceScore,
    educationScore,
    projectsScore,
  }
}

// ── Keyword density ───────────────────────────────────────────────
function keywordDensity(text, skills) {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean)
  const skillWords = skills.flatMap(s => s.name.toLowerCase().split(/\s+/))
  const hits = skillWords.filter(w => words.includes(w)).length
  return words.length ? Math.round((hits / words.length) * 1000) / 10 : 0
}

// ── Suggestion generation ─────────────────────────────────────────
const QUANTIFIED_RE = [
  /\d+\s*%/,
  /\$[\d,.]+/,
  /\d+[x×]/i,
  /\b\d{2,}\s+(users?|clients?|customers?|engineers?|employees?)/i,
  /\b(increased|decreased|improved|reduced|optimised|optimized|saved)\b.*\d/i,
]

const WEAK_WORDS = ['responsible for', 'duties included', 'helped with', 'assisted in', 'worked on', 'involved in']
const ACTION_VERBS = ['Built', 'Designed', 'Led', 'Shipped', 'Optimised', 'Reduced', 'Launched', 'Deployed', 'Architected', 'Developed']

function generateSuggestions(text, skills, sections, score) {
  const suggestions = []
  const lower = text.toLowerCase()

  // ── HIGH priority ─────────────────────────────────────────────
  if (!sections.experience) suggestions.push({
    priority: 'high',
    icon: '🔴',
    text: 'Add a Work Experience section',
    detail: 'This is the #1 section ATS systems look for. Add a clear "Work Experience" or "Professional Experience" heading with your roles listed under it.',
  })

  if (!sections.education) suggestions.push({
    priority: 'high',
    icon: '🔴',
    text: 'Add an Education section',
    detail: 'Most job postings require degree verification. Add "Education" with your degree, institution, and graduation year.',
  })

  if (skills.length < 5) suggestions.push({
    priority: 'high',
    icon: '🔴',
    text: `Only ${skills.length} skills detected — add a dedicated Skills section`,
    detail: 'ATS systems scan for skill keywords from job descriptions. Create a "Technical Skills" section with all languages, frameworks, tools, and databases you know.',
  })

  if (!/[\w.+-]+@[\w-]+\.\w{2,}/i.test(text)) suggestions.push({
    priority: 'high',
    icon: '🔴',
    text: 'Add your email address',
    detail: 'Your email must appear in plain text (not in a DOCX header/footer) so ATS can extract it. Place it at the top of the resume.',
  })

  // ── MEDIUM priority ───────────────────────────────────────────
  if (!sections.projects) suggestions.push({
    priority: 'medium',
    icon: '🟡',
    text: 'Add a Projects section',
    detail: `List 2–3 projects with the tech stack used, your specific role, and measurable outcomes. Projects are critical for junior/mid-level roles.`,
  })

  if (!QUANTIFIED_RE.some(re => re.test(text))) suggestions.push({
    priority: 'medium',
    icon: '🟡',
    text: 'Add measurable achievements with numbers',
    detail: `Example: "Reduced API response time by 40%" or "Served 10,000+ daily active users." Numbers make bullet points 3× more compelling to recruiters.`,
  })

  if (!sections.summary) suggestions.push({
    priority: 'medium',
    icon: '🟡',
    text: 'Add a Professional Summary at the top',
    detail: '2–3 sentences summarising your experience, top skills, and career goal. This is the first thing both ATS and humans read.',
  })

  if (skills.length >= 5 && skills.length < 12) suggestions.push({
    priority: 'medium',
    icon: '🟡',
    text: `Expand skills list — ${skills.length} found, aim for 12–20`,
    detail: 'Include all technologies you have working knowledge of. Cover languages, frameworks, databases, cloud platforms, and testing tools.',
  })

  if (!/linkedin\.com\/in\//i.test(text)) suggestions.push({
    priority: 'medium',
    icon: '🟡',
    text: 'Add your LinkedIn profile URL',
    detail: 'Recruiters verify candidates on LinkedIn before reaching out. A complete LinkedIn profile with the URL on your resume significantly increases callbacks.',
  })

  // ── LOW priority ──────────────────────────────────────────────
  if (!/github\.com\//i.test(text)) suggestions.push({
    priority: 'low',
    icon: '🟢',
    text: 'Add your GitHub profile link',
    detail: 'For tech roles, a GitHub with active repos is strong evidence of real skills. Pin 2–3 relevant projects on your profile.',
  })

  if (!sections.certifications) suggestions.push({
    priority: 'low',
    icon: '🟢',
    text: 'Consider adding certifications',
    detail: 'AWS, Google Cloud, Meta, or Coursera certificates add credibility and help pass ATS keyword filters for those specific technologies.',
  })

  if (WEAK_WORDS.some(w => lower.includes(w))) suggestions.push({
    priority: 'low',
    icon: '🟢',
    text: 'Replace weak language with strong action verbs',
    detail: `Avoid "responsible for" or "helped with." Use: ${ACTION_VERBS.join(', ')}. Strong verbs increase ATS scores and recruiter impression.`,
  })

  if (!sections.achievements) suggestions.push({
    priority: 'low',
    icon: '🟢',
    text: 'Add an Achievements or Awards section',
    detail: 'Scholarships, hackathon wins, or recognition stand out to recruiters and add compelling proof of performance.',
  })

  // Sort high → medium → low
  const order = { high: 0, medium: 1, low: 2 }
  return suggestions.sort((a, b) => order[a.priority] - order[b.priority])
}

// ── Word count + reading time ─────────────────────────────────────
function textStats(text) {
  const words = text.split(/\s+/).filter(Boolean)
  const lines = text.split('\n').filter(l => l.trim())
  return { wordCount: words.length, lineCount: lines.length }
}

// ── Main entry point ──────────────────────────────────────────────
/**
 * Full analysis pipeline.
 * @param {string} text  Cleaned resume text
 * @param {string} fileName
 */
function analyzeResume(text, fileName = '') {
  if (!text || text.trim().length < 50) {
    throw new Error('Not enough text could be extracted. Please ensure your file is text-based (not a scanned image).')
  }

  const skills      = extractSkills(text)
  const sections    = detectSections(text)
  const score       = calcScore(skills, sections)
  const suggestions = generateSuggestions(text, skills, sections, score)
  const density     = keywordDensity(text, skills)
  const stats       = textStats(text)

  return {
    fileName,
    atsScore:       score.total,
    scoreBreakdown: {
      skillsScore:     score.skillsScore,
      experienceScore: score.experienceScore,
      educationScore:  score.educationScore,
      projectsScore:   score.projectsScore,
    },
    skillsDetected:   skills,
    sections,
    suggestions,
    keywordDensity:   density,
    stats,
    analyzedAt:       new Date().toISOString(),
  }
}

module.exports = { analyzeResume }
