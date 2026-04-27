import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';
import { supabase } from '../../config/supabase';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export const AcademyLeadMagnet: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');

    try {
      // 1. Save to Supabase
      const { error: dbError } = await supabase
        .from('leads')
        .insert([{ email, source: 'ebook_academy' }]);

      if (dbError && dbError.code !== '23505') throw dbError;

      // 2. Direct Download for immediate gratification
      const link = document.createElement('a');
      link.href = '/docs/ebook-probioticos.pdf';
      link.download = 'ebook-probioticos.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setStatus('success');
      setEmail('');
    } catch (err: any) {
      console.error('Error in lead magnet:', err);
      setStatus('error');
    }
  };

  return (
    <section className="py-20 bg-surface-hero">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="bg-surface rounded-4xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-surface-border overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center">

            <motion.div
              variants={fadeUp}
              custom={0}
              className="flex-shrink-0 w-full md:w-[340px] lg:w-[400px] bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent p-10 md:p-12 flex items-center justify-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ perspective: '800px' }}
                className="relative"
              >
                <div className="w-[200px] h-[280px] rounded-lg shadow-2xl overflow-hidden border border-surface-border transform rotate-y-[-5deg] rotate-x-[2deg]">
                  <img 
                    src="/images/ebook-probioticos.png" 
                    alt="Capa Ebook Probióticos" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Efeito de brilho na capa */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none rounded-lg" />
              </motion.div>
            </motion.div>

            {/* Right — Content + form */}
            <div className="flex-1 p-8 md:p-12 lg:p-16">
              <motion.h3
                variants={fadeUp}
                custom={1}
                className="text-2xl md:text-3xl font-bold text-site-text mb-3"
              >
                Comece a ler hoje mesmo: <span className="text-secondary">Guia Digital Gratuito</span>
              </motion.h3>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-site-text-muted font-light leading-relaxed mb-8 max-w-lg"
              >
                Deixe o seu email abaixo para receber imediatamente a sua cópia digital com dicas práticas de saúde integrativa.
              </motion.p>

              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-2xl px-6 py-4"
                >
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                  <div>
                    <p className="font-bold text-green-600 text-sm">Ebook enviado com sucesso!</p>
                    <p className="text-green-500 text-xs mt-0.5 opacity-80">Verifique a sua caixa de entrada e o seu download automático.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  variants={fadeUp}
                  custom={3}
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-lg"
                >
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-site-text-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={status === 'loading'}
                      placeholder="O seu melhor email"
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-surface-muted border border-surface-border rounded-xl text-sm text-site-text placeholder-site-text-muted/60 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all disabled:opacity-50"
                    />
                    {status === 'error' && (
                      <span className="absolute -bottom-6 left-4 text-xs text-red-400 font-medium">
                        Ocorreu um erro. Tente novamente.
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-accent hover:bg-accent/90 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-accent/20 whitespace-nowrap disabled:opacity-50"
                  >
                    {status === 'loading' ? 'A processar...' : 'Receber Ebook Grátis'}
                  </button>
                </motion.form>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};
