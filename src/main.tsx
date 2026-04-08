import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// CHANGE THIS LINE BELOW
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Magazines from './pages/Magazines';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import LegalPage from './pages/legalpage';
import './index.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    // REMOVE basename="/Bm-Advertisers" here. HashRouter doesn't need it!
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/magazines" element={<Magazines />} />
        {/* Catch-all route to prevent 404s inside the app */}
        <Route path="*" element={<Home />} />
        <Route path="/privacy-policy" element={<LegalPage />} />
        <Route path="/terms-conditions" element={<LegalPage />} />
        <Route path="/disclaimer" element={<LegalPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);