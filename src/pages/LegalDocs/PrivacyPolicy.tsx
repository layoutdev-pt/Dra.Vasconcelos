import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
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
              <ShieldCheck className="text-secondary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-site-text">Política de Privacidade</h1>
              <p className="text-site-text-muted text-sm mt-1">Última atualização: 14 de abril de 2026</p>
              <p className="text-site-text-muted text-sm mt-1">Entidade Responsável: FB – Farmabiologica Lda. (NIPC/NIF: 515 122 971)</p>
              <p className="text-site-text-muted text-sm mt-1">Sede: Rua Braamcamp, 88 – 3º Esq, 1250-012 Lisboa, Portugal</p>
              <p className="text-site-text-muted text-sm mt-1">Contacto (Encarregado de Proteção de Dados): geral@draalexandravasconcelos.pt</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-site-text-muted leading-relaxed space-y-8">
            <section>
              <h2 className="text-xl font-bold text-site-text mb-4">1. Compromisso com a Privacidade </h2>
              <p>
                A FB – Farmabiologica Lda. garante a proteção e a confidencialidade dos dados pessoais de todos os utilizadores do website da Dra. Alexandra Vasconcelos. O tratamento de dados é efetuado em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD) e com a legislação portuguesa vigente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-site-text mb-4">2. Dados Recolhidos e Finalidades</h2>
              <p>
                Recolhemos apenas os dados estritamente necessários para prestar os nossos serviços de forma eficiente e segura:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>A.</strong> Gestão de Encomendas (Loja Direta): Para a compra e expedição de produtos físicos diretamente pelo nosso website, recolhemos o seu nome, morada de entrega e de faturação, NIF e contacto telefónico. Estes dados são obrigatórios para a execução do contrato de compra e venda e para o cumprimento de obrigações fiscais.</li>
                <li><strong>B.</strong> Conta de Utilizador e Comunidade: Ao criar uma conta para aceder aos "Favoritos" e à secção de "Comentários", recolhemos o seu nome, endereço de e-mail e palavra-passe (armazenada de forma encriptada). Esta recolha baseia-se no seu consentimento explícito no momento do registo.</li>
                <li><strong>C.</strong> Newsletter e Marketing: Caso opte por subscrever as nossas comunicações, utilizaremos o seu e-mail para enviar novidades sobre cursos, livros e artigos. Poderá cancelar esta subscrição a qualquer momento.</li>
                <li><strong>D.</strong> Dados Técnicos e Estatísticos (Vercel Analytics): Através da infraestrutura Vercel, recolhemos métricas anónimas de desempenho e segurança. Não é efetuado o rastreio individual do utilizador nem a recolha do endereço IP completo para fins de marketing.</li>
                <li><strong>E.</strong> Compras em Plataformas Externas: No caso de cursos na Hotmart ou livros na Wook/Planeta de Livros, os dados de pagamento e faturação são recolhidos e tratados exclusivamente por essas entidades, de acordo com as suas próprias políticas de privacidade.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-site-text mb-4">3. Prova de Consentimento</h2>
              <p>
                De acordo com as exigências legais, a FB – Farmabiologica Lda. mantém um registo informático (log) que associa o seu endereço de e-mail à data e hora exatas em que aceitou os nossos Termos e a nossa Política de Privacidade, servindo como prova de consentimento válido.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-site-text mb-4">4. Partilha de Dados com Terceiros</h2>
              <p>
                Não vendemos nem partilhamos os seus dados pessoais para fins publicitários de terceiros. A partilha ocorre apenas para a viabilização do serviço:
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Operadores Logísticos:</strong> Partilha do nome, morada e telefone com a transportadora para a entrega de encomendas físicas.</li>
                <li><strong>Autoridade Tributária:</strong> Comunicação dos dados de faturação por imposição legal.</li>
                <li><strong>Alojamento de Dados:</strong> Os dados são alojados em servidores seguros na União Europeia (Vercel e Hostinger), cumprindo todas as normas de segurança.</li>
              </ul>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-site-text mb-4">5. Conservação dos Dados</h2>
              <p>
                Os dados relativos à conta de utilizador e interações (comentários) são conservados enquanto a conta estiver ativa. Dados de faturação são mantidos pelo prazo legal de 10 anos. 
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-site-text mb-4">6. Direitos do Utilizador (Direito a ser Esquecido)</h2>
              <p>
                O utilizador tem o direito de aceder, retificar, limitar ou solicitar o apagamento definitivo dos seus dados e da sua conta. Para exercer estes direitos, poderá fazê-lo na sua área de cliente ou contactar-nos através do e-mail geral@draalexandravasconcelos.pt.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
