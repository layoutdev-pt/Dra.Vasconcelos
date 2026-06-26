import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { OptimizedImage } from '../../components/OptimizedImage';

export const LeadMagnet: React.FC = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false); // NOVO: Estado para a checkbox de consentimento
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // NOVO: Só avança se o email estiver preenchido e a checkbox marcada
    if (!email || !consent) return; 

    setStatus('loading');
    setErrorMessage('');

    try {
      // 1. Inserção na Base de Dados (Supabase Leads)
      const { error: dbError } = await supabase
        .from('leads')
        .insert([{ email, source: 'ebook' }]);

      if (dbError && dbError.code !== '23505') throw dbError; // 23505 = unique_violation

      // -> ADIÇÃO DA API CLOSUM: Regista o lead na newsletter
      supabase.functions.invoke('send-newsletter', { body: { email, list_id: 41676 } }).catch(console.error);

      // 3. Forçar o Download Imediato do PDF
      const link = document.createElement('a');
      link.href = '/docs/Ebook-Probioticos.pdf'; 
      link.download = 'Ebook-Probioticos.pdf';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setStatus('success');
      setEmail('');
      setConsent(false); // Reseta a checkbox em caso de sucesso
    } catch (error: unknown) {
      console.error('Submit error:', error);
      setStatus('error');
      const isSupabaseError = (err: unknown): err is { code?: string; message?: string } => typeof err === 'object' && err !== null;
      if (isSupabaseError(error)) {
        if (error.code === '23505') {
          setStatus('success');
          setEmail('');
          setConsent(false);
        } else {
          setErrorMessage(error.message || 'Ocorreu um erro na submissão. Tente novamente.');
        }
      } else {
        setErrorMessage('Ocorreu um erro na submissão. Tente novamente.');
      }
    }
  };

  return (
    <section id="leadmagnet" className="py-24 bg-primary relative overflow-hidden flex flex-col items-center justify-center transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        
        <div className="w-48 md:w-56 mx-auto mb-8 flex items-center justify-center">
          <OptimizedImage 
            src="/images/ebook-probioticos.png" 
            alt="Capa Ebook Probióticos" 
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Gostava de ter o meu<br className="hidden md:block" /> novo ebook?
        </h2>
        
        <p className="text-gray-300 dark:text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Os Probióticos que vão Revolucionar a Sua Vida: um guia prático para otimizar o seu intestino e fortalecer a sua saúde.
        </p>
        
        {status === 'success' ? (
          <div className="bg-green-500/20 border border-green-500/30 text-green-400 p-6 rounded-xl max-w-lg mx-auto backdrop-blur-sm">
            <p className="font-bold text-lg mb-1 text-white">Guia descarregado com sucesso!</p>
            <p className="text-sm opacity-90">Verifique os seus downloads.</p>
          </div>
        ) : (
          /* NOVO: Formulário ajustado para envolver o campo de email, o botão e a checkbox */
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 justify-center max-w-lg mx-auto relative">
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="grow relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  placeholder="O seu melhor email" 
                  className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary transition-all disabled:opacity-50 backdrop-blur-md" 
                  required 
                />
                {status === 'error' && (
                  <span className="absolute -bottom-6 left-4 text-xs text-red-400 font-medium">
                    {errorMessage}
                  </span>
                )}
              </div>
              <button 
                type="submit" 
                disabled={status === 'loading' || !consent} // O botão também desativa se não houver consentimento
                className="px-8 py-4 rounded-full bg-accent hover:bg-accent/90 text-white font-bold whitespace-nowrap transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {status === 'loading' ? 'A processar...' : 'Download Gratuito'}
              </button>
            </div>

            {/* NOVO: Checkbox de Consentimento */}
            <label className="flex items-start gap-3 text-left cursor-pointer group px-2 sm:px-4 mt-2">
              <input 
                type="checkbox" 
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
                disabled={status === 'loading'}
                className="mt-0.5 shrink-0 w-4 h-4 rounded border-white/30 bg-white/10 text-secondary focus:ring-2 focus:ring-secondary cursor-pointer disabled:opacity-50"
              />
              <span className="text-gray-400/80 dark:text-gray-400 text-xs font-medium leading-relaxed group-hover:text-gray-300 transition-colors">
                Ao submeter este formulário, concordo com a nossa <Link to="/privacidade" className="text-white hover:text-secondary transition-colors underline">Política de Privacidade</Link> e em receber comunicações.
              </span>
            </label>

          </form>
        )}
        
      </div>
    </section>
  );
};