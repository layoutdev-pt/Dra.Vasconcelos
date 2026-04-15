import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock } from 'lucide-react';

export const AcademyTrustBadge: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="flex flex-col items-center text-center max-w-xl mx-auto"
        >
          {/* Shield icon */}
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
            <ShieldCheck className="w-10 h-10 text-blue-500" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
            Garantia Incondicional de 30 Dias
          </h2>

          <p className="text-gray-500 font-light leading-relaxed mb-8 max-w-md">
            Temos tanta confiança na eficácia dos nossos livros que assumimos todo o risco. Se aplicar os protocolos e não sentir diferença na sua saúde, devolvemos 100% do seu investimento.
          </p>

          {/* Trust seal */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-gray-600 text-sm font-semibold shadow-sm">
            <Lock className="w-4 h-4 text-green-500" />
            Compra Segura &amp; Criptografada
          </div>
        </motion.div>
      </div>
    </section>
  );
};
