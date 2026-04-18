import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import { Plus, Pencil, Trash2, Save, X, Loader2, AlertCircle } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { motion, AnimatePresence } from 'framer-motion';
import type { BlogPost } from '../../types/blog';

// Quill Modules for Rich Text formatting
const quillModules = {
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

const inputCls = 'w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all';
const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

const Toggle: React.FC<{ value: boolean; onChange: (v: boolean) => void; label: string }> = ({ value, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${value ? 'bg-secondary' : 'bg-gray-200'}`} onClick={() => onChange(!value)}>
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${value ? 'left-6' : 'left-1'}`} />
    </div>
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </label>
);

const BlogModal: React.FC<{ post: BlogPost | null; onClose: () => void; onSaved: () => void }> = ({ post, onClose, onSaved }) => {
  const [draft, setDraft] = useState<Partial<BlogPost>>(post ? { ...post } : { title: '', slug: '', summary: '', content: '', category: 'Artigo', is_published: true, image_url: '' });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof BlogPost>(key: K, value: any) => setDraft(d => ({ ...d, [key]: value }));

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    set('title', title);
    if (!post) set('slug', generateSlug(title));
  };

  const handleSave = async () => {
    if (!draft.title?.trim() || !draft.category?.trim()) { setError('Título e Categoria são obrigatórios.'); return; }
    setSaving(true); setError(null);
    
    let finalImageUrl = draft.image_url;
    if (coverFile) {
      const fileExt = coverFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage.from('media').upload(`blog/${fileName}`, coverFile);
      if (uploadError) { setError(`Erro upload: ${uploadError.message}`); setSaving(false); return; }
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path);
      finalImageUrl = publicUrl;
    }

    const payload = {
      title: draft.title,
      slug: draft.slug || generateSlug(draft.title),
      summary: draft.summary || null,
      content: draft.content || null,
      category: draft.category,
      image_url: finalImageUrl || null,
      is_published: draft.is_published ?? true,
      published_at: draft.is_published ? new Date().toISOString() : null,
    };

    const { error: dbErr } = post
      ? await supabase.from('posts').update(payload).eq('id', post.id)
      : await supabase.from('posts').insert(payload);
      
    if (dbErr) { setError(dbErr.message); setSaving(false); return; }
    onSaved(); onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-primary">{post ? 'Editar Artigo' : 'Novo Artigo'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="px-8 py-6 space-y-5 overflow-y-auto grow">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2"><AlertCircle className="w-4 h-4"/>{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Título *</label><input className={inputCls} value={draft.title} onChange={handleTitleChange} /></div>
            <div><label className={labelCls}>Link Amigável (Slug)</label><input className={inputCls} value={draft.slug} onChange={e => set('slug', e.target.value)} /></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Categoria *</label><input className={inputCls} placeholder="Nutrição, Bem-estar..." value={draft.category} onChange={e => set('category', e.target.value)} /></div>
            <div>
              <label className={labelCls}>Imagem de Capa</label>
              <input type="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-secondary hover:file:bg-gray-100 transition-all cursor-pointer" onChange={e => setCoverFile(e.target.files?.[0] || null)} />
            </div>
          </div>

          <div><label className={labelCls}>Resumo do Artigo</label><textarea className={`${inputCls} resize-none`} rows={2} value={draft.summary || ''} onChange={e => set('summary', e.target.value)} /></div>

          <div className="flex-1 pb-16">
            <label className={labelCls}>Corpo do Artigo</label>
            <ReactQuill theme="snow" modules={quillModules} value={draft.content || ''} onChange={val => set('content', val)} className="bg-white border-gray-200 h-64" />
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex gap-6">
            <Toggle value={draft.is_published ?? true} onChange={v => set('is_published', v)} label="Publicar Imediatamente" />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-bold disabled:opacity-60 flex items-center gap-2 shadow-md">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? 'Guardar...' : 'Guardar Artigo'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const BlogAdmin: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const deletePost = async (id: string) => {
    if(!window.confirm('Quer mesmo apagar este artigo do blog?')) return;
    await supabase.from('posts').delete().eq('id', id);
    fetchPosts();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Gerir Blog</h3>
        <button onClick={() => { setEditingPost(null); setIsModalOpen(true); }} className="px-4 py-2 bg-secondary text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-opacity-90">
          <Plus className="w-4 h-4" /> Escrever Artigo
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-secondary" /></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Artigo</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-semibold text-primary">{p.title}</td>
                  <td className="px-6 py-4"><span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{p.category}</span></td>
                  <td className="px-6 py-4">
                    {p.is_published 
                      ? <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">Publicado</span> 
                      : <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-xs font-bold">Rascunho</span>}
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    <button onClick={() => { setEditingPost(p); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-secondary bg-white shadow-sm border border-gray-100 rounded-lg"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => deletePost(p.id)} className="p-2 text-gray-400 hover:text-red-500 bg-white shadow-sm border border-gray-100 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Ainda não existem artigos. Escreve o teu primeiro!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      <AnimatePresence>
        {isModalOpen && <BlogModal post={editingPost} onClose={() => setIsModalOpen(false)} onSaved={fetchPosts} />}
      </AnimatePresence>
    </div>
  );
};
