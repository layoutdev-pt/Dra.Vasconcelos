import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="w-full fixed top-0 z-50 bg-white/60 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          
          <div className="flex-shrink-0 flex items-center gap-2">
            <HeartPulse className="w-8 h-8 text-secondary" strokeWidth={2.5} />
            <span className="font-bold text-xl tracking-tight text-primary">
              Dr. Silva <span className="font-normal text-gray-500">Integrative</span>
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="text-gray-600 hover:text-secondary px-3 py-2 text-sm font-medium transition-colors">Home</Link>
              <Link to="/sobre" className="text-gray-500 hover:text-secondary px-3 py-2 text-sm font-medium transition-colors">Sobre</Link>
              <Link to="/cursos" className="text-gray-500 hover:text-secondary px-3 py-2 text-sm font-medium transition-colors">Programas</Link>
              <Link to="/livros" className="text-gray-500 hover:text-secondary px-3 py-2 text-sm font-medium transition-colors">Livros</Link>
            </div>
          </div>
          
          <div>
            <a 
              href="https://portal.draalexandravasconcelos.pt" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors shadow-lg shadow-primary/20"
            >
              Portal Login
            </a>
          </div>
          
        </div>
      </div>
    </nav>
  );
};