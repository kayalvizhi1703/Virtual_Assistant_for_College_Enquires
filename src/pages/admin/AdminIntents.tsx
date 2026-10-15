import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Search, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import type { Intent } from '@/lib/supabase';

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

export default function AdminIntents() {
  const { showToast } = useToast();
  const [intents, setIntents] = useState<Intent[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Intent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ intent_name: '', category: '', patterns: '', response_en: '', response_ta: '', suggestions: '' });

  const load = async () => {
    const { data } = await supabase.from('intents').select('*').order('intent_name');
    if (data) setIntents(data as Intent[]);
  };

  useEffect(() => { load(); }, []);

  const filtered = intents.filter(i =>
    i.intent_name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (intent: Intent) => {
    setEditing(intent);
    setForm({
      intent_name: intent.intent_name,
      category: intent.category,
      patterns: intent.patterns.join('\n'),
      response_en: intent.response_en,
      response_ta: intent.response_ta || '',
      suggestions: intent.suggestions.join('\n'),
    });
    setShowForm(true);
  };

  const startAdd = () => {
    setEditing(null);
    setForm({ intent_name: '', category: 'general', patterns: '', response_en: '', response_ta: '', suggestions: '' });
    setShowForm(true);
  };

  const save = async () => {
    const patterns = form.patterns.split('\n').map(p => p.trim()).filter(Boolean);
    const suggestions = form.suggestions.split('\n').map(s => s.trim()).filter(Boolean);
    const payload = {
      intent_name: form.intent_name,
      category: form.category,
      patterns,
      response_en: form.response_en,
      response_ta: form.response_ta || null,
      suggestions,
    };
    if (editing) {
      const { error } = await supabase.from('intents').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Intent updated', 'success');
    } else {
      const { error } = await supabase.from('intents').insert(payload);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Intent created', 'success');
    }
    setShowForm(false);
    load();
  };

  const del = async (intent: Intent) => {
    if (!confirm(`Delete intent "${intent.intent_name}"?`)) return;
    const { error } = await supabase.from('intents').delete().eq('id', intent.id);
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Intent deleted', 'success');
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Intent Management</h1>
        <div className="flex gap-2">
          <button onClick={() => downloadCSV('intents.csv', intents as any)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"><Download className="w-5 h-5" /></button>
          <button onClick={startAdd} className="btn-primary text-sm py-2"><Plus className="w-4 h-4" /> Add Intent</button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search intents..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 dark:text-white" />
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">{editing ? 'Edit Intent' : 'New Intent'}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.intent_name} onChange={e => setForm({ ...form, intent_name: e.target.value })} placeholder="Intent name (e.g. bca_course)" className="input-field" />
            <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category" className="input-field" />
          </div>
          <textarea value={form.patterns} onChange={e => setForm({ ...form, patterns: e.target.value })} placeholder="Patterns (one per line)" className="input-field min-h-[100px]" />
          <textarea value={form.response_en} onChange={e => setForm({ ...form, response_en: e.target.value })} placeholder="English response" className="input-field min-h-[80px]" />
          <textarea value={form.response_ta} onChange={e => setForm({ ...form, response_ta: e.target.value })} placeholder="Tamil response (optional)" className="input-field min-h-[60px]" />
          <textarea value={form.suggestions} onChange={e => setForm({ ...form, suggestions: e.target.value })} placeholder="Suggestions (one per line)" className="input-field min-h-[60px]" />
          <button onClick={save} className="btn-primary text-sm py-2"><Save className="w-4 h-4" /> Save</button>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map(intent => (
          <div key={intent.id} className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">{intent.intent_name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{intent.category}</span>
                <span className="text-xs text-gray-400">{intent.patterns.length} patterns</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate">{intent.response_en.slice(0, 80)}...</p>
            </div>
            <div className="flex gap-1 ml-2">
              <button onClick={() => startEdit(intent)} className="p-2 text-gray-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => del(intent)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
