import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
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
              <ShieldCheck className="text-secondary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">Política de Privacidade</h1>
              <p className="text-gray-400 text-sm mt-1">Última atualização: {new Date().toLocaleDateString('pt-PT')}</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-8">
            <section>
              <h2 className="text-xl font-bold text-primary mb-4">1. Introdução</h2>
              <p>
                A privacidade dos nossos pacientes e utilizadores é de extrema importância para a Clínica Dra. Alexandra Vasconcelos. 
                Esta política detalha como recolhemos, utilizamos e protegemos as suas informações pessoais ao utilizar os nossos serviços e website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">2. Recolha de Dados</h2>
              <p>
                Recolhemos informações quando se regista no nosso site, solicita uma consulta, subscreve a nossa newsletter ou preenche um formulário. 
                Os dados podem incluir o seu nome, endereço de e-mail, número de telefone e histórico médico (no contexto de consultas).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">3. Utilização da Informação</h2>
              <p>
                Qualquer informação que recolhemos pode ser utilizada para:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personalizar a sua experiência e responder às suas necessidades individuais.</li>
                <li>Melhorar o nosso website e os serviços prestados pela clínica.</li>
                <li>Melhorar o atendimento ao cliente.</li>
                <li>Enviar e-mails periódicos sobre novidades, cursos e livros (caso tenha dado o seu consentimento).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">4. Proteção de Dados</h2>
              <p>
                Implementamos uma variedade de medidas de segurança para manter a segurança das suas informações pessoais. 
                Utilizamos encriptação de ponta para proteger dados sensíveis transmitidos online e protegemos as suas informações offline.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">5. Cookies</h2>
              <p>
                Utilizamos apenas cookies técnicos essenciais para garantir o funcionamento da sua conta, do carrinho de compras e estatísticas anónimas, sem rastreio para publicidade. 
                Ao continuar a navegar, concorda com a nossa política.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-primary mb-4">6. Seus Direitos</h2>
              <p>
                Tem o direito de aceder, retificar ou eliminar os seus dados pessoais a qualquer momento. 
                Pode contactar-nos através do e-mail <strong>info@draalexandravasconcelos.pt</strong> para exercer estes direitos.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
