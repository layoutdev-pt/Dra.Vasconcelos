import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Pencil, Trash2, Eye, EyeOff, X, Save, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../config/supabase';
import type { Book } from '../../types/book';

const inputCls = 'w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all';
const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

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

type BookDraft = Omit<Book, 'id' | 'created_at'>;
const emptyBook = (): BookDraft => ({
  title: '', subtitle: null, author: 'Alexandra Vasconcelos',
  description: null, cover_url: '', type: 'fisico',
  price: null, currency: 'EUR', buy_url: null, is_featured: false, is_published: true,
  published_at: new Date().toISOString(),
});

const BookModal: React.FC<{ book: Book | null; onClose: () => void; onSaved: () => void }> = ({ book, onClose, onSaved }) => {
  const [draft, setDraft] = useState<BookDraft>(book ? { ...book } : emptyBook());
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pubMonth, setPubMonth] = useState(draft.published_at ? new Date(draft.published_at).getMonth() : new Date().getMonth());
  const [pubYear, setPubYear] = useState(draft.published_at ? new Date(draft.published_at).getFullYear() : new Date().getFullYear());

  const set = <K extends keyof BookDraft>(key: K, value: BookDraft[K]) =>
    setDraft(d => ({ ...d, [key]: value }));

  const handleSave = async () => {
    if (!draft.title.trim()) { setError('O título é obrigatório.'); return; }
    setSaving(true); setError(null);
    
    let finalCoverUrl = draft.cover_url;
    if (coverFile) {
      const fileExt = coverFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage.from('media').upload(`books/${fileName}`, coverFile);
      if (uploadError) {
        setError(`Erro ao fazer upload da imagem: ${uploadError.message}`);
        setSaving(false); return;
      }
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path);
      finalCoverUrl = publicUrl;
    }

    const payload = { 
      ...draft, 
      cover_url: finalCoverUrl, 
      subtitle: draft.subtitle?.trim() || null, 
      buy_url: draft.buy_url?.trim() || null, 
      price: draft.price ?? null,
      currency: draft.currency || 'EUR',
      description: draft.description?.trim() || null,
      published_at: new Date(pubYear, pubMonth, 1).toISOString()
    };
    const { error: dbErr } = book
      ? await supabase.from('books').update(payload).eq('id', book.id)
      : await supabase.from('books').insert(payload);
    if (dbErr) { setError(dbErr.message); setSaving(false); return; }
    onSaved(); onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.25 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
          <h2 className="text-lg font-bold text-primary">{book ? 'Editar Livro' : 'Adicionar Livro'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1"><X className="w-5 h-5" /></button>
        </div>
        <AnimatePresence>
          {error && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mx-8 mt-4 flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" /><p className="text-sm text-red-600">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="px-8 py-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Título *</label><input className={inputCls} value={draft.title} onChange={e => set('title', e.target.value)} placeholder="Título do livro" /></div>
            <div><label className={labelCls}>Subtítulo</label><input className={inputCls} value={draft.subtitle ?? ''} onChange={e => set('subtitle', e.target.value || null)} placeholder="Subtítulo opcional" /></div>
          </div>
          <div><label className={labelCls}>Autor</label><input className={inputCls} value={draft.author} onChange={e => set('author', e.target.value)} /></div>
          <div><label className={labelCls}>Descrição (Opcional)</label><textarea className={`${inputCls} resize-none`} rows={3} value={draft.description ?? ''} onChange={e => set('description', e.target.value || null)} placeholder="Sinopse breve (aparecerá apenas no detalhe)..." /></div>
          <div>
            <label className={labelCls}>Capa do Livro</label>
            <input 
              type="file" 
              accept="image/*"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-secondary hover:file:bg-gray-100 transition-all cursor-pointer"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) setCoverFile(file);
              }} 
            />
            {(coverFile || draft.cover_url) && (
              <div className="mt-3 w-20 h-28 rounded-lg overflow-hidden border border-gray-100 shadow-sm relative group">
                <img 
                  src={coverFile ? URL.createObjectURL(coverFile) : draft.cover_url} 
                  alt="preview" 
                  className="w-full h-full object-cover" 
                  onError={e => (e.currentTarget.style.display = 'none')} 
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Mês de Publicação</label>
              <select className={inputCls} value={pubMonth} onChange={e => setPubMonth(parseInt(e.target.value))}>
                {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((m, i) => (
                  <option key={i} value={i}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Ano de Publicação</label>
              <input type="number" className={inputCls} value={pubYear} onChange={e => setPubYear(parseInt(e.target.value))} min="2000" max={new Date().getFullYear() + 2} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Tipo</label>
              <select className={inputCls} value={draft.type} onChange={e => set('type', e.target.value as Book['type'])}>
                <option value="fisico">Livro Físico</option>
                <option value="ebook">Ebook</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <label className={labelCls}>Preço</label>
              <div className="flex gap-2">
                <select className="w-20 px-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" value={draft.currency} onChange={e => set('currency', e.target.value as 'EUR' | 'BRL' | 'USD')}>
                  <option value="EUR">€</option>
                  <option value="BRL">R$</option>
                  <option value="USD">$</option>
                </select>
                <input type="number" step="0.01" min="0" className={inputCls} value={draft.price ?? ''} onChange={e => set('price', e.target.value ? parseFloat(e.target.value) : null)} placeholder="24.90" />
              </div>
            </div>
            <div><label className={labelCls}>Link de Compra</label><input className={inputCls} value={draft.buy_url ?? ''} onChange={e => set('buy_url', e.target.value || null)} placeholder="https://wook.pt/..." /></div>
          </div>
          <div className="flex flex-wrap gap-6">
            <Toggle value={draft.is_featured} onChange={v => set('is_featured', v)} label="Em Destaque" />
            <Toggle value={draft.is_published} onChange={v => set('is_published', v)} label="Publicado" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-3xl">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-white text-sm font-bold transition-all disabled:opacity-60 flex items-center gap-2 shadow-md shadow-secondary/20">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'A guardar...' : 'Guardar'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const BooksAdmin: React.FC<{ showToast: (m: string) => void }> = ({ showToast }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('books').select('*').order('published_at', { ascending: false }).order('created_at', { ascending: false });
    setBooks((data as Book[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (b: Book) => { setEditing(b); setModalOpen(true); };

  const handleToggle = async (b: Book) => {
    await supabase.from('books').update({ is_published: !b.is_published }).eq('id', b.id);
    showToast(b.is_published ? 'Livro ocultado.' : 'Livro publicado.');
    fetch();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Eliminar este livro?')) return;
    setDeletingId(id);
    await supabase.from('books').delete().eq('id', id);
    setDeletingId(null);
    showToast('Livro eliminado.');
    fetch();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary">Livros & Ebooks</h2>
            <p className="text-sm text-gray-400">{books.length} publicação{books.length !== 1 ? 'ões' : ''} no total</p>
          </div>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary/90 text-white text-sm font-bold rounded-xl transition-all hover:-translate-y-0.5 shadow-md shadow-secondary/20">
          <Plus className="w-4 h-4" /> Novo Livro
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-7 h-7 text-secondary animate-spin" /></div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <BookOpen className="w-10 h-10 text-gray-200" />
            <p className="text-gray-400 font-light">Nenhum livro ainda. Clica em "Novo Livro" para começar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Capa</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Título</th>
                  <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo</th>
                  <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Preço</th>
                  <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {books.map(book => (
                  <tr key={book.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-10 h-14 rounded-lg overflow-hidden bg-gray-100 shadow-sm shrink-0">
                        {book.cover_url ? <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center"><BookOpen className="w-4 h-4 text-secondary/50" /></div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[240px]">
                      <p className="font-semibold text-primary truncate">{book.title}</p>
                      {book.subtitle && <p className="text-xs text-gray-400 truncate mt-0.5">{book.subtitle}</p>}
                      {book.is_featured && <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider">Destaque</span>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${book.type === 'ebook' ? 'bg-blue-50 text-blue-600' : 'bg-secondary/10 text-secondary'}`}>
                        {book.type === 'ebook' ? 'Ebook' : 'Físico'}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-primary">{book.price != null ? `${book.price.toFixed(2).replace('.', ',')}€` : '—'}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${book.is_published ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {book.is_published ? 'Publicado' : 'Oculto'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleToggle(book)} title={book.is_published ? 'Ocultar' : 'Publicar'} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors">
                          {book.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => openEdit(book)} title="Editar" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-secondary transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(book.id)} disabled={deletingId === book.id} title="Eliminar" className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50">
                          {deletingId === book.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
          <BookModal book={editing} onClose={() => setModalOpen(false)} onSaved={() => { fetch(); showToast('Livro guardado com sucesso!'); }} />
        )}
      </AnimatePresence>
    </>
  );
};
