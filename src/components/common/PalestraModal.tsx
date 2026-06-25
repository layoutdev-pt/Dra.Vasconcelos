import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, MonitorPlay, User, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../config/supabase';

interface PalestraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PalestraModal: React.FC<PalestraModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      // 1. Gravação Local
      const { error: dbError } = await supabase
        .from('leads')
        .insert([{ name, phone, email, source: 'palestra' }]);

      if (dbError && dbError.code !== '23505') throw dbError;

      // 2. Download do PDF
      const link = document.createElement('a');
      link.href = '/docs/Palestra Online Gratuita.pdf';
      link.download = 'Palestra Online Gratuita.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setStatus('success');
      setName('');
      setPhone('');
      setEmail('');
    } catch (error: unknown) {
      console.error('Submit error:', error);
      setStatus('error');
      const isSupabaseError = (err: unknown): err is { code?: string; message?: string } => typeof err === 'object' && err !== null;
      if (isSupabaseError(error)) {
        if (error.code === '23505') {
          setStatus('success');
          setName('');
          setPhone('');
          setEmail('');
        } else {
          setErrorMessage(error.message || 'Ocorreu um erro na submissão. Tente novamente.');
        }
      } else {
        setErrorMessage('Ocorreu um erro na submissão. Tente novamente.');
      }
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="bg-surface rounded-[2rem] w-full max-w-lg relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-surface-border">
        
        <div className="p-6 border-b border-surface-border flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-site-text-muted hover:text-site-text transition-colors bg-surface-muted hover:bg-surface-border p-2.5 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-2xl flex items-center justify-center mb-5">
            <MonitorPlay className="w-8 h-8 text-secondary" strokeWidth={1.5} />
          </div>
          
          <h3 className="text-2xl font-extrabold text-site-text mb-2">Acesso à Palestra</h3>
          <p className="text-site-text-muted text-sm px-4">
            Preencha os seus dados para assistir à nossa Masterclass Gratuita.
          </p>
        </div>

        <div className="p-8 pt-4 overflow-y-auto">
          {status === 'success' ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" strokeWidth={2} />
              </div>
              <h4 className="text-2xl font-bold text-site-text mb-3">Convite Gerado!</h4>
              <p className="text-site-text-muted mb-8 text-lg">
                Preencha os seus dados abaixo e oiça a masterclass de imediato.
              </p>
              <div className="flex gap-2 mb-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full px-6 py-4 bg-surface-muted text-site-text font-bold rounded-xl hover:bg-surface-border transition-colors"
                >
                  Voltar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <label htmlFor="name" className="block text-sm font-bold text-site-text mb-1.5 ml-1">
                  Nome Completo *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-site-text-muted" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={status === 'loading'}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-surface-border focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all outline-none bg-surface-muted/50 hover:bg-surface-muted text-site-text font-medium"
                    placeholder="O seu nome"
                  />
                </div>
              </div>

              <div className="relative group">
                <label htmlFor="phone" className="block text-sm font-bold text-site-text mb-1.5 ml-1">
                  Telemóvel *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-site-text-muted" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={status === 'loading'}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-surface-border focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all outline-none bg-surface-muted/50 hover:bg-surface-muted text-site-text font-medium"
                    placeholder="O seu telemóvel"
                  />
                </div>
              </div>

              <div className="relative group">
                <label htmlFor="email" className="block text-sm font-bold text-site-text mb-1.5 ml-1">
                  E-mail *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-site-text-muted" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-surface-border focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all outline-none bg-surface-muted/50 hover:bg-surface-muted text-site-text font-medium"
                    placeholder="O seu melhor e-mail"
                  />
                </div>
              </div>

              {status === 'error' && (
                <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100 flex items-start gap-3">
                  <div className="mt-0.5"><X className="w-4 h-4" /></div>
                  <p>{errorMessage}</p>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full px-8 py-4 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center shadow-lg shadow-secondary/20 hover:shadow-xl hover:-translate-y-0.5"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      A processar...
                    </span>
                  ) : (
                    'Receber Convite e Link'
                  )}
                </button>
              </div>
              
              <p className="text-center text-xs text-site-text-muted mt-6 font-medium px-4 leading-relaxed">
                Ao prosseguir, aceita a nossa <a href="/privacidade" target="_blank" className="text-secondary hover:underline">Política de Privacidade</a> e concorda em receber comunicações.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

//commit