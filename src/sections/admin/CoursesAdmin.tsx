import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Plus, Pencil, Trash2, Eye, EyeOff, X, Save, AlertCircle, Loader2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../config/supabase';
import type { Course } from '../../types/course';
import RichTextEditor from '../../components/RichTextEditor';

/* ─── ESTILOS REUTILIZÁVEIS ────────────────────────────────────────────── */

const inputCls = 'w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all';
const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

/* ─── COMPONENTES AUXILIARES ───────────────────────────────────────────── */

const Toggle: React.FC<{ value: boolean; onChange: (v: boolean) => void; label: string }> = ({ value, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div
      className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${value ? 'bg-secondary' : 'bg-gray-200'}`}
      onClick={() => onChange(!value)}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${value ? 'left-6' : 'left-1'}`} />
    </div>
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </label>
);



export type CourseModule = { title: string; description: string };
export type CourseTestimonial = { quote: string; author: string; role: string; image_url: string };

export type CourseContentData = {
  html: string;
  modules: CourseModule[];
  testimonials: CourseTestimonial[];
};

type CourseDraft = Omit<Course, 'id' | 'created_at'> & {
  parsedContent: CourseContentData;
};

/* ─── FUNÇÃO DE NOTIFICAÇÃO ─────────────────────────────────────────────── */

const notifyAllUsers = async (title: string, message: string, link: string) => {
  try {
    const { data: profiles } = await supabase.from('profiles').select('id');
    if (!profiles || profiles.length === 0) return;

    const notifications = profiles.map(profile => ({
      user_id: profile.id,
      title,
      message,
      link,
      is_read: false
    }));

    await supabase.from('notifications').insert(notifications);
  } catch (err) {
    console.error('Erro ao processar notificações globais:', err);
  }
};

/* ─── MODAL DE CURSO (COURSE MODAL) ─────────────────────────────────────── */

const emptyCourse = (): CourseDraft => ({
  title: '', subtitle: null, slug: null, description: '', content: '', image_url: '', secondary_image_url: '',
  type: 'curso', level: null, modules: null, price: null, buy_url: null, 
  is_featured: false, is_published: true,
  published_at: new Date().toISOString(),
  enrollment_closes_at: null,
  parsedContent: { html: '', modules: [], testimonials: [] }
});

const parseContent = (contentStr: string): CourseContentData => {
  if (!contentStr) return { html: '', modules: [], testimonials: [] };
  try {
    if (contentStr.trim().startsWith('{')) {
      const parsed = JSON.parse(contentStr);
      if (parsed.html !== undefined) return parsed;
    }
  } catch (e) {
    // Ignore, it's just html
  }
  return { html: contentStr, modules: [], testimonials: [] };
};

