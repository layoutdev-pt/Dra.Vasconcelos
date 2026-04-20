import React from 'react';
import { Link } from 'react-router-dom';
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
              <Link to="/">
                <img src={whiteLogo} alt="Dra. Alexandra Vasconcelos" className="h-20 md:h-28 w-auto" />
              </Link>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Empoderando pacientes através do conhecimento integrativo de ponta para um amanhã com mais vitalidade e saúde plena.
            </p>
          </div>

          {/* Coluna 2: Clínica & Contactos */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6">Contactos e Clínica</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex flex-col gap-1">
                <span className="text-white/60 text-xs uppercase tracking-wider font-bold">Telefone</span>
                <a href="tel:+351936150690" className="hover:text-accent transition-colors">(+351) 936 150 690</a>
                <span className="text-[10px] text-gray-500">(chamada rede fixa nacional)</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-white/60 text-xs uppercase tracking-wider font-bold">Email</span>
                <a href="mailto:info@draalexandravasconcelos.pt" className="hover:text-accent transition-colors">info@draalexandravasconcelos.pt</a>
              </li>
              <li className="pt-2">
                <Link to="/sobre" className="hover:text-accent transition-colors">Sobre a Clínica</Link>
              </li>
              <li>
                <Link to="/consultas" className="hover:text-accent transition-colors">Consultas Integrativas</Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Conhecimento & Legal */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6">Informações</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/blog" className="hover:text-accent transition-colors">Blog Integrativo</Link></li>
              <li><Link to="/aprender" className="hover:text-accent transition-colors">Academia Aprender</Link></li>
              <li><Link to="/privacidade" className="hover:text-accent transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/termos-envio" className="hover:text-accent transition-colors">Condições de Envio</Link></li>
              <li><Link to="/resolucao-litigios" className="hover:text-accent transition-colors">Resolução de Litígios</Link></li>
              <li className="pt-2 text-xs opacity-70">
                <a href="/docs/licenca.pdf" target="_blank" className="hover:text-accent underline decoration-white/20">Licença de Funcionamento (PDF)</a>
              </li>
              <li className="text-xs opacity-70">
                <a href="/docs/registo.pdf" target="_blank" className="hover:text-accent underline decoration-white/20">Certidão de Registo (PDF)</a>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-4">Newsletter</h4>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Receba as mais recentes pesquisas de medicina funcional.
            </p>
            <form className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="O seu email" 
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent text-xs text-white" 
              />
              <button 
                type="submit" 
                className="bg-accent hover:bg-accent/90 text-white font-bold px-4 py-2.5 rounded-lg text-xs transition-colors"
              >
                Subscrever
              </button>
            </form>
          </div>

        </div>

        {/* Barra Inferior */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-xs text-center md:text-left">
            © {currentYear} Clínica Dra. Alexandra Vasconcelos. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest font-bold text-gray-500">
            <button 
              onClick={() => {
                localStorage.removeItem('cookie-consent');
                window.location.reload();
              }}
              className="hover:text-white transition-colors"
            >
              Configuração de Cookies
            </button>
            <Link to="/termos" className="hover:text-white transition-colors">Termos</Link>
            <Link to="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
};