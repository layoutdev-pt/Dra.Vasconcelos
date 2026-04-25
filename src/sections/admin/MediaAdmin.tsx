import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import { Plus, Pencil, Trash2, Save, X, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MediaEntry } from '../../types/media';

/* ─── FUNÇÃO DE NOTIFICAÇÃO GLOBAL ───────────────────────────────────────── */

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
    console.error('Erro ao disparar notificações de Media:', err);
  }
};

/* ─── ESTILOS REUTILIZÁVEIS ────────────────────────────────────────────── */

const inputCls = 'w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all';
const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

/* ─── MODAL DE MEDIA (MEDIA MODAL) ───────────────────────────────────────── */

const MediaModal: React.FC<{ mediaUrl: MediaEntry | null; onClose: () => void; onSaved: () => void }> = ({ mediaUrl, onClose, onSaved }) => {
  const [draft, setDraft] = useState<Partial<MediaEntry>>(mediaUrl ? { ...mediaUrl } : { title: '', type: 'video', external_url: '', image_url: '', published_at: new Date().toISOString().split('T')[0] });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof MediaEntry>(key: K, value: any) => setDraft(d => ({ ...d, [key]: value }));

  const handleSave = async () => {
    if (!draft.title?.trim() || !draft.external_url?.trim()) { 
      setError('Título e Link são obrigatórios.'); 
      return; 
    }
    setSaving(true); 
    setError(null);
    
    try {
      let finalImageUrl = draft.image_url;
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage.from('media').upload(`media_covers/${fileName}`, coverFile);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path);
        finalImageUrl = publicUrl;
      }

      const payload = {
        title: draft.title,
        type: draft.type as MediaEntry['type'],
        external_url: draft.external_url,
        image_url: finalImageUrl || null,
        published_at: draft.published_at ? new Date(draft.published_at).toISOString() : null
      };

      const isNew = !mediaUrl;

      const { error: dbErr } = mediaUrl
        ? await supabase.from('media').update(payload).eq('id', mediaUrl.id)
        : await supabase.from('media').insert(payload);
        
      if (dbErr) throw dbErr;

      if (isNew) {
        await notifyAllUsers(
          '📺 Dra. Alexandra nos Média!',
          `Nova publicação disponível: "${payload.title}". Veja agora!`,
          payload.external_url || '/media'
        );
      }

      onSaved(); 
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao guardar registo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-xl">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-primary">{mediaUrl ? 'Editar Aparição' : 'Adicionar Nova Aparição Media'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="px-8 py-6 space-y-5">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2"><AlertCircle className="w-4 h-4"/>{error}</div>}
          
          <div><label className={labelCls}>Título da Publicação / Entrevista *</label><input className={inputCls} placeholder="Ex: Entrevista na SIC Notícias" value={draft.title} onChange={e => set('title', e.target.value)} /></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Categoria</label>
              <select className={inputCls} value={draft.type} onChange={e => set('type', e.target.value)}>
                <option value="video">Vídeo (TV / YouTube)</option>
                <option value="artigo">Artigo Escrito</option>
                <option value="podcast">Podcast</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Data</label>
              <input type="date" className={inputCls} value={draft.published_at?.split('T')[0] || ''} onChange={e => set('published_at', e.target.value)} />
            </div>
          </div>
          
          <div><label className={labelCls}>Link Externo *</label><input className={inputCls} placeholder="https://youtube.com/..." value={draft.external_url} onChange={e => set('external_url', e.target.value)} /></div>
          
          <div>
            <label className={labelCls}>Capa / Miniatura</label>
            <input type="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-secondary cursor-pointer" onChange={e => setCoverFile(e.target.files?.[0] || null)} />
            
            {/* CORREÇÃO DA LINHA 136 ABAIXO: Usamos ?? undefined para evitar o erro de 'null' */}
            {(coverFile || draft.image_url) && (
              <div className="mt-3 w-32 h-20 rounded-xl overflow-hidden border border-gray-100 shadow-sm relative">
                <img 
                  src={coverFile ? URL.createObjectURL(coverFile) : (draft.image_url ?? undefined)} 
                  alt="preview" 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-bold disabled:opacity-60 flex items-center gap-2 transition-all">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? 'A guardar...' : 'Guardar'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── LISTAGEM DE MEDIA (MEDIA ADMIN MAIN) ───────────────────────────────── */

export const MediaAdmin: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMedia, setEditingMedia] = useState<MediaEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('media')
      .select('*')
      .order('published_at', { ascending: false })
      .order('created_at', { ascending: false });
    setMediaList(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchMedia(); }, []);

  const deleteMedia = async (id: string) => {
    if(!window.confirm('Tem a certeza que deseja apagar esta referência dos Média?')) return;
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (!error) fetchMedia();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-primary">Media & Imprensa</h3>
        <button onClick={() => { setEditingMedia(null); setIsModalOpen(true); }} className="px-4 py-2 bg-secondary text-white rounded-xl font-semibold flex items-center gap-2 shadow-md shadow-secondary/20 hover:-translate-y-0.5 transition-all">
          <Plus className="w-4 h-4" /> Adicionar Link
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-secondary" /></div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Título</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mediaList.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-primary">{m.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-400 text-[10px] font-bold uppercase rounded-full tracking-wider">
                        {m.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {m.published_at ? new Date(m.published_at).toLocaleDateString('pt-PT') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setEditingMedia(m); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-secondary bg-white shadow-sm border border-gray-100 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteMedia(m.id)} className="p-2 text-gray-400 hover:text-red-500 bg-white shadow-sm border border-gray-100 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {mediaList.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">Nenhum registo nos média encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <AnimatePresence>
        {isModalOpen && (
          <MediaModal 
            mediaUrl={editingMedia} 
            onClose={() => setIsModalOpen(false)} 
            onSaved={fetchMedia} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};