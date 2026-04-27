import React from 'react';
import { motion } from 'framer-motion';
import { Scale, ExternalLink } from 'lucide-react';

export const DisputeResolution: React.FC = () => {
  return (
    <div className="min-h-screen bg-site-bg pt-32 pb-20 transition-colors duration-500">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex gap-4 mb-8">
            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
              <Scale className="text-secondary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-site-text tracking-tight">Resolução de Litígios Online</h1>
              <p className="text-site-text-muted text-sm mt-1">Meios alternativos de resolução de conflitos de consumo.</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-site-text-muted leading-relaxed font-light space-y-12 [&_strong]:text-site-text [&_strong]:font-bold [&_b]:text-site-text [&_b]:font-bold">
            <section className="space-y-6">
              <p>
                A União Europeia criou uma plataforma online para apoiar os consumidores na apresentação das suas reclamações sobre qualquer litígio em que estejam envolvidos.
              </p>
              
              <div className="bg-surface-muted/30 p-8 rounded-[2rem] border border-surface-border space-y-6">
                <p className="m-0">
                  Neste âmbito, a <strong>FB – Farmabiologica Lda.</strong> disponibiliza toda a informação para que possa exercer o seu direito de reclamação junto de uma entidade oficial, terceira e imparcial ao processo.
                </p>
                <p className="m-0">
                  Assim, se ficou insatisfeito com a aquisição de um bem expedido pela nossa loja online, ou com a solução por nós apresentada para resolver a situação, pode expor a sua contestação através da Plataforma Europeia de Resolução de Litígios em Linha.
                </p>

                <div className="pt-4">
                  <a 
                    href="https://ec.europa.eu/consumers/odr/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-3 bg-secondary text-white px-8 py-4 rounded-xl font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 group"
                  >
                    Aceder à Plataforma RLL
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              <div className="bg-secondary/10 p-6 rounded-2xl border border-secondary/20 flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Scale className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-sm m-0 italic text-site-text">
                  Salientamos que eventuais litígios relacionados com aquisições de produtos digitais ou físicos efetuadas em plataformas parceiras (<strong>Hotmart, Wook, Planeta de Livros</strong>) deverão ser geridos através dos mecanismos de resolução dessas mesmas plataformas.
                </p>
              </div>
            </section>

            <section className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-site-text mb-4">Sugestão de Entidades RAL</h2>
                <p className="text-base text-site-text-muted">
                  Em alternativa, a nível nacional, poderá recorrer a uma das seguintes entidades de Resolução Alternativa de Litígios de Consumo (RAL):
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Centro de Arbitragem de Conflitos de Consumo de Lisboa", url: "www.centroarbitragemlisboa.pt" },
                  { name: "CNIACC – Centro Nacional de Informação e Arbitragem de Conflitos de Consumo", url: "www.cniacc.pt" },
                  { name: "CIAB – Centro de Informação, Medição e Arbitragem de Consumo", url: "www.ciab.pt" },
                  { name: "CACC do Vale do Ave / Tribunal Arbitral", url: "www.triave.pt" },
                  { name: "CIMPAS – Centro de Informação, Medição e Provedoria de Seguros", url: "www.cimpas.pt" }
                ].map((item, idx) => (
                  <div key={idx} className="p-6 border border-surface-border rounded-2xl hover:border-secondary/30 transition-colors bg-surface group">
                    <h4 className="font-bold text-site-text text-sm mb-3 group-hover:text-secondary transition-colors">{item.name}</h4>
                    <a 
                      href={`https://${item.url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-site-text-muted text-xs hover:text-secondary flex items-center gap-2 group-hover:underline"
                    >
                      {item.url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
