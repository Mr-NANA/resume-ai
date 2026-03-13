# ResumeAI — Fullstack AI Resume Analyzer

> **React + Node.js · Deployed on Vercel & Render · 100% Free**

Upload a PDF or DOCX resume and get an instant **ATS score (0–100)**, **100+ detected skills**, **resume section analysis**, and **prioritised improvement suggestions** — all powered by a real Express backend.

**Live Demo:** https://your-app.vercel.app  
**GitHub:** https://github.com/your-username/resume-ai

---

## Tech Stack

| Layer     | Technology                                           |
|-----------|------------------------------------------------------|
| Frontend  | React 18 · Vite · TailwindCSS · React Router · Axios |
| Backend   | Node.js · Express · Multer · pdf-parse · mammoth     |
| NLP       | `natural` library + regex keyword matching           |
| Deploy FE | Vercel (free)                                        |
| Deploy BE | Render (free)                                        |

**No database. No auth. No payment method. Just clone and deploy.**

---

## Project Structure

```
resume-ai/
├── frontend/                   ← React + Vite app (deploy to Vercel)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ScoreRing.jsx        Animated SVG ATS score ring
│   │   │   ├── ScoreBreakdown.jsx   Category score bars
│   │   │   ├── SkillsPanel.jsx      Colour-coded skill chips
│   │   │   ├── SuggestionsList.jsx  Priority-ranked suggestions
│   │   │   └── SectionsGrid.jsx     Resume section detection grid
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── UploadPage.jsx
│   │   │   └── ResultPage.jsx
│   │   ├── utils/
│   │   │   └── api.js               Axios wrapper for backend calls
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   └── vite.config.js               Proxies /api → backend in dev
│
├── backend/                    ← Express API (deploy to Render)
│   ├── routes/
│   │   └── analyze.js               POST /api/analyze
│   ├── services/
│   │   ├── textExtractor.js         pdf-parse + mammoth
│   │   ├── skillExtractor.js        100+ skill keyword matcher
│   │   └── resumeAnalyzer.js        ATS scoring + suggestions
│   ├── middleware/
│   │   └── upload.js                Multer config (memory storage)
│   ├── server.js                    Express entry point
│   └── .env.example
│
└── package.json                     Root scripts (runs both together)
```

---

## Architecture

```
User uploads PDF/DOCX
       │
       ▼
React Frontend (Vercel)
  POST /api/analyze  multipart/form-data
       │
       ▼
Express Backend (Render)
  ├── Multer          → buffer file in memory (no disk write)
  ├── textExtractor   → pdf-parse (PDF) / mammoth (DOCX)
  ├── skillExtractor  → keyword match 100+ skills across 7 categories
  └── resumeAnalyzer  → ATS score + section detection + suggestions
       │
       ▼
JSON response → React renders ResultPage dashboard
```

---

## ATS Scoring (0–100)

| Category          | Max | Logic                              |
|-------------------|-----|------------------------------------|
| Technical Skills  | 40  | Scaled: 20+ skills = full marks    |
| Experience Section| 20  | Heading detected in text           |
| Education Section | 20  | Heading detected in text           |
| Projects Section  | 20  | Heading detected in text           |

---

## Local Development

### Prerequisites
- Node.js ≥ 18 (`node -v`)
- npm ≥ 9

### 1. Clone the repo
```bash
git clone https://github.com/your-username/resume-ai.git
cd resume-ai
```

### 2. Install all dependencies
```bash
npm run install:all
```
This installs root, frontend, and backend deps in one shot.

### 3. Configure backend env
```bash
cd backend
cp .env.example .env
# .env is pre-configured for local dev — no changes needed
```

### 4. Run both servers together
```bash
# From root directory:
npm run dev
```

This starts:
- **Backend** on http://localhost:5000
- **Frontend** on http://localhost:3000

Vite automatically proxies `/api/*` requests to `localhost:5000`, so no CORS issues in dev.

### 5. Open the app
Go to http://localhost:3000 and upload a resume!

---

## Deploy to GitHub

### Step 1 — Create a GitHub repo
```bash
# In the resume-ai folder:
git init
git add .
git commit -m "feat: initial commit — ResumeAI fullstack MVP"
```

Go to https://github.com/new → create repo named `resume-ai` → copy the remote URL, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/resume-ai.git
git branch -M main
git push -u origin main
```

---

## Deploy Backend to Render (Free)

1. Go to https://render.com → **Sign up / Log in** (free, no card needed)
2. Click **New** → **Web Service**
3. Connect your GitHub account → select the `resume-ai` repo
4. Fill in the settings:

| Setting         | Value                        |
|-----------------|------------------------------|
| Name            | `resume-ai-backend`          |
| Root Directory  | `backend`                    |
| Runtime         | `Node`                       |
| Build Command   | `npm install`                |
| Start Command   | `npm start`                  |
| Instance Type   | **Free**                     |

5. Under **Environment Variables**, add:

| Key            | Value                                      |
|----------------|--------------------------------------------|
| `NODE_ENV`     | `production`                               |
| `FRONTEND_URL` | `https://your-app.vercel.app` *(add after deploying frontend)* |

