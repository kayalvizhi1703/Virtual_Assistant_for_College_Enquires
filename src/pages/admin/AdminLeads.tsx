import { useEffect, useState } from 'react';
import { Download, Phone, User, Clock, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import type { Lead } from '@/lib/supabase';

function downloadCSV(filename: string, rows: Record<string, any>[]) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => `"${String(r[h] || '').replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

const statusColors: Record<string, string> = {
  'New': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Contacted': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Admitted': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

export default function AdminLeads() {
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);

  const load = async () => {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (data) setLeads(data as Lead[]);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (lead: Lead, status: string) => {
    const { error } = await supabase.from('leads').update({ status }).eq('id', lead.id);
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Status updated', 'success');
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads (Call-back Requests)</h1>
        <button onClick={() => downloadCSV('leads.csv', leads as any)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"><Download className="w-5 h-5" /></button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="text-left p-3 font-semibold">Name</th>
              <th className="text-left p-3 font-semibold">Phone</th>
              <th className="text-left p-3 font-semibold">Course</th>
              <th className="text-left p-3 font-semibold">Preferred Time</th>
              <th className="text-left p-3 font-semibold">Date</th>
              <th className="text-left p-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="p-3 font-medium text-gray-900 dark:text-white">{lead.name}</td>
                <td className="p-3 text-blue-600 dark:text-blue-400">{lead.phone}</td>
                <td className="p-3 text-gray-600 dark:text-gray-400">{lead.course || '—'}</td>
                <td className="p-3 text-gray-600 dark:text-gray-400 capitalize">{lead.preferred_time || '—'}</td>
                <td className="p-3 text-gray-400 text-xs">{new Date(lead.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  <select
                    value={lead.status}
                    onChange={e => updateStatus(lead, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full font-semibold border-0 outline-none cursor-pointer ${statusColors[lead.status] || statusColors['New']}`}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Admitted">Admitted</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && <p className="text-center text-gray-400 py-12">No leads yet.</p>}
      </div>
    </div>
  );
}