const CourseModal: React.FC<{ course: Course | null; onClose: () => void; onSaved: () => void }> = ({ course, onClose, onSaved }) => {
  const [draft, setDraft] = useState<CourseDraft>(() => {
    if (course) {
      return { ...course, parsedContent: parseContent(course.content) };
    }
    return emptyCourse();
  });
  
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [secondaryFile, setSecondaryFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'geral' | 'modulos' | 'testemunhos'>('geral');

  const set = <K extends keyof CourseDraft>(key: K, value: CourseDraft[K]) =>
    setDraft(d => ({ ...d, [key]: value }));

  const setParsedContent = <K extends keyof CourseContentData>(key: K, value: CourseContentData[K]) => {
    setDraft(d => ({ ...d, parsedContent: { ...d.parsedContent, [key]: value } }));
  };

  const handleSave = async () => {
    if (!draft.title.trim() || !draft.description.trim()) { setError('Título e descrição são obrigatórios.'); return; }
    setSaving(true); setError(null);

    try {
      let finalImageUrl = draft.image_url;
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage.from('media').upload(`courses/${fileName}`, coverFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path);
        finalImageUrl = publicUrl;
      }

      let finalSecondaryUrl = draft.secondary_image_url;
      if (secondaryFile) {
        const fileExt = secondaryFile.name.split('.').pop();
        const fileName = `sec_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage.from('media').upload(`courses/${fileName}`, secondaryFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path);
        finalSecondaryUrl = publicUrl;
      }

      const finalContentStr = JSON.stringify(draft.parsedContent);

      const payload = { 
        title: draft.title,
        description: draft.description,
        content: finalContentStr,
        image_url: finalImageUrl, 
        secondary_image_url: finalSecondaryUrl,
        subtitle: draft.subtitle?.trim() || null, 
        slug: draft.slug?.trim() || null,
        buy_url: draft.buy_url?.trim() || null, 
        price: draft.price ?? null, 
        level: draft.level?.trim() || null, 
        modules: draft.modules ?? null,
        type: draft.type,
        is_featured: draft.is_featured,
        is_published: draft.is_published,
        published_at: draft.published_at ? new Date(draft.published_at).toISOString() : null,
        enrollment_closes_at: draft.enrollment_closes_at ? new Date(draft.enrollment_closes_at).toISOString() : null
      };

      const isNew = !course;

      const { error: dbErr } = course
        ? await supabase.from('courses').update(payload).eq('id', course.id)
        : await supabase.from('courses').insert(payload);

      if (dbErr) throw dbErr;

      // DISPARAR NOTIFICAÇÃO APENAS SE FOR NOVO E PUBLICADO
      if (isNew && draft.is_published) {
        await notifyAllUsers(
          '🎓 Novo Curso Disponível!',
          `Acabámos de publicar o curso: ${draft.title}. Já podes conferir os detalhes.`,
          '/cursos'
        );
      }

      onSaved(); 
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao guardar curso.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.25 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white z-10 shrink-0">
          <h2 className="text-lg font-bold text-primary">{course ? 'Editar Curso' : 'Adicionar Curso'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex border-b border-gray-100 px-8 shrink-0 bg-gray-50/50">
          {[
            { id: 'geral', label: 'Info Geral' },
            { id: 'modulos', label: 'Conteúdo Programático' },
            { id: 'testemunhos', label: 'Histórias de Sucesso' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="px-8 py-6 overflow-y-auto flex-1">
          <AnimatePresence>
            {error && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-4 flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" /><p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab === 'geral' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Título *</label>
                  <input 
                    className={inputCls} 
                    value={draft.title} 
                    onChange={e => {
                      const val = e.target.value;
                      set('title', val);
                      if (!course) set('slug', val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                    }} 
                    placeholder="Ex: BioReset — Programa de 14 Dias" 
                  />
                </div>
                <div><label className={labelCls}>Subtítulo</label><input className={inputCls} value={draft.subtitle ?? ''} onChange={e => set('subtitle', e.target.value || null)} placeholder="Subtítulo opcional" /></div>
                <div><label className={labelCls}>Softlink / Slug (URL)</label><input className={inputCls} value={draft.slug ?? ''} onChange={e => set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder="ex: bioreset-14-dias" /></div>
              </div>
              <div><label className={labelCls}>Descrição Curta *</label><textarea className={`${inputCls} resize-vertical`} rows={5} value={draft.description} onChange={e => set('description', e.target.value)} placeholder="Recupere sua vitalidade biológica e elimine o inchaço..." /></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Capa da Landing Page (Principal)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-secondary hover:file:bg-gray-100 transition-all cursor-pointer"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) setCoverFile(file);
                    }} 
                  />
                  {(draft.image_url || coverFile) && (
                    <div className="mt-3 w-full h-32 rounded-lg overflow-hidden border border-gray-100 shadow-sm relative group">
                      <img src={coverFile ? URL.createObjectURL(coverFile) : draft.image_url} alt="preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                </div>
                <div>
                  <label className={labelCls}>Segunda Foto (1:1)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-secondary hover:file:bg-gray-100 transition-all cursor-pointer"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) setSecondaryFile(file);
                    }} 
                  />
                  {(draft.secondary_image_url || secondaryFile) && (
                    <div className="mt-3 w-32 h-32 rounded-lg overflow-hidden border border-gray-100 shadow-sm relative group mx-auto md:mx-0">
                      <img src={secondaryFile ? URL.createObjectURL(secondaryFile) : draft.secondary_image_url!} alt="preview sec" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Tipo</label>
                  <select className={inputCls} value={draft.type} onChange={e => set('type', e.target.value as Course['type'])}>
                    <option value="curso">Curso Online</option>
                    <option value="programa">Programa ao Vivo</option>
                    <option value="presencial">Presencial</option>
                  </select>
                </div>
                <div><label className={labelCls}>Preço (€)</label><input type="number" step="0.01" min="0" className={inputCls} value={draft.price ?? ''} onChange={e => set('price', e.target.value ? parseFloat(e.target.value) : null)} placeholder="97.00" /></div>
                <div><label className={labelCls}>Link Checkout</label><input className={inputCls} value={draft.buy_url ?? ''} onChange={e => set('buy_url', e.target.value || null)} placeholder="https://pay..." /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelCls}>Data de Publicação</label><input type="datetime-local" className={inputCls} value={draft.published_at ? new Date(new Date(draft.published_at).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''} onChange={e => set('published_at', e.target.value ? new Date(e.target.value).toISOString() : null)} /></div>
                <div><label className={labelCls}>Fecho das Inscrições (Countdown)</label><input type="datetime-local" className={inputCls} value={draft.enrollment_closes_at ? new Date(new Date(draft.enrollment_closes_at).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''} onChange={e => set('enrollment_closes_at', e.target.value ? new Date(e.target.value).toISOString() : null)} /></div>
              </div>

              <div>
                <label className={labelCls}>Conteúdo Detalhado Opcional (Fica no final da página)</label>
                <RichTextEditor value={draft.parsedContent.html || ''} onChange={val => setParsedContent('html', val)} placeholder="Escreva o conteúdo detalhado do curso…" minHeight="24rem" />
              </div>

              <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-100">
                <Toggle value={draft.is_featured} onChange={v => set('is_featured', v)} label="Em Destaque" />
                <Toggle value={draft.is_published} onChange={v => set('is_published', v)} label="Publicado" />
              </div>
            </div>
          )}

          {activeTab === 'modulos' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-gray-700">Grelha de Conteúdo Programático</h3>
                <button 
                  onClick={() => setParsedContent('modules', [...draft.parsedContent.modules, { title: '', description: '' }])}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Adicionar Módulo
                </button>
              </div>
              {draft.parsedContent.modules.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Nenhum módulo adicionado.</p>
              ) : (
                <div className="space-y-3">
                  {draft.parsedContent.modules.map((mod, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl relative group">
                      <div className="flex-1 space-y-3">
                        <input 
                          className={inputCls} 
                          placeholder="Ex: Detoxificação Celular" 
                          value={mod.title}
                          onChange={(e) => {
                            const newMods = [...draft.parsedContent.modules];
                            newMods[index].title = e.target.value;
                            setParsedContent('modules', newMods);
                          }}
                        />
                        <textarea 
                          className={`${inputCls} resize-none`} rows={2}
                          placeholder="Como ativar os seus motores de limpeza..."
                          value={mod.description}
                          onChange={(e) => {
                            const newMods = [...draft.parsedContent.modules];
                            newMods[index].description = e.target.value;
                            setParsedContent('modules', newMods);
                          }}
                        />
                      </div>
                      <button 
                        onClick={() => {
                          const newMods = [...draft.parsedContent.modules];
                          newMods.splice(index, 1);
                          setParsedContent('modules', newMods);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'testemunhos' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-gray-700">Histórias de Sucesso</h3>
                <button 
                  onClick={() => setParsedContent('testimonials', [...draft.parsedContent.testimonials, { quote: '', author: '', role: '', image_url: '' }])}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Adicionar Testemunho
                </button>
              </div>
              {draft.parsedContent.testimonials.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Nenhum testemunho adicionado.</p>
              ) : (
                <div className="space-y-3">
                  {draft.parsedContent.testimonials.map((testim, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                      <div className="flex-1 space-y-3">
                        <textarea 
                          className={`${inputCls} resize-none`} rows={2}
                          placeholder="O depoimento do aluno..."
                          value={testim.quote}
                          onChange={(e) => {
                            const newT = [...draft.parsedContent.testimonials];
                            newT[index].quote = e.target.value;
                            setParsedContent('testimonials', newT);
                          }}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input 
                            className={inputCls} placeholder="Nome do aluno (ex: Maria Silva)" 
                            value={testim.author}
                            onChange={(e) => {
                              const newT = [...draft.parsedContent.testimonials];
                              newT[index].author = e.target.value;
                              setParsedContent('testimonials', newT);
                            }}
                          />
                          <input 
                            className={inputCls} placeholder="Cargo ou Idade (ex: 42 anos)" 
                            value={testim.role}
                            onChange={(e) => {
                              const newT = [...draft.parsedContent.testimonials];
                              newT[index].role = e.target.value;
                              setParsedContent('testimonials', newT);
                            }}
                          />
                        </div>
                        <input 
                            className={inputCls} placeholder="URL da foto (opcional)" 
                            value={testim.image_url}
                            onChange={(e) => {
                              const newT = [...draft.parsedContent.testimonials];
                              newT[index].image_url = e.target.value;
                              setParsedContent('testimonials', newT);
                            }}
                          />
                      </div>
                      <button 
                        onClick={() => {
                          const newT = [...draft.parsedContent.testimonials];
                          newT.splice(index, 1);
                          setParsedContent('testimonials', newT);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-white shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-all disabled:opacity-60 flex items-center gap-2 shadow-md">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'A guardar...' : 'Guardar Alterações'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── PÁGINA DE ADMINISTRAÇÃO DE CURSOS ──────────────────────────────────── */

export const CoursesAdmin: React.FC<{ showToast: (m: string) => void }> = ({ showToast }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    setCourses((data as Course[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleToggle = async (c: Course) => {
    const { error } = await supabase.from('courses').update({ is_published: !c.is_published }).eq('id', c.id);
    if (!error) {
      showToast(c.is_published ? 'Curso ocultado.' : 'Curso publicado.');
      fetch();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Eliminar este curso?')) return;
    setDeletingId(id);
    const { error } = await supabase.from('courses').delete().eq('id', id);
    setDeletingId(null);
    if (!error) {
      showToast('Curso eliminado.');
      fetch();
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary">Landing Pages de Cursos</h2>
            <p className="text-sm text-gray-400">{courses.length} landing page{courses.length !== 1 ? 's' : ''} no total</p>
          </div>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all hover:-translate-y-0.5 shadow-md shadow-primary/20">
          <Plus className="w-4 h-4" /> Nova Página
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-7 h-7 text-primary animate-spin" /></div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <GraduationCap className="w-10 h-10 text-gray-200" />
            <p className="text-gray-400 font-light">Nenhuma página ainda. Clica em "Nova Página" para começar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Imagem</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Título</th>
                  <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase">Tipo</th>
                  <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase">Preço</th>
                  <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase">Estado</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {courses.map(course => (
                  <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-100 shadow-sm shrink-0">
                        {course.image_url ? <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"><GraduationCap className="w-4 h-4 text-primary/40" /></div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[240px]">
                      <p className="font-semibold text-primary truncate">{course.title}</p>
                      {course.subtitle && <p className="text-xs text-gray-400 truncate mt-0.5">{course.subtitle}</p>}
                      {course.is_featured && <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider">Destaque</span>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${course.type === 'programa' ? 'bg-purple-50 text-purple-600' : course.type === 'presencial' ? 'bg-amber-50 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                        {course.type === 'programa' ? 'Programa' : course.type === 'presencial' ? 'Presencial' : 'Curso'}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-primary">{course.price != null ? `${course.price.toFixed(2).replace('.', ',')}€` : '—'}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${course.is_published ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {course.is_published ? 'Publicado' : 'Oculto'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleToggle(course)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                          {course.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => { setEditing(course); setModalOpen(true); }} className="p-2 text-gray-400 hover:text-secondary transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(course.id)} disabled={deletingId === course.id} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          {deletingId === course.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <CourseModal course={editing} onClose={() => setModalOpen(false)} onSaved={() => { fetch(); showToast('Página guardada com sucesso!'); }} />
        )}
      </AnimatePresence>
    </>
  );
};