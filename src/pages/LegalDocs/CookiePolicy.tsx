import React from 'react';
import { motion } from 'framer-motion';
import { Cookie } from 'lucide-react';

export const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-site-bg pt-32 pb-20 transition-colors duration-500">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
              <Cookie className="text-secondary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-site-text">Política de Cookies</h1>
              <p className="text-site-text-muted text-sm mt-1">Transparência sobre como utilizamos cookies no nosso website.</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-site-text-muted leading-relaxed space-y-8 [&_strong]:text-site-text [&_strong]:font-bold">
            <section>
              <h2 className="text-xl font-bold text-site-text mb-4">O que são Cookies?</h2>
              <p>
                Os cookies são pequenos ficheiros de texto que são guardados no seu computador ou dispositivo móvel através do navegador (browser), retendo apenas informação relacionada com as suas preferências, não incluindo, como tal, os seus dados pessoais.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-site-text mb-4">Cookies Essenciais (Técnicos)</h2>
              <p>
                A Clínica Dra. Alexandra Vasconcelos utiliza apenas cookies técnicos estritamente necessários para o funcionamento das funcionalidades básicas do site. Estes incluem:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Sessão de Utilizador:</strong> Para manter a sua sessão ativa e permitir o acesso a áreas reservadas.</li>
                <li><strong>Carrinho de Compras:</strong> Para gerir a sua seleção de cursos ou livros durante a navegação.</li>
                <li><strong>Consentimento:</strong> Para memorizar se aceitou a nossa política de cookies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-site-text mb-4">Cookies Analíticos</h2>
              <p>
                Utilizamos cookies de análise anónima para recolher estatísticas sobre o volume de visitas e o comportamento dos utilizadores no site, sem nunca identificar individualmente o utilizador ou rastrear para fins publicitários.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-site-text mb-4">Como Gerir Cookies?</h2>
              <p>
                Pode, a qualquer momento, desativar a utilização de cookies nas definições do seu navegador. 
                No entanto, alertamos que a desativação de cookies essenciais pode impedir o correto funcionamento de certas áreas do site (como o login ou o checkout).
              </p>
              <p className="mt-4">
                Pode também resetar as suas opções de consentimento clicando no botão <strong>"Configuração de Cookies"</strong> no rodapé do nosso site.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
