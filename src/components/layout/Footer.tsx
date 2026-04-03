import React from 'react';
import whiteLogo from '../../assets/logo/full_white.svg';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary pt-16 pb-8 text-white border-t border-white/10 mt-auto">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Coluna 1: Branding & Descrição */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center">
              <img src={whiteLogo} alt="Dra. Alexandra Vasconcelos" className="h-20 md:h-28 w-auto" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Empoderando pacientes através do conhecimento integrativo de ponta para um amanhã com mais vitalidade e saúde plena.
            </p>
            {/* Redes Sociais com SVGs nativos para evitar erros do Lucide */}
            <div className="flex gap-4 pt-2">
              <a href="#facebook" className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#instagram" className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#youtube" className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 19.54 12 19.54 12 19.54s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>

          {/* Coluna 2: Plataforma / Links Rápidos */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6">Plataforma</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#cursos" className="hover:text-accent transition-colors">Todos os Cursos</a></li>
              <li><a href="#sobre" className="hover:text-accent transition-colors">Sobre Nós</a></li>
              <li><a href="#precos" className="hover:text-accent transition-colors">Planos & Preços</a></li>
              <li><a href="#certificacao" className="hover:text-accent transition-colors">Certificação</a></li>
            </ul>
          </div>

          {/* Coluna 3: Suporte & Legal */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6">Suporte</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#ajuda" className="hover:text-accent transition-colors">Centro de Ajuda</a></li>
              <li><a href="#contactos" className="hover:text-accent transition-colors">Contactos</a></li>
              <li><a href="#termos" className="hover:text-accent transition-colors">Termos de Serviço</a></li>
              <li><a href="#privacidade" className="hover:text-accent transition-colors">Privacidade</a></li>
            </ul>
          </div>

          {/* Coluna 4: Newsletter */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-bold mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Receba as mais recentes pesquisas de medicina funcional e novidades clínicas diretamente na sua caixa de entrada.
            </p>
            <form className="flex w-full">
              <input 
                type="email" 
                placeholder="O seu melhor email" 
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-l-lg focus:outline-none focus:border-accent text-sm text-white placeholder-gray-500 transition-colors" 
              />
              <button 
                type="submit" 
                className="bg-accent hover:bg-accent/90 text-white font-bold px-6 py-3 rounded-r-lg text-sm transition-colors"
              >
                Subscrever
              </button>
            </form>
          </div>

        </div>

        {/* Barra Inferior */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-xs">
            © {currentYear} Clínica Dra. Alexandra Vasconcelos. Todos os direitos reservados.
          </div>
          <div className="flex gap-4 text-xs text-gray-500">
            <a href="#termos" className="hover:text-white transition-colors">Termos</a>
            <a href="#privacidade" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#cookies" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
};