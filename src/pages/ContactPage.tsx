import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useData } from '@/context/DataContext';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export default function ContactPage() {
  const { settings } = useData();
  const { t } = useApp();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      showToast('Please fill in name, email, and message', 'warning');
      return;
    }
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      showToast('Please enter a valid email address', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: escapeHtml(form.name.trim()),
        email: escapeHtml(form.email.trim()),
        phone: escapeHtml(form.phone.trim()),
        subject: escapeHtml(form.subject.trim()),
        message: escapeHtml(form.message.trim()),
      });
      if (error) throw error;
      showToast('Message sent! We will get back to you soon.', 'success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t('Contact Us', 'தொடர்பு கொள்ள')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {t('Get in touch with Nandha Arts and Science College.', 'நந்தா கலை அறிவியல் கல்லூரியை தொடர்பு கொள்ளவும்.')}
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            {[
              { icon: MapPin, label: t('Address', 'முகவரி'), value: settings?.address },
              { icon: Phone, label: t('Phone', 'தொலைபேசி'), value: settings?.phone },
              { icon: Mail, label: t('Email', 'மின்னஞ்சல்'), value: settings?.email },
              { icon: Clock, label: t('Office Hours', 'அலுவலக நேரம்'), value: 'Mon-Fri: 9:00 AM - 5:00 PM' },
            ].map((item) => (
              <div key={item.label} className="glass-card p-5 flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{item.label}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mt-1">{item.value}</div>
                </div>
              </div>
            ))}

            {/* Map embed */}
            <div className="glass-card p-2 overflow-hidden">
              <iframe
                title="NASC Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.0!2d77.7!3d11.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDE4JzAwLjAiTiA3N8KwNDInMTIuMCJF!5e0!3m2!1sen!2sin!4v0000000000000"
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: '12px' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('Name', 'பெயர்')} *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  maxLength={100}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('Email', 'மின்னஞ்சல்')} *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  maxLength={100}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('Phone', 'தொலைபேசி')}
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field"
                  maxLength={20}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('Subject', 'தலைப்பு')}
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="input-field"
                  maxLength={200}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('Message', 'செய்தி')} *
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-field min-h-[120px] resize-y"
                  maxLength={1000}
                  required
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
                {submitting ? 'Sending...' : (
                  <>{t('Send Message', 'செய்தி அனுப்பு')} <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
