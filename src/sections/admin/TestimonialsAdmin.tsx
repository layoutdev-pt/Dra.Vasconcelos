import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import { Plus, Pencil, Trash2, Save, X, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Testimonial } from '../../types/testimonial';

const inputCls = 'w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all';
const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

const TestimonialModal: React.FC<{ testimonial: Testimonial | null; onClose: () => void; onSaved: () => void }> = ({ testimonial, onClose, onSaved }) => {
  const [draft, setDraft] = useState<Partial<Testimonial>>(testimonial ? { ...testimonial } : { student_name: '', feedback: '', avatar_url: '' });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof Testimonial>(key: K, value: any) => setDraft(d => ({ ...d, [key]: value }));

  const handleSave = async () => {
    if (!draft.student_name?.trim() || !draft.feedback?.trim()) { setError('Nome e feedback são obrigatórios.'); return; }
    setSaving(true); setError(null);
    
    let finalImageUrl = draft.avatar_url;
    if (coverFile) {
      const fileExt = coverFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage.from('media').upload(`testimonials/${fileName}`, coverFile);
      if (uploadError) { setError(`Erro upload da foto: ${uploadError.message}`); setSaving(false); return; }
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path);
      finalImageUrl = publicUrl;
    }

    const payload = {
      student_name: draft.student_name,
      feedback: draft.feedback,
      avatar_url: finalImageUrl || null
    };

    const { error: dbErr } = testimonial
      ? await supabase.from('testimonials').update(payload).eq('id', testimonial.id)
      : await supabase.from('testimonials').insert(payload);
      
    if (dbErr) { setError(dbErr.message); setSaving(false); return; }
    onSaved(); onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-xl">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-primary">{testimonial ? 'Editar Testemunho' : 'Adicionar Testemunho'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="px-8 py-6 space-y-5">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2"><AlertCircle className="w-4 h-4"/>{error}</div>}
          
          <div><label className={labelCls}>Nome do Aluno/Paciente *</label><input className={inputCls} placeholder="Maria D." value={draft.student_name} onChange={e => set('student_name', e.target.value)} /></div>
          
          <div><label className={labelCls}>Feedback *</label><textarea className={`${inputCls} resize-none`} rows={4} placeholder="Mudou a minha vida..." value={draft.feedback} onChange={e => set('feedback', e.target.value)} /></div>
          
          <div>
            <label className={labelCls}>Fotografia (Opcional)</label>
            <input type="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-secondary hover:file:bg-gray-100 transition-all cursor-pointer" onChange={e => setCoverFile(e.target.files?.[0] || null)} />
            
            {(coverFile || draft.avatar_url) && (
              <div className="mt-3 w-16 h-16 rounded-full overflow-hidden border border-gray-100 object-cover">
                <img src={coverFile ? URL.createObjectURL(coverFile) : draft.avatar_url!} alt="avatar" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-bold disabled:opacity-60 flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? 'Guardar...' : 'Guardar'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const TestimonialsAdmin: React.FC = () => {
  const [list, setList] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    setList(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const deleteItem = async (id: string) => {
    if(!window.confirm('Apagar permanentemente este Testemunho?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    fetchItems();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Testemunhos (Página Única)</h3>
        <button onClick={() => { setEditing(null); setIsModalOpen(true); }} className="px-4 py-2 bg-secondary text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-opacity-90">
          <Plus className="w-4 h-4" /> Adicionar Testemunho
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-secondary" /></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Excerto do Feedback</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.map(t => (
                <tr key={t.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-semibold text-primary flex items-center gap-3">
                    {t.avatar_url ? (
                      <img src={t.avatar_url} alt="" className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100" />
                    )}
                    {t.student_name}
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-sm truncate">{t.feedback}</td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    <button onClick={() => { setEditing(t); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-secondary bg-white shadow-sm border border-gray-100 rounded-lg"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => deleteItem(t.id)} className="p-2 text-gray-400 hover:text-red-500 bg-white shadow-sm border border-gray-100 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500">Nenhum testemunho configurado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      <AnimatePresence>
        {isModalOpen && <TestimonialModal testimonial={editing} onClose={() => setIsModalOpen(false)} onSaved={fetchItems} />}
      </AnimatePresence>
    </div>
  );
};
