import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import { Loader2, Shield, ShieldAlert, ShieldCheck, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Profile {
  id: string;
  email: string | null;  // Depende se a BD está a trazer o email ou o Auth. Se n trouxer, usaremos listagem simples
  is_admin: boolean;
  created_at: string;
}

export const UsersAdmin: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth(); // para não deixar remover o próprio admin facilmente

  const fetchUsers = async () => {
    setLoading(true);
    // Tentamos ir buscar a lista geral de perfis
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) {
      setUsers(data as Profile[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleAdminStatus = async (id: string, currentStatus: boolean, email: string | null) => {
    if (id === currentUser?.id) {
      alert('Não pode remover os seus próprios privilégios de Administrador por segurança.');
      return;
    }

    const action = currentStatus ? 'remover' : 'conceder';
    if(!window.confirm(`Tem a certeza que deseja ${action} permissões de Administrador a ${email || 'este utilizador'}?`)) return;

    const { error } = await supabase.from('profiles').update({ is_admin: !currentStatus }).eq('id', id);
    if (error) {
      alert(`Erro: ${error.message}`);
      return;
    }
    fetchUsers();
  };

  const filteredUsers = users.filter(u => 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Gerir Acessos</h3>
            <p className="text-sm text-gray-400">Atribuir cargo de Admin à equipa</p>
          </div>
        </div>
        
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Procurar por E-mail..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all w-64"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-secondary" /></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">ID de Conta / E-mail</th>
                <th className="px-6 py-4">Equipa Administrativa</th>
                <th className="px-6 py-4">Registo</th>
                <th className="px-6 py-4 text-right">Permissão de Acesso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-primary">{u.email || '—'}</p>
                    <p className="text-xs text-gray-400 font-mono mt-1">{u.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    {u.is_admin ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" /> Administrador
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full font-semibold">
                        Visitante Comum
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 flex justify-end">
                    <button 
                      onClick={() => toggleAdminStatus(u.id, u.is_admin, u.email)} 
                      disabled={u.id === currentUser?.id}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
                        u.is_admin 
                          ? 'bg-white border-red-200 text-red-500 hover:bg-red-50' 
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                      } ${u.id === currentUser?.id ? 'opacity-50 cursor-not-allowed hidden' : ''}`}
                    >
                      {u.is_admin ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                      {u.is_admin ? 'Remover Admin' : 'Tornar Admin'}
                    </button>
                    {u.id === currentUser?.id && (
                      <span className="text-xs text-gray-400 italic">É a tua conta.</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Nenhum utilizador encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
