import { Routes, Route } from 'react-router-dom'
import Navbar      from './components/Navbar.jsx'
import HomePage    from './pages/HomePage.jsx'
import UploadPage  from './pages/UploadPage.jsx'
import ResultPage  from './pages/ResultPage.jsx'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <Routes>
        <Route path="/"       element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </div>
  )
}
