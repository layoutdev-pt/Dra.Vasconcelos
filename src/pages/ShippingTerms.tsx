import React from 'react';
import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';

export const ShippingTerms: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
              <Truck className="text-secondary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">Condições de Envio e Entrega</h1>
              <p className="text-gray-400 text-sm mt-1">Informações sobre a entrega de livros e materiais físicos.</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-8">
            <section>
              <h2 className="text-xl font-bold text-primary mb-4">1. Processamento de Encomendas</h2>
              <p>
                Todas as encomendas de livros ou outros materiais físicos são processadas num prazo de 2 a 5 dias úteis após a confirmação do pagamento. 
                As encomendas não são enviadas ou entregues aos fins de semana ou feriados.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">2. Taxas de Envio e Estimativas de Entrega</h2>
              <p>
                Os custos de envio da sua encomenda serão calculados e apresentados no momento do checkout. 
                As estimativas de entrega variam consoante a localização:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Portugal Continental:</strong> 3-5 dias úteis.</li>
                <li><strong>Ilhas (Madeira e Açores):</strong> 5-10 dias úteis.</li>
                <li><strong>Internacional:</strong> Sob consulta ou calculado no checkout.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">3. Confirmação de Envio e Rastreio</h2>
              <p>
                Receberá um e-mail de Confirmação de Envio assim que a sua encomenda for expedida, contendo o(s) número(s) de rastreio (tracking number) se aplicável.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">4. Danos e Extravios</h2>
              <p>
                A Clínica Dra. Alexandra Vasconcelos não se responsabiliza por quaisquer produtos danificados ou perdidos durante o transporte. 
                Se recebeu a sua encomenda danificada, contacte a transportadora para apresentar uma reclamação ou contacte-nos para assistência no processo.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
