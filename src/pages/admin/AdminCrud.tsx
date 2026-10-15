import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';

type Field = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'date';
  options?: { value: string; label: string }[];
};

type CrudConfig = {
  table: string;
  title: string;
  fields: Field[];
  displayField: string;
  subtitleField?: string;
};

export default function AdminCrud({ config }: { config: CrudConfig }) {
  const { showToast } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});

  const load = async () => {
    const { data } = await supabase.from(config.table).select('*').order(config.displayField);
    if (data) setRows(data);
  };

  useEffect(() => { load(); }, [config.table]);

  const startAdd = () => {
    setEditing(null);
    const init: Record<string, any> = {};
    config.fields.forEach(f => { init[f.name] = f.type === 'number' ? 0 : ''; });
    setForm(init);
    setShowForm(true);
  };

  const startEdit = (row: any) => {
    setEditing(row);
    const init: Record<string, any> = {};
    config.fields.forEach(f => { init[f.name] = row[f.name] ?? (f.type === 'number' ? 0 : ''); });
    setForm(init);
    setShowForm(true);
  };

  const save = async () => {
    if (editing) {
      const { error } = await supabase.from(config.table).update(form).eq('id', editing.id);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Updated', 'success');
    } else {
      const { error } = await supabase.from(config.table).insert(form);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Created', 'success');
    }
    setShowForm(false);
    load();
  };

  const del = async (row: any) => {
    if (!confirm(`Delete "${row[config.displayField]}"?`)) return;
    const { error } = await supabase.from(config.table).delete().eq('id', row.id);
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Deleted', 'success');
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{config.title}</h1>
        <button onClick={startAdd} className="btn-primary text-sm py-2"><Plus className="w-4 h-4" /> Add New</button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">{editing ? 'Edit' : 'New'} {config.title}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400"><X className="w-5 h-5" /></button>
          </div>
          {config.fields.map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea value={form[field.name] || ''} onChange={e => setForm({ ...form, [field.name]: e.target.value })} className="input-field min-h-[80px]" />
              ) : field.type === 'select' ? (
                <select value={form[field.name] || ''} onChange={e => setForm({ ...form, [field.name]: e.target.value })} className="input-field">
                  <option value="">-- Select --</option>
                  {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <input type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'} value={form[field.name] || ''} onChange={e => setForm({ ...form, [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value })} className="input-field" />
              )}
            </div>
          ))}
          <button onClick={save} className="btn-primary text-sm py-2"><Save className="w-4 h-4" /> Save</button>
        </div>
      )}

      <div className="space-y-2">
        {rows.map(row => (
          <div key={row.id} className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm text-gray-900 dark:text-white">{row[config.displayField]}</div>
              {config.subtitleField && <div className="text-xs text-gray-500 mt-0.5">{row[config.subtitleField]}</div>}
            </div>
            <div className="flex gap-1 ml-2">
              <button onClick={() => startEdit(row)} className="p-2 text-gray-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => del(row)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-center text-gray-400 py-12">No records found.</p>}
      </div>
    </div>
  );
}
