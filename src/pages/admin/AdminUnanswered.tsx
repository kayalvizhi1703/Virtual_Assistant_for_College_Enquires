import { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Download, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import type { UnansweredQuery } from '@/lib/supabase';

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

export default function AdminUnanswered() {
  const { showToast } = useToast();
  const [queries, setQueries] = useState<UnansweredQuery[]>([]);
  const [converting, setConverting] = useState<UnansweredQuery | null>(null);
  const [form, setForm] = useState({ intent_name: '', category: 'general', patterns: '', response_en: '' });

  const load = async () => {
    const { data } = await supabase.from('unanswered_queries').select('*').order('created_at', { ascending: false });
    if (data) setQueries(data as UnansweredQuery[]);
  };

  useEffect(() => { load(); }, []);

  const resolve = async (q: UnansweredQuery) => {
    const { error } = await supabase.from('unanswered_queries').update({ status: 'resolved', resolved_at: new Date().toISOString() }).eq('id', q.id);
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Marked as resolved', 'success');
    load();
  };

  const startConvert = (q: UnansweredQuery) => {
    setConverting(q);
    setForm({ intent_name: '', category: 'general', patterns: q.query, response_en: '' });
  };

  const saveConvert = async () => {
    if (!converting) return;
    const patterns = form.patterns.split('\n').map(p => p.trim()).filter(Boolean);
    const { error } = await supabase.from('intents').insert({
      intent_name: form.intent_name,
      category: form.category,
      patterns,
      response_en: form.response_en,
      suggestions: [],
    });
    if (error) { showToast(error.message, 'error'); return; }
    await supabase.from('unanswered_queries').update({ status: 'resolved', resolved_at: new Date().toISOString() }).eq('id', converting.id);
    showToast('Intent created from query!', 'success');
    setConverting(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Unanswered Queries</h1>
        <button onClick={() => downloadCSV('unanswered.csv', queries as any)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"><Download className="w-5 h-5" /></button>
      </div>

      {converting && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700 space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">Convert to Intent</h3>
          <p className="text-sm text-gray-500">Original query: "{converting.query}"</p>
          <input value={form.intent_name} onChange={e => setForm({ ...form, intent_name: e.target.value })} placeholder="Intent name" className="input-field" />
          <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category" className="input-field" />
          <textarea value={form.patterns} onChange={e => setForm({ ...form, patterns: e.target.value })} placeholder="Patterns (one per line)" className="input-field min-h-[60px]" />
          <textarea value={form.response_en} onChange={e => setForm({ ...form, response_en: e.target.value })} placeholder="English response" className="input-field min-h-[60px]" />
          <div className="flex gap-2">
            <button onClick={saveConvert} className="btn-primary text-sm py-2">Create Intent</button>
            <button onClick={() => setConverting(null)} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {queries.map(q => (
          <div key={q.id} className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{q.query}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${q.status === 'resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>{q.status}</span>
                <span className="text-xs text-gray-400">{new Date(q.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            {q.status === 'unresolved' && (
              <div className="flex gap-1 ml-2">
                <button onClick={() => startConvert(q)} className="p-2 text-gray-400 hover:text-blue-600" title="Convert to intent"><ArrowRight className="w-4 h-4" /></button>
                <button onClick={() => resolve(q)} className="p-2 text-gray-400 hover:text-green-600" title="Mark resolved"><CheckCircle className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        ))}
        {queries.length === 0 && <p className="text-center text-gray-400 py-12">No unanswered queries.</p>}
      </div>
    </div>
  );
}
