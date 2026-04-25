import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Plus, Pencil, Trash2, Eye, EyeOff, X, Save, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../config/supabase';
import type { Course } from '../../types/course';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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

const activeQuillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['clean']
  ]
};

/* ─── FUNÇÃO DE NOTIFICAÇÃO ─────────────────────────────────────────────── */

const notifyAllUsers = async (title: string, message: string, link: string) => {
  try {
    // 1. Vai buscar todos os IDs de utilizadores registrados
    const { data: profiles } = await supabase.from('profiles').select('id');
    if (!profiles || profiles.length === 0) return;

    // 2. Prepara o array de notificações
    const notifications = profiles.map(profile => ({
      user_id: profile.id,
      title,
      message,
      link,
      is_read: false
    }));

    // 3. Insere na tabela 'notifications'
    await supabase.from('notifications').insert(notifications);
  } catch (err) {
    console.error('Erro ao processar notificações globais:', err);
  }
};

/* ─── MODAL DE CURSO (COURSE MODAL) ─────────────────────────────────────── */

type CourseDraft = Omit<Course, 'id' | 'created_at'>;
const emptyCourse = (): CourseDraft => ({
  title: '', subtitle: null, description: '', content: '', image_url: '',
  type: 'curso', level: null, modules: null, price: null, buy_url: null, 
  is_featured: false, is_published: true,
  published_at: new Date().toISOString(),
});

const CourseModal: React.FC<{ course: Course | null; onClose: () => void; onSaved: () => void }> = ({ course, onClose, onSaved }) => {
  const [draft, setDraft] = useState<CourseDraft>(course ? { ...course, content: course.content || '' } : emptyCourse());
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof CourseDraft>(key: K, value: CourseDraft[K]) =>
    setDraft(d => ({ ...d, [key]: value }));

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

      const payload = { 
        ...draft, 
        image_url: finalImageUrl, 
        subtitle: draft.subtitle?.trim() || null, 
        buy_url: draft.buy_url?.trim() || null, 
        price: draft.price ?? null, 
        level: draft.level?.trim() || null, 
        modules: draft.modules ?? null,
        published_at: draft.published_at ? new Date(draft.published_at).toISOString() : null
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
          '/aprender'
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
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
          <h2 className="text-lg font-bold text-primary">{course ? 'Editar Curso' : 'Adicionar Curso'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1"><X className="w-5 h-5" /></button>
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mx-8 mt-4 flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" /><p className="text-sm text-red-600">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-8 py-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Título *</label><input className={inputCls} value={draft.title} onChange={e => set('title', e.target.value)} placeholder="Ex: BioReset" /></div>
            <div><label className={labelCls}>Subtítulo</label><input className={inputCls} value={draft.subtitle ?? ''} onChange={e => set('subtitle', e.target.value || null)} placeholder="Opcional" /></div>
          </div>
          
          <div><label className={labelCls}>Descrição Curta *</label><textarea className={`${inputCls} resize-none`} rows={3} value={draft.description} onChange={e => set('description', e.target.value)} /></div>
          
          <div>
            <label className={labelCls}>Conteúdo da Landing Page</label>
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
              <ReactQuill theme="snow" modules={activeQuillModules} value={draft.content || ''} onChange={val => set('content', val)} className="h-64 border-none" />
            </div>
            <p className="text-[10px] text-gray-400 mt-12 text-right">Construa o detalhe do curso aqui.</p>
          </div>

          <div>
            <label className={labelCls}>Capa do Curso</label>
            <input type="file" accept="image/*" className="w-full text-sm text-gray-500 cursor-pointer" onChange={e => { const file = e.target.files?.[0]; if (file) setCoverFile(file); }} />
            {(coverFile || draft.image_url) && (
              <div className="mt-3 w-32 h-20 rounded-lg overflow-hidden border border-gray-100 shadow-sm relative">
                <img src={coverFile ? URL.createObjectURL(coverFile) : draft.image_url} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Tipo</label>
              <select className={inputCls} value={draft.type} onChange={e => set('type', e.target.value as Course['type'])}>
                <option value="curso">Curso Online</option>
                <option value="programa">Programa ao Vivo</option>
              </select>
            </div>
            <div><label className={labelCls}>Preço (€)</label><input type="number" step="0.01" className={inputCls} value={draft.price ?? ''} onChange={e => set('price', e.target.value ? parseFloat(e.target.value) : null)} /></div>
            <div><label className={labelCls}>Link Externo</label><input className={inputCls} value={draft.buy_url ?? ''} onChange={e => set('buy_url', e.target.value || null)} /></div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <Toggle value={draft.is_featured} onChange={v => set('is_featured', v)} label="Destaque" />
            <Toggle value={draft.is_published} onChange={v => set('is_published', v)} label="Publicado" />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-3xl">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl bg-secondary text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-secondary/20">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'A guardar...' : 'Guardar Curso'}
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
            <h2 className="text-xl font-bold text-primary">Cursos & Programas</h2>
            <p className="text-sm text-gray-400">{courses.length} itens no total</p>
          </div>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-primary/20">
          <Plus className="w-4 h-4" /> Novo Curso
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-7 h-7 text-primary animate-spin" /></div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <GraduationCap className="w-10 h-10 text-gray-200" />
            <p className="text-gray-400 font-light">Nenhum curso ainda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Imagem</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Título</th>
                  <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase">Tipo</th>
                  <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase">Estado</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {courses.map(course => (
                  <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                        {course.image_url ? <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><GraduationCap className="w-4 h-4 text-primary/40" /></div>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-primary truncate max-w-[200px]">{course.title}</p>
                      {course.is_featured && <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase">Destaque</span>}
                    </td>
                    <td className="px-4 py-4 uppercase text-[10px] font-bold text-gray-400">{course.type}</td>
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
          <CourseModal course={editing} onClose={() => setModalOpen(false)} onSaved={() => { fetch(); showToast('Guardado com sucesso!'); }} />
        )}
      </AnimatePresence>
    </>
  );
};