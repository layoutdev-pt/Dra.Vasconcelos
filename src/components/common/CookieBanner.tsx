import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-[800px]"
        >
          <div className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] rounded-[2rem] p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center shrink-0">
                <Cookie className="text-secondary w-8 h-8" />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Utilizamos apenas cookies técnicos essenciais para garantir o funcionamento da sua conta, 
                  do carrinho de compras e estatísticas anónimas, sem rastreio para publicidade. 
                  Ao continuar a navegar, concorda com a nossa <Link to="/cookies" className="text-secondary font-bold hover:underline">Política de Cookies</Link>.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleAccept}
                  className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all text-sm shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Compreendi
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-3 text-gray-400 hover:text-gray-600 transition-colors md:hidden"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
