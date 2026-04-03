import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import fullLogo from '../../assets/logo/full1.svg';
import simpleLogo from '../../assets/logo/simple.svg';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={`fixed z-50 w-full transition-all duration-500 ease-in-out flex justify-center ${
      isScrolled ? 'top-2 md:top-6 px-2 md:px-6' : 'top-0 left-0 px-0'
    }`}>
      <nav className={`w-full transition-all duration-500 ease-in-out relative ${
        isScrolled 
          ? 'max-w-[1000px] bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-white/60' 
          : 'max-w-full bg-white/80 backdrop-blur-md border-b border-white/20 rounded-none'
      }`}>
        <div className={`mx-auto transition-all duration-500 ${
          isScrolled ? 'px-4 md:px-8' : 'px-6 lg:px-8 2xl:px-12 max-w-[1400px] 2xl:max-w-[1600px]'
        }`}>
          <div className={`flex items-center justify-between transition-all duration-500 ${isScrolled ? 'h-16 md:h-16' : 'h-20 md:h-24'}`}>
            
            <div className="flex-shrink-0 flex items-center relative h-full">
              <Link to="/" className="relative flex items-center justify-center">
                {/* Logo Principal (Full) */}
                <img 
                  src={fullLogo} 
                  alt="Dra. Alexandra Vasconcelos" 
                  className={`w-auto transition-all duration-300 absolute left-0 origin-left ${
                    isScrolled ? 'h-8 md:h-10 opacity-0 scale-90 pointer-events-none' : 'h-14 md:h-16 lg:h-18 opacity-100 scale-100 relative'
                  }`} 
                />
                {/* Logo Simplificado (Mínimo) */}
                <img 
                  src={simpleLogo} 
                  alt="Dra. Alexandra Vasconcelos Ícone" 
                  className={`w-auto transition-all duration-300 absolute left-0 origin-left ${
                    isScrolled ? 'h-10 md:h-12 opacity-100 scale-100 relative' : 'h-14 md:h-16 opacity-0 scale-110 pointer-events-none'
                  }`} 
                />
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link to="/" className="text-gray-600 hover:text-secondary px-3 py-2 text-sm font-medium transition-colors">Home</Link>
                <Link to="/sobre" className="text-gray-500 hover:text-secondary px-3 py-2 text-sm font-medium transition-colors">Sobre</Link>
                <Link to="/cursos" className="text-gray-500 hover:text-secondary px-3 py-2 text-sm font-medium transition-colors">Programas</Link>
                <Link to="/livros" className="text-gray-500 hover:text-secondary px-3 py-2 text-sm font-medium transition-colors">Livros</Link>
              </div>
            </div>
            
            <div className="hidden md:flex items-center">
              <a 
                href="https://portal.draalexandravasconcelos.pt" 
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-colors shadow-lg shadow-primary/20 ${
                  isScrolled ? 'px-5 py-2 text-xs' : 'px-6 py-2.5 md:py-3 text-xs md:text-sm'
                }`}
              >
                Portal Login
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={toggleMobileMenu} 
                className="text-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary p-2 rounded-md"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Abrir menu principal</span>
                {isMobileMenuOpen ? (
                  <X className="block h-7 w-7" aria-hidden="true" />
                ) : (
                  <Menu className="block h-7 w-7" aria-hidden="true" />
                )}
              </button>
            </div>
            
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <div className={`md:hidden absolute left-0 w-full bg-white border border-gray-100 shadow-xl transition-all duration-300 ease-in-out origin-top ${
          isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
        } ${
          isScrolled ? 'top-[calc(100%+0.5rem)] rounded-2xl' : 'top-full border-t border-gray-100'
        }`}>
          <div className="px-6 pt-2 pb-6 space-y-1 flex flex-col">
            <Link to="/" onClick={toggleMobileMenu} className="text-gray-600 hover:text-secondary hover:bg-gray-50 block px-4 py-3 rounded-md text-base font-medium">Home</Link>
            <Link to="/sobre" onClick={toggleMobileMenu} className="text-gray-600 hover:text-secondary hover:bg-gray-50 block px-4 py-3 rounded-md text-base font-medium">Sobre</Link>
            <Link to="/cursos" onClick={toggleMobileMenu} className="text-gray-600 hover:text-secondary hover:bg-gray-50 block px-4 py-3 rounded-md text-base font-medium">Programas</Link>
            <Link to="/livros" onClick={toggleMobileMenu} className="text-gray-600 hover:text-secondary hover:bg-gray-50 block px-4 py-3 rounded-md text-base font-medium">Livros</Link>
            
            <div className="pt-4 mt-2 border-t border-gray-100">
               <a 
                  href="https://portal.draalexandravasconcelos.pt" 
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={toggleMobileMenu}
                  className="w-full bg-primary hover:bg-primary/90 text-white block text-center px-4 py-3 rounded-full text-base font-medium transition-colors shadow-md"
                >
                  Portal Login
                </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};