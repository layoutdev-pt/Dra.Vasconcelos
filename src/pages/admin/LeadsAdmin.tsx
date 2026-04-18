import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../config/supabase';
import { Trash2, Loader2, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { Lead } from '../../types/lead';

export const LeadsAdmin: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    setLeads(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const deleteLead = async (id: string, email: string) => {
    if(!window.confirm(`Tem a certeza que deseja remover ${email} da lista de subscritores?`)) return;
    await supabase.from('leads').delete().eq('id', id);
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
    
    // Convert to array and reverse to show chronologically if we had sorted ascending, 
    // but since we read from DB descending, we reverse it.
    return Object.keys(counts).map(k => ({ name: k, total: counts[k] })).reverse();
  }, [leads]);

  const exportCSV = () => {
    const csv = ['Email,Origem,Data'];
    leads.forEach(l => {
      csv.push(`${l.email},${l.source},${new Date(l.created_at).toLocaleDateString()}`);
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads_vasconcelos.csv';
    a.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Leads & Newsletter</h3>
        <button onClick={exportCSV} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-200">
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
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
      
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-secondary" /></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">E-mail</th>
                <th className="px-6 py-4">Origem</th>
                <th className="px-6 py-4">Data de Subscrição</th>
                <th className="px-6 py-4 text-right">Remover</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map(l => (
                <tr key={l.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-primary">{l.email}</td>
                  <td className="px-6 py-4 uppercase text-xs font-bold text-gray-400">{l.source}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(l.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 flex justify-end">
                    <button onClick={() => deleteLead(l.id, l.email)} className="p-2 text-gray-400 hover:text-red-500 bg-white shadow-sm border border-gray-100 rounded-lg" title="Apagar / Unsubscribe"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Nenhum email capturado ainda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
