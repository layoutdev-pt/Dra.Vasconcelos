import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CookieBanner } from './components/common/CookieBanner';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Appointments = lazy(() => import('./pages/Appointments').then(module => ({ default: module.Appointments })));
const Academy = lazy(() => import('./pages/Academy').then(module => ({ default: module.Academy })));
const CourseDetails = lazy(() => import('./pages/CourseDetails').then(module => ({ default: module.CourseDetails })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Admin = lazy(() => import('./pages/Admin').then(module => ({ default: module.Admin })));
const Blog = lazy(() => import('./pages/Blog').then(module => ({ default: module.Blog })));
const Midia = lazy(() => import('./pages/Midia').then(module => ({ default: module.Midia })));
const Perfil = lazy(() => import('./pages/Perfil').then(module => ({ default: module.Perfil })));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-site-bg">
    <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
  </div>
);

const STANDALONE_ROUTES = ['/admin', '/entrar'];

const AppShell: React.FC = () => {
  const { pathname } = useLocation();
  const isStandalone = STANDALONE_ROUTES.some(r => pathname.startsWith(r));

  return (
    /* bg-site-bg e text-site-text usam as variáveis do index.css */
    <div className="flex flex-col min-h-screen w-full bg-site-bg text-site-text font-display antialiased overflow-x-hidden transition-colors duration-500">
      {!isStandalone && <Navbar />}
      
      <main className="grow w-full">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/consultas" element={<Appointments />} />
            <Route path="/aprender" element={<Academy />} />
            <Route path="/cursos/:id" element={<CourseDetails />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Blog />} />
            <Route path="/midia" element={<Midia />} />
            <Route path="/entrar" element={<Login />} />
            <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
            <Route path="/admin/*" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </main>

      {!isStandalone && <Footer />}
      <CookieBanner />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ScrollToTop />
          <AppShell />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;