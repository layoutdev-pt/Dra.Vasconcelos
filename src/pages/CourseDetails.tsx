import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShoppingCart, ShieldCheck, Quote, Star, Moon, Battery, Activity } from 'lucide-react';
import { supabase } from '../config/supabase';
import type { Course } from '../types/course';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';

const parseContent = (contentStr: string) => {
  if (!contentStr) return { html: '', modules: [], testimonials: [] };
  try {
    if (contentStr.trim().startsWith('{')) {
      const parsed = JSON.parse(contentStr);
      if (parsed.html !== undefined) return parsed;
    }
  } catch (e) {}
  return { html: contentStr, modules: [], testimonials: [] };
};

const BarChart = () => (
  <div className="flex items-end justify-center gap-2 h-28 mt-6">
    {[20, 35, 50, 75, 100].map((h, i) => (
      <motion.div 
        key={i}
        initial={{ height: 0 }}
        whileInView={{ height: `${h}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
        className={`w-8 rounded-t-md ${i === 4 ? 'bg-blue-500' : 'bg-blue-200'}`}
      />
    ))}
  </div>
);

const DonutChart = () => (
  <div className="relative w-28 h-28 mx-auto mt-6">
    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
      <circle cx="50" cy="50" r="40" stroke="#EFF6FF" strokeWidth="12" fill="none" />
      <motion.circle 
        cx="50" cy="50" r="40" 
        stroke="#3B82F6" strokeWidth="12" fill="none"
        strokeDasharray="251.2"
        initial={{ strokeDashoffset: 251.2 }}
        whileInView={{ strokeDashoffset: 251.2 * 0.08 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center flex-col">
      <span className="text-2xl font-bold text-primary">92%</span>
    </div>
  </div>
);

const LineChart = () => (
  <div className="w-full h-28 mt-6 relative">
    <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
      <motion.path 
        d="M5 35 Q 25 30, 50 20 T 95 5" 
        fill="none" 
        stroke="#3B82F6" 
        strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.circle cx="5" cy="35" r="2.5" fill="#3B82F6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} />
      <motion.circle cx="50" cy="20" r="2.5" fill="#3B82F6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.8 }} />
      <motion.circle cx="95" cy="5" r="2.5" fill="#3B82F6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.4 }} />
    </svg>
  </div>
);

export const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      if (!id) return;
      setLoading(true);
      
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      let query = supabase.from('courses').select('*');
      
      if (isUuid) {
        query = query.eq('id', id);
      } else {
        query = query.eq('slug', id);
      }
      
      const { data } = await query.single();
      if (data) setCourse(data);
      setLoading(false);
    }
    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="pt-32 pb-24 min-h-screen text-center bg-gray-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-primary">Página não encontrada.</h2>
        <Link to="/aprender" className="text-orange-500 hover:underline mt-4 inline-block font-semibold">
          Voltar aos cursos
        </Link>
      </div>
    );
  }

  const { html, modules, testimonials } = parseContent(course.content);
  const cleanHTML = html ? DOMPurify.sanitize(html) : '';

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-orange-500/30 selection:text-primary">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#F97316 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <Link to="/aprender" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary mb-12 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
          
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Image Side */}
            <div className="w-full lg:w-1/2 relative">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-100 aspect-[4/5] max-w-md mx-auto lg:mx-0 border-8 border-white">
                {course.image_url ? (
                  <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Sem imagem de capa</div>
                )}
                
                {/* Floating Badge overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/40 flex items-center gap-4 transform transition-transform hover:scale-105">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Baseado em Evidências</p>
                    <p className="text-sm font-bold text-primary">Método 100% Natural</p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Text Side */}
            <div className="w-full lg:w-1/2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider rounded-md mb-4">
                  ★ MAIS VENDIDO
                </span>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-primary leading-tight tracking-tight mb-4">
                  {course.title}
                </h1>
                <p className="text-lg text-gray-500 leading-relaxed">
                  {course.description}
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="pt-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <a href={course.buy_url || '#'} target="_blank" rel="noopener noreferrer" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 flex items-center justify-center gap-3 group text-lg w-full sm:w-auto">
                    Comprar Agora
                    <ArrowLeft className="w-5 h-5 rotate-135 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                  
                  {course.price != null && (
                    <div>
                      <p className="text-sm text-gray-400 font-medium line-through mb-0.5">{(course.price * 2.5).toFixed(2).replace('.', ',')}€</p>
                      <p className="text-3xl font-extrabold text-primary">{course.price.toFixed(2).replace('.', ',')}€</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-6 mt-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" /> Acesso Imediato
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" /> Base Científica
                  </div>
                </div>
              </motion.div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 2. OFFER BAR (STICKY OR STATIC) */}
      <div className="bg-orange-500 text-white py-4 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            OFERTA POR TEMPO LIMITADO
          </div>
          <div className="flex gap-2 text-xl font-bold">
            <span className="bg-white/20 px-3 py-1 rounded">62</span>:
            <span className="bg-white/20 px-3 py-1 rounded">14</span>:
            <span className="bg-white/20 px-3 py-1 rounded">55</span>
          </div>
          <p>Garante o desconto de 57% hoje.</p>
        </div>
      </div>

      {/* 3. CLINICAL RESULTS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-primary mb-4">Resultados Clínicos Observados</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Dados coletados de um grupo de controlo de 500 participantes após o ciclo completo de 14 dias do protocolo BioReset.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-full flex justify-between items-start">
                <span className="font-bold text-primary">Níveis de Energia</span>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+30%</span>
              </div>
              <BarChart />
              <p className="text-sm text-gray-500 mt-6 text-center">Aumento progressivo de vitalidade reportado.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-full flex justify-between items-start">
                <span className="font-bold text-primary">Redução de Inchaço</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">-92%</span>
              </div>
              <DonutChart />
              <p className="text-sm text-gray-500 mt-6 text-center">Participantes relataram redução visível do inchaço abdominal.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-full flex justify-between items-start">
                <span className="font-bold text-primary">Qualidade do Sono</span>
                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">Melhora</span>
              </div>
              <LineChart />
              <p className="text-sm text-gray-500 mt-6 text-center">Sono 42% mais profundo e reparador após a 1ª semana.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. PROGRAM CONTENT */}
      {modules && modules.length > 0 && (
        <section className="py-24 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              <div className="lg:w-1/3 sticky top-32">
                <p className="text-orange-500 font-bold uppercase tracking-wider text-sm mb-4">Conteúdo Programático</p>
                <h2 className="text-3xl font-extrabold text-primary mb-6">Um protocolo completo para reiniciar seu metabolismo</h2>
                <p className="text-gray-500 leading-relaxed mb-8">
                  O {course.title} não é apenas um curso, é um manual prático de operação para o seu corpo. Desenvolvido para pessoas ocupadas que precisam de resultados rápidos e seguros.
                </p>
                {html && (
                  <button onClick={() => window.scrollTo({ top: document.body.scrollHeight - 800, behavior: 'smooth' })} className="text-orange-500 font-bold hover:underline flex items-center gap-2">
                    Ver detalhes completos <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                )}
              </div>
              
              <div className="lg:w-2/3 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {modules.map((mod, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="font-bold text-primary mb-2">{mod.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{mod.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. CALL TO ACTION / SUBSCRIPTION */}
      <section className="py-24 bg-white border-y border-gray-100 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-6">Pronto para dar o próximo passo?</h2>
            <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
              Junte-se a centenas de pessoas que já transformaram a sua saúde com o {course.title}. Não deixe para amanhã a vitalidade que pode conquistar hoje.
            </p>
            
            <a 
              href={course.buy_url || '#'} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 inline-flex items-center justify-center gap-3 group text-xl w-full sm:w-auto"
            >
              Inscrever-me Agora
              <ArrowLeft className="w-6 h-6 rotate-135 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Acesso Imediato</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Suporte Dedicado</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Pagamento Seguro</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. SUCCESS STORIES */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-primary mb-4">Histórias de Sucesso</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Veja o que dizem aqueles que transformaram sua saúde e vitalidade com o método.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testim, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                  <div>
                    <Quote className="w-8 h-8 text-blue-100 mb-6" />
                    <div className="flex gap-1 mb-4">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="text-gray-700 italic mb-8 leading-relaxed">"{testim.quote}"</p>
                  </div>
                  <div className="flex items-center gap-4 border-t border-gray-50 pt-6">
                    {testim.image_url ? (
                      <img src={testim.image_url} alt={testim.author} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-lg">
                        {testim.author.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-primary text-sm">{testim.author}</h4>
                      <p className="text-xs text-gray-400">{testim.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. GUARANTEE */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-8">
            <ShieldCheck className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-primary mb-6">Garantia Incondicional de 30 Dias</h2>
          <p className="text-gray-500 leading-relaxed mb-8">
            Temos tanta confiança na eficácia do método que assumimos todo o risco. Se você aplicar o protocolo e não sentir diferença na sua energia e inchaço, devolvemos 100% do seu investimento sem perguntas.
          </p>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 font-medium rounded-full text-sm">
            <CheckCircle2 className="w-4 h-4" /> Compra Segura e Protegida
          </span>
          <a href={course.buy_url || '#'} target="_blank" rel="noopener noreferrer" className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-lg hover:-translate-y-1 mt-10 text-xl w-full sm:w-auto">
            Quero Começar Agora
          </a>
        </div>
      </section>

      {/* 7. RICH TEXT DETAILS (If any extra content is provided) */}
      {(cleanHTML || course.secondary_image_url) && (
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-start gap-16">
              
              {/* Left Side: Secondary Image */}
              {course.secondary_image_url && (
                <div className="w-full lg:w-5/12 lg:sticky lg:top-32">
                  <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square max-w-md mx-auto lg:mx-0">
                    <img src={course.secondary_image_url} alt="Mais sobre o método" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/10 pointer-events-none" />
                  </motion.div>
                </div>
              )}

              {/* Right Side: Rich Text without rigid boxing */}
              {cleanHTML && (
                <div className={`w-full ${course.secondary_image_url ? 'lg:w-7/12 pt-4' : 'max-w-4xl mx-auto'}`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }}
                    className="prose prose-lg max-w-none text-gray-600 prose-headings:text-primary prose-a:text-orange-500 hover:prose-a:text-orange-600 prose-headings:font-extrabold prose-h2:text-3xl prose-h2:mb-6 prose-h3:text-2xl prose-p:leading-relaxed prose-li:text-gray-600"
                    dangerouslySetInnerHTML={{ __html: cleanHTML }}
                  />
                </div>
              )}

            </div>
          </div>
        </section>
      )}

    </div>
  );
};
