import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LayoutDashboard, LogOut } from 'lucide-react';
import fullLogo from '../../assets/logo/full1.svg';
import simpleLogo from '../../assets/logo/simple.svg';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/consultas', label: 'Consultas' },
  { to: '/aprender', label: 'Aprender' },
];

export const Navbar: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = () => setUserMenuOpen(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [userMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(v => !v);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className={`fixed z-50 w-full transition-all duration-500 ease-in-out flex justify-center ${
      isScrolled ? 'top-2 md:top-6 px-2 md:px-6' : 'top-0 left-0 px-0'
    }`}>
      <nav className={`w-full transition-all duration-500 ease-in-out relative ${
        isScrolled
          ? 'max-w-[1100px] bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-white/60'
          : 'max-w-full bg-white/80 backdrop-blur-md border-b border-white/20 rounded-none'
      }`}>
        <div className={`mx-auto transition-all duration-500 ${
          isScrolled ? 'px-4 md:px-8' : 'px-6 lg:px-8 2xl:px-12 max-w-[1400px] 2xl:max-w-[1600px]'
        }`}>
          <div className={`flex items-center transition-all duration-500 ${isScrolled ? 'h-16' : 'h-20 md:h-24'}`}>

            {/* ── Logo (left) ───────────────────────── */}
            <div className="flex-shrink-0 flex items-center relative h-full">
              <Link to="/" className="relative flex items-center justify-center">
                <img
                  src={fullLogo}
                  alt="Dra. Alexandra Vasconcelos"
                  className={`w-auto transition-all duration-300 absolute left-0 origin-left ${
                    isScrolled ? 'h-8 md:h-10 opacity-0 scale-90 pointer-events-none' : 'h-14 md:h-16 lg:h-18 opacity-100 scale-100 relative'
                  }`}
                />
                <img
                  src={simpleLogo}
                  alt="Dra. Alexandra Vasconcelos Ícone"
                  className={`w-auto transition-all duration-300 absolute left-0 origin-left ${
                    isScrolled ? 'h-10 md:h-12 opacity-100 scale-100 relative' : 'h-14 md:h-16 opacity-0 scale-110 pointer-events-none'
                  }`}
                />
              </Link>
            </div>

            {/* ── Desktop nav links (centered) ─────── */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex items-center gap-1">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-gray-500 hover:text-secondary px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-gray-50"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Right side ───────────────────────── */}
            <div className="flex items-center gap-2 ml-auto md:ml-0">

              {/* Desktop: login button or user menu */}
              <div className="hidden md:block relative">
                {user ? (
                  /* Authenticated — user dropdown */
                  <div className="relative">
                    <button
                      onClick={e => { e.stopPropagation(); setUserMenuOpen(v => !v); }}
                      className={`flex items-center justify-center rounded-full transition-all ${
                        isScrolled 
                          ? 'w-10 h-10 border border-secondary/20 hover:border-secondary/50 bg-white hover:bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/20' 
                          : 'gap-2.5 px-4 py-2 border border-secondary/30 bg-secondary/5 hover:bg-secondary/10 text-primary font-semibold text-sm'
                      }`}
                      title={isAdmin ? 'Admin' : 'Conta'}
                    >
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Perfil" className={`${isScrolled ? 'w-full h-full' : 'w-6 h-6'} rounded-full object-cover shadow-sm`} />
                      ) : (
                        <div className={`${isScrolled ? 'w-full h-full text-base' : 'w-6 h-6 text-xs'} rounded-full bg-secondary flex items-center justify-center text-white font-bold uppercase`}>
                          {user.email?.[0] ?? 'U'}
                        </div>
                      )}
                      {!isScrolled && <span>{isAdmin ? 'Admin' : 'Conta'}</span>}
                    </button>
                    <AnimatedDropdown open={userMenuOpen}>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-secondary transition-colors rounded-t-xl"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors rounded-b-xl w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Terminar Sessão
                      </button>
                    </AnimatedDropdown>
                  </div>
                ) : (
                  /* Not authenticated — Área Pessoal button */
                  <Link
                    to="/entrar"
                    className={`flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-white transition-all shadow-md ${
                      isScrolled 
                        ? 'w-10 h-10' 
                        : 'gap-2 px-5 py-2.5 font-bold text-sm hover:-translate-y-0.5'
                    }`}
                    title="Área Pessoal"
                  >
                    <User className={`${isScrolled ? 'w-5 h-5' : 'w-4 h-4'}`} />
                    {!isScrolled && <span>Área Pessoal</span>}
                  </Link>
                )}
              </div>

              {/* Mobile: user icon or avatar */}
              <Link
                to={user ? '/admin' : '/entrar'}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-gray-50 border border-gray-100 text-gray-500 hover:text-secondary hover:bg-gray-100 transition-colors"
                aria-label="Área Pessoal"
              >
                {user && avatarUrl ? (
                  <img src={avatarUrl} alt="Perfil" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </Link>

              {/* Mobile: hamburger */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg text-primary hover:text-secondary hover:bg-gray-50 focus:outline-none transition-colors"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Abrir menu</span>
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu Panel */}
        <div className={`md:hidden absolute left-0 w-full bg-white border border-gray-100 shadow-xl transition-all duration-300 ease-in-out origin-top ${
          isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
        } ${isScrolled ? 'top-[calc(100%+0.5rem)] rounded-2xl' : 'top-full'}`}>
          <div className="px-6 pt-3 pb-6 space-y-1 flex flex-col">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={toggleMobileMenu}
                className="text-gray-600 hover:text-secondary hover:bg-gray-50 block px-4 py-3 rounded-xl text-base font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-1 border-t border-gray-100">
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={toggleMobileMenu}
                      className="flex items-center gap-2 text-gray-600 hover:text-secondary hover:bg-gray-50 px-4 py-3 rounded-xl text-base font-medium transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard Admin
                    </Link>
                  )}
                  <button
                    onClick={() => { toggleMobileMenu(); handleSignOut(); }}
                    className="w-full flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl text-base font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Terminar Sessão
                  </button>
                </>
              ) : (
                <Link
                  to="/entrar"
                  onClick={toggleMobileMenu}
                  className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 px-4 py-3 rounded-full text-base font-bold transition-colors shadow-md"
                >
                  <User className="w-4 h-4" />
                  Área Pessoal
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

/* ─── Tiny animated dropdown ─────────────────────────────────────────────── */

const AnimatedDropdown: React.FC<{ open: boolean; children: React.ReactNode }> = ({ open, children }) => (
  <div className={`absolute right-0 top-[calc(100%+0.5rem)] w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 origin-top-right ${
    open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
  }`}>
    {children}
  </div>
);