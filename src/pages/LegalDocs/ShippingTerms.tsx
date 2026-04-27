import React from 'react';
import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';

export const ShippingTerms: React.FC = () => {
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
              <Truck className="text-secondary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-site-text tracking-tight">Condições de Envio e Entrega</h1>
              <p className="text-site-text-muted text-sm mt-1 items-center flex gap-2">
                FB – Farmabiologica Lda.
              </p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-site-text-muted leading-relaxed font-light space-y-12">
            <section className="bg-surface-muted/30 p-6 rounded-2xl border border-surface-border">
              <p className="m-0 italic">
                As condições de entrega variam consoante a natureza do produto adquirido (físico ou digital) e a plataforma onde a compra é processada.
              </p>
            </section>

            {/* SECTION 1 */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-site-text flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-white text-sm">1</span>
                PRODUTOS DIGITAIS: Cursos e Ebooks (Hotmart)
              </h2>
              <p>
                A venda e a entrega de cursos online e determinados ebooks são geridas integralmente pela plataforma externa <strong>Hotmart</strong>.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-5 border border-surface-border rounded-xl bg-surface shadow-sm">
                  <h4 className="font-bold text-site-text mb-2 text-sm uppercase tracking-wider">Entrega Automática e Digital</h4>
                  <p className="text-sm m-0">Não há qualquer envio físico por correio. A entrega destes produtos é 100% digital e automática.</p>
                </div>
                <div className="p-5 border border-surface-border rounded-xl bg-surface shadow-sm">
                  <h4 className="font-bold text-site-text mb-2 text-sm uppercase tracking-wider">Acesso após Pagamento</h4>
                  <p className="text-sm m-0">Imediatamente após a plataforma Hotmart confirmar a receção do seu pagamento, receberá um e-mail automático (enviado pela própria Hotmart) com o link de acesso ao curso ou com o ficheiro do ebook para descarregar.</p> 
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2.5 shrink-0"></div>
                  <p className="text-sm m-0"><strong>Atenção ao E-mail:</strong> É da inteira responsabilidade do utilizador garantir que introduz o endereço de e-mail correto no momento da compra na Hotmart. Verifique sempre a sua pasta de "Spam" ou "Lixo Eletrónico".</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2.5 shrink-0"></div>
                  <p className="text-sm m-0"><strong>Suporte Técnico:</strong> Quaisquer questões relacionadas com a não receção do e-mail de acesso, perda de palavra-passe ou problemas no download do ebook deverão ser tratadas diretamente com o suporte técnico da plataforma Hotmart.</p>
                </div>
              </div>
            </section>

            {/* SECTION 2 */}
            <section className="space-y-8">
              <h2 className="text-2xl font-bold text-site-text flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-white text-sm">2</span>
                PRODUTOS FÍSICOS: Loja Direta (FB – Farmabiologica Lda.)
              </h2>
              <p>
                Para produtos físicos expedidos diretamente pelas nossas instalações, aplicam-se as seguintes regras de envio:
              </p>

              <div className="space-y-8 pl-4 border-l-2 border-surface-border">
                <div>
                  <h3 className="text-lg font-bold text-site-text mb-3">2.1. Processamento e Expedição</h3>
                  <p className="text-sm mb-4">Sempre que os artigos se encontrem em stock, as encomendas são processadas e despachadas de acordo com o método de pagamento selecionado:</p>
                  <ul className="list-none p-0 space-y-3 text-sm">
                    <li className="flex gap-2"><strong>Contra-entrega:</strong> A expedição é iniciada após a receção e validação do pedido de encomenda.</li>
                    <li className="flex gap-2"><strong>Transferência Bancária (e restantes meios online):</strong> A expedição ocorre apenas após a confirmação da boa cobrança ou depósito do valor na nossa conta. No caso de transferência, deverá enviar o comprovativo para o nosso e-mail, mencionando o número da encomenda.</li>
                    <li className="flex gap-2"><strong>Numerário:</strong> Pagamento e levantamento em dinheiro disponível apenas presencialmente na nossa loja física na Ramada.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-site-text mb-3">2.2. Método de Transporte</h3>
                  <p className="text-sm m-0">
                    Todas as encomendas de produtos físicos são enviadas via <strong>Transportadora</strong>. 
                    Nos casos em que o serviço da transportadora o permita, será fornecido ao cliente um link para acompanhamento online (tracking) do trajeto da encomenda.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-site-text mb-3">2.3. Prazos de Entrega</h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Regra geral, o prazo de entrega é de <strong>2 dias úteis</strong> para Portugal Continental.</li>
                    <li>O prazo máximo de entrega previsto pode variar entre <strong>6 a 10 dias úteis</strong>, consoante a complexidade logística ou destino.</li>
                    <li>A FB – Farmabiologica Lda. não se responsabiliza por atrasos nas entregas dos artigos que sejam causados por motivos de força maior ou circunstâncias externas imputáveis à transportadora.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-site-text mb-3">2.4. Rutura de Stock</h3>
                  <p className="text-sm m-0">O prazo de entrega dependerá sempre do stock existente. Caso se verifique uma rutura de stock imprevista do artigo encomendado, o cliente será imediatamente contactado pela nossa equipa para ser informado do novo prazo previsto ou para acordar uma alternativa.</p>
                </div>

                <div className="bg-secondary/10 p-6 rounded-2xl border border-secondary/20">
                  <h3 className="text-lg font-bold text-secondary mb-3">2.5. Verificação no Momento da Entrega (Garantia de Transporte)</h3>
                  <p className="text-sm mb-4 font-semibold text-site-text">Garantimos que todos os produtos são embalados segundo as normas rigorosas de acondicionamento, sem qualquer anomalia. Para assegurar o acionamento do seguro de transporte, o cliente deve cumprir o seguinte procedimento:</p>
                  <ol className="list-decimal pl-6 space-y-3 text-sm">
                    <li>Ao receber a encomenda, deverá verificar o estado exterior da mesma e as quantidades perante o estafeta da transportadora.</li>
                    <li>Caso verifique que a embalagem foi danificada durante o envio, deve recusar a receção da mesma e realizar a respetiva queixa, escrevendo o motivo da recusa na guia do transportador nesse exato momento.</li>
                    <li>De seguida, deverá contactar a nossa equipa para transmitir o sucedido, efetivando o registo da ocorrência.</li>
                  </ol>
                  <p className="text-xs mt-4 text-site-text-muted">
                    Garantimos que, caso ocorra algum dano no material durante o transporte e o cliente tenha seguido rigorosamente este procedimento (recusa com justificação), procederemos ao envio de uma nova encomenda igual à solicitada (caso exista stock), ficando os novos portes de envio por nossa conta. A FB – Farmabiologica Lda. não se responsabiliza por danos de transporte reclamados após a aceitação da encomenda sem anotações na guia da transportadora.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
