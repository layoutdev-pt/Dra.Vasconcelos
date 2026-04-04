import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Appointments = lazy(() => import('./pages/Appointments').then(module => ({ default: module.Appointments })));

// Scroll to top helper component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background-light">
    <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
  </div>
);

export const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen w-full bg-background-light font-display text-primary antialiased overflow-x-hidden">
        <Navbar />
        <main className="grow w-full">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/consultas" element={<Appointments />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;