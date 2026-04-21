import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CookieBanner } from './components/common/CookieBanner';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy loaded pages existentes
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Appointments = lazy(() => import('./pages/Appointments').then(module => ({ default: module.Appointments })));
const Academy = lazy(() => import('./pages/Academy').then(module => ({ default: module.Academy })));
const CourseDetails = lazy(() => import('./pages/CourseDetails').then(module => ({ default: module.CourseDetails })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Admin = lazy(() => import('./pages/Admin').then(module => ({ default: module.Admin })));

// NOVAS PÁGINAS ADICIONADAS
const Blog = lazy(() => import('./pages/Blog').then(module => ({ default: module.Blog })));
const Midia = lazy(() => import('./pages/Midia').then(module => ({ default: module.Midia })));
const BlogPost = lazy(() => import('./pages/Blog').then(module => ({ default: module.Blog })));

// LEGAL PAGES
const PrivacyPolicy = lazy(() => import('./pages/LegalDocs/PrivacyPolicy').then(module => ({ default: module.PrivacyPolicy })));
const ShippingTerms = lazy(() => import('./pages/LegalDocs/ShippingTerms').then(module => ({ default: module.ShippingTerms })));
const DisputeResolution = lazy(() => import('./pages/LegalDocs/DisputeResolution').then(module => ({ default: module.DisputeResolution })));
const Terms = lazy(() => import('./pages/LegalDocs/Terms').then(module => ({ default: module.Terms })));
const CookiePolicy = lazy(() => import('./pages/LegalDocs/CookiePolicy').then(module => ({ default: module.CookiePolicy })));

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

// Páginas que renderizam SEM Navbar e Footer (Layout limpo)
const STANDALONE_ROUTES = ['/admin', '/entrar'];

const AppShell: React.FC = () => {
  const { pathname } = useLocation();
  const isStandalone = STANDALONE_ROUTES.some(r => pathname.startsWith(r));

  return (
    <div className="flex flex-col min-h-screen w-full bg-background-light font-display text-primary antialiased overflow-x-hidden">
      {/* Mostra Navbar se não for uma rota standalone */}
      {!isStandalone && <Navbar />}
      
      <main className="grow w-full">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Site Principal */}
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/consultas" element={<Appointments />} />
            <Route path="/aprender" element={<Academy />} />
            <Route path="/cursos/:id" element={<CourseDetails />} />

            {/* ROTAS DE BLOG E MÍDIA */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/midia" element={<Midia />} />

            {/* LEGAL ROUTES */}
            <Route path="/privacidade" element={<PrivacyPolicy />} />
            <Route path="/termos-envio" element={<ShippingTerms />} />
            <Route path="/resolucao-litigios" element={<DisputeResolution />} />
            <Route path="/termos" element={<Terms />} />
            <Route path="/cookies" element={<CookiePolicy />} />

            {/* Auth — Layout Standalone */}
            <Route path="/entrar" element={<Login />} />

            {/* Admin — Protegido + Standalone */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>

      {/* Mostra Footer se não for uma rota standalone */}
      {!isStandalone && <Footer />}

      {/* Global Cookie Banner */}
      <CookieBanner />
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