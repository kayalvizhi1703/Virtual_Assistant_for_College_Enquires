import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertCircle, Calendar, FileText, GraduationCap, Briefcase } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useApp } from '@/context/AppContext';

const categoryConfig = {
  all: { icon: Bell, label: 'All', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  admission: { icon: GraduationCap, label: 'Admission', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  exam: { icon: FileText, label: 'Exams', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  event: { icon: Calendar, label: 'Events', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  circular: { icon: AlertCircle, label: 'Circulars', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  placement: { icon: Briefcase, label: 'Placement', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' },
  general: { icon: Bell, label: 'General', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
};

export default function NotificationsPage() {
  const { notifications } = useData();
  const { t } = useApp();
  const [category, setCategory] = useState('all');

  const categories = useMemo(() => {
    const set = new Set(notifications.map((n) => n.category));
    return ['all', ...Array.from(set)];
  }, [notifications]);

  const filtered = useMemo(() => {
    if (category === 'all') return notifications;
    return notifications.filter((n) => n.category === category);
  }, [notifications, category]);

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t('Notifications', 'அறிவிப்புகள்')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {t('Stay updated with exam dates, events, circulars and admission notices.', 'தேர்வு தேதிகள், நிகழ்வுகள் மற்றும் சேர்க்கை அறிவிப்புகள்.')}
        </p>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => {
            const config = categoryConfig[cat as keyof typeof categoryConfig] || categoryConfig.general;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  category === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <config.icon className="w-4 h-4" />
                {cat === 'all' ? t('All', 'அனைத்தும்') : config.label}
              </button>
            );
          })}
        </div>

        {/* Notification cards */}
        <div className="space-y-3">
          {filtered.map((notif, i) => {
            const config = categoryConfig[notif.category as keyof typeof categoryConfig] || categoryConfig.general;
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${config.color}`}>
                    <config.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{notif.title}</h3>
                      {notif.priority === 'high' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-semibold">
                          Important
                        </span>
                      )}
                    </div>
                    {notif.body && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notif.body}</p>}
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                      <span className={`px-2 py-0.5 rounded-full ${config.color}`}>{config.label}</span>
                      <span>{notif.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No notifications in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
