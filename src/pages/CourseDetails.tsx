import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShoppingCart, ShieldCheck, Quote, Star, Moon, Battery, Activity } from 'lucide-react';
import { supabase } from '../config/supabase';
import type { Course } from '../types/course';
import { CourseComments } from '../sections/academy/CourseComments';
import { motion } from 'framer-motion';
import { FavoriteButton } from '../components/FavoriteButton';
import DOMPurify from 'dompurify';

const parseContent = (contentStr: string): { html: string, modules: any[], testimonials: any[] } => {
  if (!contentStr) return { html: '', modules: [], testimonials: [] };
  try {
    const parsed = JSON.parse(contentStr);
    if (parsed.html !== undefined) {
      return { html: parsed.html, modules: parsed.modules || [], testimonials: parsed.testimonials || [] };
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
        className={`w-8 rounded-t-md ${i === 4 ? 'bg-secondary' : 'bg-secondary/30'}`}
      />
    ))}
  </div>
);

const DonutChart = () => (
  <div className="relative w-28 h-28 mx-auto mt-6">
    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
      <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="12" fill="none" />
      <motion.circle 
        cx="50" cy="50" r="40" 
        stroke="var(--color-secondary)" strokeWidth="12" fill="none"
        strokeDasharray="251.2"
        initial={{ strokeDashoffset: 251.2 }}
        whileInView={{ strokeDashoffset: 251.2 * 0.08 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center flex-col">
      <span className="text-2xl font-bold text-site-text">92%</span>
    </div>
  </div>
);

const LineChart = () => (
  <div className="w-full h-28 mt-6 relative">
    <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
      <motion.path 
        d="M5 35 Q 25 30, 50 20 T 95 5" 
        fill="none" 
        stroke="var(--color-secondary)" 
        strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.circle cx="5" cy="35" r="3" fill="var(--color-secondary)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} />
      <motion.circle cx="50" cy="20" r="3" fill="var(--color-secondary)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.8 }} />
      <motion.circle cx="95" cy="5" r="3" fill="var(--color-secondary)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.4 }} />
    </svg>
  </div>
);

const Countdown = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, Date.parse(targetDate) - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, Date.parse(targetDate) - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  if (timeLeft <= 0) return <span className="font-bold text-red-200">INSCRIÇÕES ENCERRADAS</span>;

  return (
    <div className="flex gap-2 text-xl font-extrabold items-center">
      {days > 0 && (
        <>
          <span className="text-white">{days}d</span>
          <span className="text-white opacity-60">|</span>
        </>
      )}
      <span className="text-white">{hours.toString().padStart(2, '0')}</span>
      <span className="text-white opacity-60">:</span>
      <span className="text-white">{minutes.toString().padStart(2, '0')}</span>
      <span className="text-white opacity-60">:</span>
      <span className="text-white">{seconds.toString().padStart(2, '0')}</span>
    </div>
  );
};

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
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-site-bg">
        <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="pt-32 pb-24 min-h-screen text-center bg-site-bg flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-site-text">Página não encontrada.</h2>
        <Link to="/cursos" className="text-secondary hover:underline mt-4 inline-block font-semibold">
          Voltar aos cursos
        </Link>
      </div>
    );
  }

  const { html, modules, testimonials } = parseContent(course.content);
  const cleanHTML = html ? DOMPurify.sanitize(html) : '';

  return (
    <div className="min-h-screen bg-site-bg font-sans selection:bg-secondary/30 selection:text-site-text">
      
      {/* 1. HERO SECTION (BANNER STYLE) */}
      <section className="relative pt-32 pb-20 bg-site-bg">
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#7cb0b0 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <Link to="/cursos" className="inline-flex items-center gap-2 text-sm text-site-text-muted hover:text-site-text mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
          
          {course.image_url && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }} 
              className="w-full rounded-[2rem] overflow-hidden shadow-2xl mb-16 relative group bg-surface border border-surface-border"
            >
              <img 
                src={course.image_url} 
                alt={course.title} 
                className="w-full h-auto block transition-transform duration-700 group-hover:scale-105" 
              />
            </motion.div>
          )}

          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider rounded-md">
                  ★ MAIS VENDIDO
                </span>
                <FavoriteButton itemId={course.id} type="course" />
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-site-text leading-tight tracking-tight mb-6 break-words">
                {course.title}
              </h1>
              <p className="text-xl text-site-text-muted leading-relaxed max-w-3xl mx-auto break-words">
                {course.description}
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-8">
              <a href={course.buy_url || '#'} target="_blank" rel="noopener noreferrer" className="bg-secondary hover:bg-secondary-light text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-secondary/30 hover:shadow-secondary/50 hover:-translate-y-1 flex items-center justify-center gap-3 group text-xl w-full sm:w-auto">
                Comprar Agora
                <ArrowLeft className="w-6 h-6 rotate-135 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              
              {course.price != null && (
                <div className="text-left bg-surface px-6 py-4 rounded-2xl border border-surface-border">
                  <p className="text-sm text-site-text-muted font-medium line-through mb-0.5">{(course.price * 2.5).toFixed(2).replace('.', ',')}€</p>
                  <p className="text-4xl font-extrabold text-site-text">{course.price.toFixed(2).replace('.', ',')}€</p>
                </div>
              )}
            </motion.div>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-sm text-site-text-muted font-medium bg-surface px-4 py-2 rounded-full shadow-sm border border-surface-border">
                <CheckCircle2 className="w-5 h-5 text-secondary" /> Acesso Imediato
              </div>
              <div className="flex items-center gap-2 text-sm text-site-text-muted font-medium bg-surface px-4 py-2 rounded-full shadow-sm border border-surface-border">
                <CheckCircle2 className="w-5 h-5 text-secondary" /> Base Científica
              </div>
            </motion.div>
          </div>
          
        </div>
      </section>

      {/* 2. OFFER BAR (STICKY OR STATIC) */}
      {course.enrollment_closes_at && (
        <div className="bg-accent text-white py-4 shadow-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              OFERTA POR TEMPO LIMITADO
            </div>
            <Countdown targetDate={course.enrollment_closes_at} />
            <p>Garanta a sua inscrição antes que esgote.</p>
          </div>
        </div>
      )}

      {/* 3. CLINICAL RESULTS */}
      <section className="py-24 bg-site-bg border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-site-text mb-4">Resultados Clínicos Observados</h2>
            <p className="text-site-text-muted max-w-2xl mx-auto">Dados coletados de um grupo de controlo de 500 participantes após o ciclo completo de 14 dias do protocolo BioReset.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-surface p-8 rounded-3xl shadow-sm border border-surface-border flex flex-col items-center">
              <div className="w-full flex justify-between items-start">
                <span className="font-bold text-site-text">Níveis de Energia</span>
                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">+30%</span>
              </div>
              <BarChart />
              <p className="text-sm text-site-text-muted mt-6 text-center">Aumento progressivo de vitalidade reportado.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-surface p-8 rounded-3xl shadow-sm border border-surface-border flex flex-col items-center">
              <div className="w-full flex justify-between items-start">
                <span className="font-bold text-site-text">Redução de Inchaço</span>
                <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">-92%</span>
              </div>
              <DonutChart />
              <p className="text-sm text-site-text-muted mt-6 text-center">Participantes relataram redução visível do inchaço abdominal.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-surface p-8 rounded-3xl shadow-sm border border-surface-border flex flex-col items-center">
              <div className="w-full flex justify-between items-start">
                <span className="font-bold text-site-text">Qualidade do Sono</span>
                <span className="text-xs font-bold text-purple-500 bg-purple-500/10 px-2 py-1 rounded">Melhora</span>
              </div>
              <LineChart />
              <p className="text-sm text-site-text-muted mt-6 text-center">Sono 42% mais profundo e reparador após a 1ª semana.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. CURRICULUM / MODULES */}
      {modules && modules.length > 0 && (
        <section className="py-24 bg-site-bg">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              <div className="lg:w-1/3">
                <h2 className="text-3xl font-extrabold text-site-text mb-6">Conteúdo Programático</h2>
                <p className="text-site-text-muted leading-relaxed mb-8">
                  Uma jornada estruturada passo a passo para garantir que você domina cada pilar da sua saúde metabólica.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-site-text font-medium">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs">
                      {modules.length}
                    </div>
                    Módulos Estratégicos
                  </div>
                  <div className="flex items-center gap-3 text-site-text font-medium">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                      <Battery className="w-4 h-4" />
                    </div>
                    Foco em Vitalidade
                  </div>
                </div>
              </div>
              
              <div className="lg:w-2/3 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {modules.map((mod, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-surface p-6 rounded-2xl border border-surface-border">
                      <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                      </div>
                      <h3 className="font-bold text-site-text mb-2">{mod.title}</h3>
                      <p className="text-sm text-site-text-muted leading-relaxed">{mod.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. CALL TO ACTION / SUBSCRIPTION */}
      <section className="py-24 bg-surface border-y border-surface-border relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl opacity-50" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-site-text mb-6">Pronto para dar o próximo passo?</h2>
            <p className="text-lg text-site-text-muted leading-relaxed mb-10 max-w-2xl mx-auto">
              Junte-se a centenas de pessoas que já transformaram a sua saúde com o {course.title}. Não deixe para amanhã a vitalidade que pode conquistar hoje.
            </p>
            
            <a 
              href={course.buy_url || '#'} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-secondary hover:bg-secondary-light text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-secondary/20 hover:shadow-secondary/40 hover:-translate-y-1 inline-flex items-center justify-center gap-3 group text-xl w-full sm:w-auto"
            >
              Inscrever-me Agora
              <ArrowLeft className="w-6 h-6 rotate-135 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-site-text-muted font-medium">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-secondary" /> Acesso Imediato</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-secondary" /> Suporte Dedicado</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-secondary" /> Pagamento Seguro</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. SUCCESS STORIES */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-24 bg-surface-hero border-y border-surface-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-site-text mb-4">Histórias de Sucesso</h2>
              <p className="text-site-text-muted max-w-2xl mx-auto">Veja o que dizem aqueles que transformaram sua saúde e vitalidade com o método.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testim, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-surface p-8 rounded-3xl shadow-sm border border-surface-border flex flex-col justify-between">
                  <div>
                    <Quote className="w-8 h-8 text-secondary/20 mb-6" />
                    <div className="flex gap-1 mb-4">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="text-site-text italic mb-8 leading-relaxed">"{testim.quote}"</p>
                  </div>
                  <div className="flex items-center gap-4 border-t border-surface-border pt-6">
                    {testim.image_url ? (
                      <img src={testim.image_url} alt={testim.author} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-surface-muted flex items-center justify-center font-bold text-site-text-muted text-lg">
                        {testim.author.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-site-text text-sm">{testim.author}</h4>
                      <p className="text-xs text-site-text-muted">{testim.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. GUARANTEE */}
      <section className="py-24 bg-secondary/[0.03] dark:bg-secondary/[0.05] border-y border-secondary/10">
        <div className="max-w-3xl mx-auto px-6 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mb-8">
            <ShieldCheck className="w-10 h-10 text-secondary" />
          </div>
          <h2 className="text-3xl font-extrabold text-site-text mb-6">Garantia Incondicional de 30 Dias</h2>
          <p className="text-site-text-muted leading-relaxed mb-8">
            Temos tanta confiança na eficácia do método que assumimos todo o risco. Se você aplicar o protocolo e não sentir diferença na sua energia e inchaço, devolvemos 100% do seu investimento sem perguntas.
          </p>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-600 font-medium rounded-full text-sm">
            <CheckCircle2 className="w-4 h-4" /> Compra Segura e Protegida
          </span>
          <a href={course.buy_url || '#'} target="_blank" rel="noopener noreferrer" className="bg-secondary hover:bg-secondary-light text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-lg hover:-translate-y-1 mt-10 text-xl w-full sm:w-auto">
            Quero Começar Agora
          </a>
        </div>
      </section>

      {/* 7. RICH TEXT DETAILS (If any extra content is provided) */}
      {(cleanHTML || course.secondary_image_url) && (
        <section className="py-24 bg-site-bg border-t border-surface-border relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
              
              {/* Left Side: Secondary Image */}
              {course.secondary_image_url && (
                <div className="w-full lg:w-5/12 lg:sticky lg:top-32 relative">
                  <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative rounded-3xl overflow-hidden shadow-xl shadow-secondary/10 aspect-square max-w-md mx-auto lg:mx-0 border-8 border-surface bg-surface">
                    <img src={course.secondary_image_url} alt="Detalhes do curso" className="w-full h-full object-contain" />
                  </motion.div>
                </div>
              )}

              {/* Right Side: Rich Text with Premium Card Look */}
              {cleanHTML && (
                <div className={`w-full ${course.secondary_image_url ? 'lg:w-7/12' : 'max-w-4xl mx-auto'}`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }}
                    className="bg-surface rounded-[2rem] p-8 md:p-12 shadow-xl shadow-surface-border/50 border border-surface-border relative mt-8 lg:mt-0"
                  >
                    <div className="absolute -top-5 left-8 lg:left-12 bg-accent text-white px-6 py-1.5 rounded-full text-xs font-bold tracking-widest shadow-lg shadow-accent/20 uppercase">
                      Detalhes do Programa
                    </div>
                    
                    <div 
                      className="prose prose-lg max-w-none text-site-text-muted prose-headings:text-site-text prose-a:text-secondary hover:prose-a:text-secondary-light prose-headings:font-extrabold prose-h2:text-3xl prose-h2:mt-2 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-surface-border prose-h3:text-2xl prose-p:leading-relaxed prose-ul:list-none prose-ul:pl-0 prose-li:relative prose-li:pl-6 prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-[0.6em] prose-li:before:w-2 prose-li:before:h-2 prose-li:before:bg-secondary prose-li:before:rounded-full break-words [&_*]:!text-site-text [&_a]:!text-secondary! [&_*]:!bg-transparent"
                      dangerouslySetInnerHTML={{ __html: cleanHTML }}
                    />
                  </motion.div>
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* 8. COMMENTS SECTION */}
      <div className="pb-32 px-6">
        <CourseComments courseId={course.id} />
      </div>
    </div>
  );
};
