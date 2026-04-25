import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../config/supabase';
import { Trash2, Loader2, Download, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { Lead } from '../../types/lead';

type SourceFilter = 'all' | 'ebook' | 'blog' | 'footer';

export const LeadsAdmin: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');

  const fetchLeads = async () => {
    setLoading(true);
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    setLeads(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const filteredLeads = useMemo(() => {
    if (sourceFilter === 'all') return leads;
    return leads.filter(l => l.source === sourceFilter);
  }, [leads, sourceFilter]);

  const deleteLead = async (id: string, email: string) => {
    if(!window.confirm(`Tem a certeza que deseja remover ${email} da lista de subscritores?`)) return;
    await supabase.from('leads').delete().eq('id', id);
    fetchLeads();
  };

  const toggleSubscribed = async (lead: Lead) => {
    const newVal = !(lead as any).subscribed;
    await supabase.from('leads').update({ subscribed: newVal }).eq('id', lead.id);
    fetchLeads();
  };

  // Prepare chart data (group by month/year)
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(lead => {
      const date = new Date(lead.created_at);
      const label = `${date.toLocaleString('pt-PT', { month: 'short' })} ${date.getFullYear()}`;
      counts[label] = (counts[label] || 0) + 1;
    });
    
    return Object.keys(counts).map(k => ({ name: k, total: counts[k] })).reverse();
  }, [leads]);

  // Stats
  const totalSubscribed = leads.filter(l => (l as any).subscribed !== false).length;
  const totalEbook = leads.filter(l => l.source === 'ebook').length;
  const totalBlog = leads.filter(l => l.source === 'blog').length;
  const totalFooter = leads.filter(l => l.source === 'footer').length;

  const exportCSV = () => {
    const csv = ['Email,Origem,Subscrito,Data'];
    leads.forEach(l => {
      csv.push(`${l.email},${l.source},${(l as any).subscribed !== false ? 'Sim' : 'Não'},${new Date(l.created_at).toLocaleDateString()}`);
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads_vasconcelos.csv';
    a.click();
  };

  const sourceLabels: Record<string, string> = {
    ebook: 'Lead Magnet',
    blog: 'Blog',
    footer: 'Footer',
  };

  const sourceColors: Record<string, string> = {
    ebook: 'bg-orange-50 text-orange-600',
    blog: 'bg-blue-50 text-blue-600',
    footer: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Leads & Newsletter</h3>
        <button onClick={exportCSV} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-200">
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Total Leads</p>
          <p className="text-3xl font-extrabold text-primary">{leads.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Subscritos Ativos</p>
          <p className="text-3xl font-extrabold text-green-600">{totalSubscribed}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Via Lead Magnet</p>
          <p className="text-3xl font-extrabold text-orange-500">{totalEbook}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Via Blog / Footer</p>
          <p className="text-3xl font-extrabold text-blue-500">{totalBlog + totalFooter}</p>
        </div>
      </div>

      {!loading && chartData.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Crescimento da Lista</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="total" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-gray-400" />
        <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Filtrar por origem:</span>
        {(['all', 'ebook', 'blog', 'footer'] as SourceFilter[]).map(f => (
          <button
            key={f}
            onClick={() => setSourceFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              sourceFilter === f
                ? 'bg-secondary text-white shadow-sm'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'Todos' : sourceLabels[f] || f}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400">{filteredLeads.length} resultado{filteredLeads.length !== 1 ? 's' : ''}</span>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-secondary" /></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">E-mail</th>
                <th className="px-4 py-4">Origem</th>
                <th className="px-4 py-4">Estado</th>
                <th className="px-6 py-4">Data de Subscrição</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.map(l => (
                <tr key={l.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-primary">{l.email}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${sourceColors[l.source] || 'bg-gray-100 text-gray-500'}`}>
                      {sourceLabels[l.source] || l.source}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleSubscribed(l)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                        (l as any).subscribed !== false
                          ? 'bg-green-50 text-green-600 hover:bg-green-100'
                          : 'bg-red-50 text-red-500 hover:bg-red-100'
                      }`}
                    >
                      {(l as any).subscribed !== false ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{new Date(l.created_at).toLocaleString('pt-PT')}</td>
                  <td className="px-6 py-4 flex justify-end">
                    <button onClick={() => deleteLead(l.id, l.email)} className="p-2 text-gray-400 hover:text-red-500 bg-white shadow-sm border border-gray-100 rounded-lg" title="Apagar / Unsubscribe"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Nenhum email capturado ainda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
