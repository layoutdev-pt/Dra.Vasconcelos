import React from 'react';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';

export const DisputeResolution: React.FC = () => {
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
              <Scale className="text-secondary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">Resolução de Litígios Online</h1>
              <p className="text-gray-400 text-sm mt-1">Meios alternativos de resolução de conflitos de consumo.</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-8">
            <section>
              <h2 className="text-xl font-bold text-primary mb-4">Plataforma de Resolução de Litígios</h2>
              <p>
                Em conformidade com o Artigo 14.º do Regulamento (UE) n.º 524/2013, informamos os nossos utilizadores que podem recorrer à plataforma de Resolução de Litígios em Linha (RLL) da União Europeia para a resolução extrajudicial de litígios decorrentes de contratos de venda ou de serviços online.
              </p>
              <div className="mt-6 p-6 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <p className="font-bold text-primary mb-1">Aceda à Plataforma Oficial</p>
                  <p className="text-sm text-gray-400">Poderá submeter a sua reclamação diretamente no portal da Comissão Europeia.</p>
                </div>
                <a 
                  href="https://ec.europa.eu/consumers/odr/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary/90 transition-all text-sm whitespace-nowrap"
                >
                  Ir para a Plataforma ODR
                </a>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">Centros de Arbitragem em Portugal</h2>
              <p>
                Em caso de litígio, o consumidor pode recorrer a uma Entidade de Resolução Alternativa de Litígios de consumo, como:
              </p>
              <ul className="list-disc pl-6 space-y-4">
                <li>
                  <strong>CNIACC - Centro Nacional de Informação e Arbitragem de Conflitos de Consumo</strong><br />
                  Web: www.cniacc.pt
                </li>
                <li>
                  <strong>Centro de Arbitragem de Conflitos de Consumo de Lisboa</strong><br />
                  Web: www.centroarbitragemlisboa.pt
                </li>
                <li>
                  <strong>Centro de Arbitragem de Conflitos de Consumo do Porto</strong><br />
                  Web: www.cicap.pt
                </li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
