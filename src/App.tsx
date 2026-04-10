import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Appointments = lazy(() => import('./pages/Appointments').then(module => ({ default: module.Appointments })));
const Books = lazy(() => import('./pages/Books').then(module => ({ default: module.Books })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Admin = lazy(() => import('./pages/Admin').then(module => ({ default: module.Admin })));

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background-light">
    <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
  </div>
);

// Pages that render without Navbar/Footer
const STANDALONE_ROUTES = ['/admin'];

const AppShell: React.FC = () => {
  const { pathname } = useLocation();
  const isStandalone = STANDALONE_ROUTES.some(r => pathname.startsWith(r));

  return (
    <div className="flex flex-col min-h-screen w-full bg-background-light font-display text-primary antialiased overflow-x-hidden">
      {!isStandalone && <Navbar />}
      <main className="grow w-full">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Main site */}
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/consultas" element={<Appointments />} />
            <Route path="/livros" element={<Books />} />

            {/* Auth — standalone layout */}
            <Route path="/entrar" element={<Login />} />

            {/* Admin — protected + standalone */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>
      {!isStandalone && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <AppShell />
      </AuthProvider>
    </Router>
  );
};

export default App;