import React, { useState } from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../config/supabase';

export const BlogNewsletter: React.FC = () => {
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
        .from('leads')
        .insert([{ email, source: 'blog' }]);

      if (error) {
        if (error.code === '23505') {
          // Already subscribed — treat as success
          setStatus('success');
          setEmail('');
          return;
        }
        throw error;
      }

      setStatus('success');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage('Ocorreu um erro. Tente novamente.');
    }
  };

  return (
    <section className="py-20 bg-site-bg transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="bg-primary rounded-[3rem] p-10 lg:p-16 border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl transition-all duration-500">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 text-secondary mb-4">
              <Mail className="w-6 h-6" />
              <span className="font-bold tracking-widest uppercase text-sm">Newsletter</span>
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-4">
              Receba conteúdos de saúde diretamente no seu e-mail.
            </h2>
            <p className="text-gray-400 text-lg font-light">
              Assine para não perder os novos artigos sobre longevidade e medicina integrativa.
            </p>
          </div>

          {status === 'success' ? (
            <div className="w-full lg:w-auto flex items-center gap-4 bg-green-500/10 border border-green-500/20 text-green-400 px-8 py-5 rounded-2xl">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold text-lg">Subscrito com sucesso!</p>
                <p className="text-sm opacity-80">Receberá os novos artigos no seu email.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  placeholder="Seu melhor e-mail" 
                  className="px-8 py-5 rounded-2xl bg-white/5 text-white outline-none min-w-[300px] border border-white/10 focus:ring-2 focus:ring-secondary transition-all disabled:opacity-50"
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
                className="bg-secondary hover:bg-secondary/90 text-white font-bold px-8 py-5 rounded-2xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {status === 'loading' ? 'A processar...' : (
                  <>Subscrever <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};