6. Click **Create Web Service** → Render will build and deploy.
7. Copy your backend URL: `https://resume-ai-backend.onrender.com`

> **Note:** Free Render services spin down after 15 min of inactivity and take ~30s to wake up on first request. This is fine for a portfolio project.

---

## Deploy Frontend to Vercel (Free)

1. Go to https://vercel.com → **Sign up / Log in** with GitHub
2. Click **Add New Project** → Import `resume-ai` from GitHub
3. Configure:

| Setting         | Value          |
|-----------------|----------------|
| Framework Preset| `Vite`         |
| Root Directory  | `frontend`     |
| Build Command   | `npm run build`|
| Output Directory| `dist`         |

4. Under **Environment Variables**, add:

| Key            | Value                                         |
|----------------|-----------------------------------------------|
| `VITE_API_URL` | `https://resume-ai-backend.onrender.com`      |

5. Click **Deploy** — done in ~60 seconds.
6. Your app is live at `https://resume-ai.vercel.app`

### Final step — update CORS on Render
Go back to Render → your backend service → Environment → update:
```
FRONTEND_URL = https://resume-ai.vercel.app
```
Then **Manual Deploy → Deploy latest commit**.

---

## API Reference

### `POST /api/analyze`
Upload a resume for analysis.

**Request:** `multipart/form-data`
| Field    | Type | Description              |
|----------|------|--------------------------|
| `resume` | File | PDF or DOCX, max 5 MB    |

**Response:** `application/json`
```json
{
  "success": true,
  "requestId": "a1b2c3d4",
  "data": {
    "fileName": "john_resume.pdf",
    "atsScore": 72,
    "scoreBreakdown": {
      "skillsScore": 32,
      "experienceScore": 20,
      "educationScore": 20,
      "projectsScore": 0
    },
    "skillsDetected": [
      { "name": "Python",    "category": "language"  },
      { "name": "React",     "category": "framework" },
      { "name": "MongoDB",   "category": "database"  }
    ],
    "sections": {
      "experience": true,
      "education": true,
      "projects": false,
      "skills": true,
      "summary": false,
      "certifications": false,
      "achievements": false
    },
    "suggestions": [
      {
        "priority": "medium",
        "icon": "🟡",
        "text": "Add a Projects section",
        "detail": "List 2-3 projects with tech stack and measurable outcomes..."
      }
    ],
    "keywordDensity": 2.4,
    "stats": { "wordCount": 412, "lineCount": 68 },
    "analyzedAt": "2024-04-05T10:30:00.000Z"
  }
}
```

### `GET /health`
Health check endpoint.
```json
{ "status": "ok", "timestamp": "...", "version": "1.0.0" }
```

---

## Skills Detected (100+)

| Category   | Examples                                              |
|------------|-------------------------------------------------------|
| Languages  | Python, JavaScript, TypeScript, Java, Go, Rust, C++  |
| Frameworks | React, Next.js, Node.js, Django, Flask, Spring Boot  |
| Databases  | MySQL, PostgreSQL, MongoDB, Redis, DynamoDB          |
| Cloud      | AWS, GCP, Azure, Docker, Kubernetes, Terraform       |
| ML/AI      | TensorFlow, PyTorch, Scikit-learn, Pandas, LLMs      |
| Tools      | Git, GitHub, Jira, Figma, Jest, Webpack, Postman     |
| Soft       | Agile, Leadership, Communication, Problem Solving    |

---

## Common Issues

**Backend returns CORS error on production**  
→ Set `FRONTEND_URL` env var on Render to your exact Vercel URL (no trailing slash).

**PDF shows empty text extraction**  
→ File is likely image-based (scanned). pdf-parse only works on text-layer PDFs. Ask users to upload a text-based PDF.

**Render service is slow to respond**  
→ Free tier spins down after 15 min. First request takes ~30s. This is expected — add a note to your portfolio.

**`npm run dev` crashes**  
→ Make sure you ran `npm run install:all` first from the root directory.

---

## Resume Tips for Your Portfolio

When listing this on your resume:

> **ResumeAI** — Fullstack AI Resume Analyzer  
> React 18 · Node.js · Express · NLP · Vercel · Render  
> Built a fullstack web app that extracts text from PDF/DOCX resumes using server-side NLP,
> calculates ATS scores across 4 weighted categories, detects 100+ skills, and generates
> prioritised improvement suggestions. Deployed frontend on Vercel and REST API on Render.

---

## License
MIT — free to use, modify, and deploy.
