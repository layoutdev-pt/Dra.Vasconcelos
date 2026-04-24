import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';
import { User as UserIcon, Phone, Mail, Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';

const inputBase =
  'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all';

export const ProfileForm: React.FC = () => {
  const { user } = useAuth();
  
  // Estados para os campos
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Imagem de Perfil
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // Feedback Visual
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados iniciais do utilizador
  useEffect(() => {
    if (user?.user_metadata) {
      setFirstName(user.user_metadata.first_name || '');
      setLastName(user.user_metadata.last_name || '');
      setPhone(user.user_metadata.phone || '');
      if (user.user_metadata.avatar_url) {
        setAvatarPreview(user.user_metadata.avatar_url);
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    let uploadedAvatarUrl = user?.user_metadata?.avatar_url || '';

    // Se o utilizador escolheu uma nova foto
    if (avatarFile) {
      try {
        const ext = avatarFile.name.split('.').pop();
        const path = `${user?.id}_${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('avatars').upload(path, avatarFile);
        if (!upErr) {
          const { data } = supabase.storage.from('avatars').getPublicUrl(path);
          uploadedAvatarUrl = data.publicUrl;
        }
      } catch (err) {
        console.error("Erro no upload da imagem:", err);
      }
    } else if (avatarPreview === null) {
      // Se ele removeu a foto que tinha
      uploadedAvatarUrl = '';
    }

    // Atualiza os dados no Supabase (user_metadata)
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        avatar_url: uploadedAvatarUrl
      }
    });

    if (updateError) {
      setError('Ocorreu um erro ao atualizar os seus dados. Tente novamente.');
    } else {
      setSuccess('Perfil atualizado com sucesso!');
      setAvatarFile(null); // Limpa o ficheiro guardado para não dar upload duplo se ele gravar outra vez
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Feedback Alerts */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Avatar Picker */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative w-24 h-24 shrink-0 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center group overflow-hidden">
          {avatarPreview ? (
            <>
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setAvatarFile(null); setAvatarPreview(null); }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </>
          ) : (
            <Upload className="w-6 h-6 text-gray-400" />
          )}
          <input
            type="file"
            accept="image/*"
            className={`absolute inset-0 w-full h-full opacity-0 ${!avatarPreview ? 'cursor-pointer' : 'hidden'}`}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setAvatarFile(file);
                setAvatarPreview(URL.createObjectURL(file));
              }
            }}
          />
        </div>
        <div className="text-center sm:text-left pt-2">
          <h3 className="text-sm font-bold text-primary">Foto de Perfil</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xs">Formatos aceites: JPG, PNG. Tamanho máximo recomendado de 2MB.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 ml-1">Nome</label>
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={firstName} 
              onChange={e => setFirstName(e.target.value)} 
              required 
              className={`${inputBase} pl-11`} 
            />
          </div>
        </div>

        {/* Apelido */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 ml-1">Apelido</label>
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={lastName} 
              onChange={e => setLastName(e.target.value)} 
              className={`${inputBase} pl-11`} 
            />
          </div>
        </div>

        {/* Email (Apenas leitura/Desativado, não se pode mudar assim sem confirmar) */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 ml-1">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="email" 
              value={user?.email || ''} 
              disabled 
              className={`${inputBase} pl-11 opacity-60 bg-gray-100 cursor-not-allowed`} 
            />
          </div>
        </div>

        {/* Telefone */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 ml-1">Telefone</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="tel" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              className={`${inputBase} pl-11`} 
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-secondary hover:bg-secondary/90 disabled:opacity-60 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md text-sm flex items-center justify-center"
        >
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Guardar Alterações'}
        </button>
      </div>
    </form>
  );
};