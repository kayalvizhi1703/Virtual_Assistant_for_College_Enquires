import { useEffect, useState } from 'react';
import { Save, Settings as SettingsIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import type { Settings } from '@/lib/supabase';

export default function AdminSettings() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('settings').select('*').limit(1).maybeSingle().then(({ data }) => {
      if (data) setSettings(data as Settings);
    });
  }, []);

  const update = (field: keyof Settings, value: string | number) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase.from('settings').update({
      college_name: settings.college_name,
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      principal: settings.principal,
      motto: settings.motto,
      established: settings.established,
      naac_grade: settings.naac_grade,
      naac_cgpa: settings.naac_cgpa,
      affiliation: settings.affiliation,
      trust: settings.trust,
      confidence_threshold: settings.confidence_threshold,
      highest_package: settings.highest_package,
      average_package: settings.average_package,
      recruiters_count: settings.recruiters_count,
      map_embed_url: settings.map_embed_url,
      updated_at: new Date().toISOString(),
    }).eq('id', settings.id);
    setSaving(false);
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Settings saved', 'success');
  };

  if (!settings) return <div className="text-gray-400">Loading...</div>;

  const fields: { key: keyof Settings; label: string; type?: string }[] = [
    { key: 'college_name', label: 'College Name' },
    { key: 'address', label: 'Address' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'principal', label: 'Principal' },
    { key: 'motto', label: 'Motto' },
    { key: 'established', label: 'Established Year', type: 'number' },
    { key: 'naac_grade', label: 'NAAC Grade' },
    { key: 'naac_cgpa', label: 'NAAC CGPA', type: 'number' },
    { key: 'affiliation', label: 'Affiliation' },
    { key: 'trust', label: 'Trust' },
    { key: 'confidence_threshold', label: 'Confidence Threshold (0-1)', type: 'number' },
    { key: 'highest_package', label: 'Highest Package' },
    { key: 'average_package', label: 'Average Package' },
    { key: 'recruiters_count', label: 'Recruiters Count', type: 'number' },
    { key: 'map_embed_url', label: 'Google Maps Embed URL' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><SettingsIcon className="w-6 h-6" /> Settings</h1>
        <button onClick={save} disabled={saving} className="btn-primary text-sm py-2 disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}</button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 space-y-4 max-w-3xl">
        {fields.map(field => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
            {field.key === 'address' || field.key === 'map_embed_url' ? (
              <textarea value={String(settings[field.key] || '')} onChange={e => update(field.key, e.target.value)} className="input-field min-h-[60px]" />
            ) : (
              <input type={field.type || 'text'} value={String(settings[field.key] || '')} onChange={e => update(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)} className="input-field" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
