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
      // 1. Insert into leads table
      const { error } = await supabase
        .from('leads')
        .insert([{ email, source: 'ebook' }]);

      if (error) {
        // If duplicate, still send the PDF
        if (error.code !== '23505') throw error;
      }

      // 2. Call Edge Function to send the PDF email
      const { error: fnError } = await supabase.functions.invoke('send-lead-magnet', {
        body: { email },
      });

      if (fnError) {
        console.error('Edge Function error:', fnError);
        // Even if the email fails, the lead was captured
      }

      setStatus('success');
      setEmail('');

    } catch (error: any) {
      setStatus('error');
      if (error.code === '23505') {
        setStatus('success'); // Duplicate = already subscribed, treat as success
        setEmail('');
      } else {
        setErrorMessage('Ocorreu um erro na submissão. Tente novamente.');
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
          Gostava de ter o meu<br className="hidden md:block" /> novo ebook?
        </h2>
        
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Os Probióticos que vão Revolucionar a Sua Vida: um guia prático para otimizar o seu intestino e fortalecer a sua saúde.
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
                placeholder="Insira o seu email" 
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
              {status === 'loading' ? 'A processar...' : 'Faça Download Gratuito'}
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