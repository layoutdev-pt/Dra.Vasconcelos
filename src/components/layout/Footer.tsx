import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import whiteLogo from '../../assets/logo/full_white.svg';
import { supabase } from '../../config/supabase';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [footerEmail, setFooterEmail] = useState('');
  const [footerStatus, setFooterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerEmail) return;
    setFooterStatus('loading');
    try {
      const { error } = await supabase.from('leads').insert([{ email: footerEmail, source: 'footer' }]);
      if (error && error.code !== '23505') throw error;
      setFooterStatus('success');
      setFooterEmail('');
    } catch {
      setFooterStatus('error');
    }
  };

  return (
    <footer className="bg-primary pt-16 pb-8 text-white border-t border-white/10 mt-auto font-display">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Coluna 1: Branding */}
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

          {/* Coluna 2: Clínica & Conhecimento */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Clínica & Recursos</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex flex-col gap-1">
                <span className="text-white/40 text-[10px] uppercase font-bold">Contactos</span>
                <a href="tel:+351936150690" className="hover:text-accent transition-colors font-medium">(+351) 936 150 690</a>
                <a href="mailto:info@draalexandravasconcelos.pt" className="hover:text-accent transition-colors font-medium text-xs break-all">info@draalexandravasconcelos.pt</a>
              </li>
              <li className="pt-2 flex flex-col gap-3">
                <Link to="/sobre" className="hover:text-accent transition-colors">Sobre a Clínica</Link>
                <Link to="/consultas" className="hover:text-accent transition-colors">Consultas Integrativas</Link>
                <Link to="/blog" className="hover:text-accent transition-colors">Blog Integrativo</Link>
                <Link to="/aprender" className="hover:text-accent transition-colors">Academia Aprender</Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Termos Legais */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Termos Legais</h4>
            <ul className="space-y-3 text-xs text-gray-400">
              {/* <li><Link to="/termos" className="hover:text-accent transition-colors">Termos e Condições</Link></li> */}
              <li><Link to="/privacidade" className="hover:text-accent transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/cookies" className="hover:text-accent transition-colors">Política de Cookies</Link></li>
              <li><Link to="/termos-envio" className="hover:text-accent transition-colors">Condições de Envio</Link></li>
              <li><Link to="/resolucao-litigios" className="hover:text-accent transition-colors">Resolução de Litígios</Link></li>
              <li className="pt-1">
                <a href="/docs/DocLicenciamento_86331.pdf" target="_blank" className="hover:text-accent transition-colors">Licença de Funcionamento (PDF)</a>
              </li>
              <li>
                <a href="/docs/Certificado20234015012631630.pdf" target="_blank" className="hover:text-accent transition-colors">Certidão de Registo (PDF)</a>
              </li>
              <li>
                <a 
                  href="https://www.livroreclamacoes.pt/Inicio/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  Livro de Reclamações
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Newsletter</h4>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Receba as mais recentes pesquisas.
            </p>
            {footerStatus === 'success' ? (
              <p className="text-xs text-green-400 font-semibold">✓ Subscrito com sucesso!</p>
            ) : (
              <form className="flex flex-col gap-2" onSubmit={handleFooterSubmit}>
                <input 
                  type="email" 
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  disabled={footerStatus === 'loading'}
                  placeholder="O seu email" 
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent text-xs text-white disabled:opacity-50" 
                  required
                />
                <button 
                  type="submit" 
                  disabled={footerStatus === 'loading'}
                  className="bg-accent hover:bg-accent/90 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors disabled:opacity-50"
                >
                  {footerStatus === 'loading' ? 'A processar...' : 'Subscrever'}
                </button>
                {footerStatus === 'error' && (
                  <p className="text-xs text-red-400 mt-1">Ocorreu um erro. Tente novamente.</p>
                )}
              </form>
            )}
          </div>

        </div>

        {/* Barra Inferior */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-[10px] text-center md:text-left uppercase tracking-wider">
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
            <a href="https://vortex-ui.com" target="_blank" className="hover:text-white transition-colors opacity-50">Vortex 2024</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
};