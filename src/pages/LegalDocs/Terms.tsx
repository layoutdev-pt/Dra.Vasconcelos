import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export const Terms: React.FC = () => {
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
              <FileText className="text-secondary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-site-text">Termos e Condições</h1>
              <p className="text-site-text-muted text-sm mt-1">Regras e diretrizes para a utilização do nosso website e serviços.</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-site-text-muted leading-relaxed space-y-8 [&_strong]:text-site-text [&_strong]:font-bold [&_b]:text-site-text [&_b]:font-bold">
            <section>
              <h2 className="text-xl font-bold text-site-text mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao aceder ao website da Clínica Dra. Alexandra Vasconcelos, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-site-text mb-4">2. Uso de Licença</h2>
              <p>
                É concedida permissão para descarregar temporariamente uma cópia dos materiais (informações ou software) no site da clínica apenas para visualização transitória pessoal e não comercial.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-site-text mb-4">3. Isenção de Responsabilidade</h2>
              <p>
                Os materiais no site são fornecidos 'como estão'. A Clínica Dra. Alexandra Vasconcelos não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-site-text mb-4">4. Limitações</h2>
              <p>
                Em nenhum caso a clínica ou os seus fornecedores serão responsáveis por quaisquer danos decorrentes do uso ou da incapacidade de usar os materiais no site.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
