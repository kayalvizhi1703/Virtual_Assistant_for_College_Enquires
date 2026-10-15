import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Send, User, Clock, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useData } from '@/context/DataContext';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export default function CallbackForm() {
  const { courses } = useData();
  const { t } = useApp();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', phone: '', course: '', preferredTime: 'morning' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      showToast('Please fill in name and phone', 'warning');
      return;
    }
    if (!/^[0-9+\-\s]{10,15}$/.test(form.phone)) {
      showToast('Please enter a valid phone number', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert({
        name: escapeHtml(form.name.trim()),
        phone: escapeHtml(form.phone.trim()),
        course: escapeHtml(form.course),
        preferred_time: form.preferredTime,
        status: 'New',
      });
      if (error) throw error;
      showToast('Request submitted! We will call you back soon.', 'success');
      setForm({ name: '', phone: '', course: '', preferredTime: 'morning' });
    } catch {
      showToast('Failed to submit request. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('Get a Call Back', 'அழைப்பு கோருங்கள்')}</h3>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass-card p-6 space-y-4 max-w-lg"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
            <User className="w-4 h-4" /> {t('Name', 'பெயர்')} *
          </label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" maxLength={100} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
            <Phone className="w-4 h-4" /> {t('Phone Number', 'தொலைபேசி')} *
          </label>
          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" maxLength={15} placeholder="e.g. 9876543210" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
            <BookOpen className="w-4 h-4" /> {t('Interested Course', 'ஆர்வ படிப்பு')}
          </label>
          <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} className="input-field">
            <option value="">-- Select course --</option>
            {courses.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
            <Clock className="w-4 h-4" /> {t('Preferred Call Time', 'விருப்ப நேரம்')}
          </label>
          <div className="flex gap-2">
            {[
              { value: 'morning', labelEn: 'Morning', labelTa: 'காலை' },
              { value: 'afternoon', labelEn: 'Afternoon', labelTa: 'மதியம்' },
              { value: 'evening', labelEn: 'Evening', labelTa: 'மாலை' },
            ].map((slot) => (
              <button
                key={slot.value}
                type="button"
                onClick={() => setForm({ ...form, preferredTime: slot.value })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${form.preferredTime === slot.value ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
              >
                {t(slot.labelEn, slot.labelTa)}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? 'Submitting...' : <>{t('Request Call Back', 'அழைப்பு கோரு')} <Send className="w-4 h-4" /></>}
        </button>
      </motion.form>
    </div>
  );
}
