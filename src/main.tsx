import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App'
import { WordGuesser } from './pages/WordGuesser'
import { BirdFlapper } from './pages/BirdFlapper'
import TwentyFourtyEight from './pages/TwentyFourtyEight'
import { HigherOrLower } from './pages/HigherOrLower'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/wordguesser" element={<WordGuesser />} />
        <Route path="/birdflapper" element={<BirdFlapper />} />
        <Route path="/2048" element={<TwentyFourtyEight />} />
        <Route path="/higherorlower" element={<HigherOrLower />} />
      </Routes>
    </Router>
  </StrictMode>,
)