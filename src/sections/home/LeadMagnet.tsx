import React, { useState } from 'react';
import { BookOpenText } from 'lucide-react';
import { supabase } from '../../config/supabase';

export const LeadMagnet: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('leads_ebook')
        .insert([{ email }]);

      if (error) throw error;

      setStatus('success');
      setEmail('');
      
      // Gatilho para download automático do PDF (Substituir URL pelo link real do Storage)
      window.open('https://teu-projeto.supabase.co/storage/v1/object/public/ebooks/guia-anti-inflamatorio.pdf', '_blank');

    } catch (error: any) {
      setStatus('error');
      // Tratamento para a restrição UNIQUE do email na base de dados
      if (error.code === '23505') {
        setErrorMessage('Este email já recebeu o guia gratuito.');
      } else {
        setErrorMessage('Ocorreu um erro. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <section className="py-24 bg-primary relative overflow-hidden flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        
        <div className="w-16 h-16 mx-auto bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
          <BookOpenText className="w-8 h-8 text-secondary" strokeWidth={1.5} />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Free: 7-Day Anti-Inflammatory<br className="hidden md:block" /> Guide
        </h2>
        
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Start your healing journey today. Download the comprehensive PDF guide with meal plans, shopping lists, and daily rituals.
        </p>
        
        {status === 'success' ? (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-xl max-w-lg mx-auto">
            <p className="font-bold text-lg mb-1">Guia enviado com sucesso!</p>
            <p className="text-sm opacity-80">Verifique a sua caixa de entrada (e a pasta de spam) para aceder ao documento.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto relative">
            <div className="flex-grow relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                placeholder="Enter your best email" 
                className="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary transition-all disabled:opacity-50" 
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
              disabled={status === 'loading'}
              className="px-8 py-4 rounded-full bg-accent hover:bg-accent/90 text-white font-bold whitespace-nowrap transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {status === 'loading' ? 'A processar...' : 'Send it to me'}
            </button>
          </form>
        )}
        
        <p className="text-gray-500 text-xs mt-10 font-medium">
          Respeitamos a Sua Privacidade. Cancele a Qualquer Momento.
        </p>
        
      </div>
    </section>
  );
};