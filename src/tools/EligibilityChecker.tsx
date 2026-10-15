import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Search } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useApp } from '@/context/AppContext';

export default function EligibilityChecker() {
  const { courses } = useData();
  const { t } = useApp();
  const [stream, setStream] = useState('');
  const [percentage, setPercentage] = useState('');

  const result = useMemo(() => {
    if (!stream || !percentage) return null;
    const pct = parseFloat(percentage);

    const eligible = courses.filter((c) => {
      const elig = c.eligibility.toLowerCase();
      // Check stream compatibility
      if (elig.includes('science stream')) {
        if (stream !== 'science') return false;
      } else if (elig.includes('commerce') && elig.includes('science')) {
        // Commerce or science stream preferred
        if (stream !== 'commerce' && stream !== 'science') return false;
      } else if (elig.includes('any stream')) {
        // any stream is fine
      } else if (elig.includes('commerce')) {
        if (stream !== 'commerce' && stream !== 'science') return false;
      }
      // Check percentage (most courses need ~50%)
      if (pct < 50) return false;
      return true;
    });

    const notEligible = courses.filter((c) => !eligible.includes(c));

    return { eligible, notEligible, pct };
  }, [stream, percentage, courses]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('Eligibility Checker', 'தகுதி சரிபார்ப்பு')}</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('12th Stream', '12ஆம் வகுப்பு பிரிவு')}</label>
          <select value={stream} onChange={(e) => setStream(e.target.value)} className="input-field">
            <option value="">-- Select stream --</option>
            <option value="science">Science (PCM/PCB)</option>
            <option value="commerce">Commerce</option>
            <option value="arts">Arts / Humanities</option>
            <option value="vocational">Vocational</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('12th Percentage', '12ஆம் வகுப்பு சதவீதம்')}</label>
          <input
            type="number"
            min="0"
            max="100"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            placeholder="e.g. 85"
            className="input-field"
          />
        </div>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Eligible */}
          <div>
            <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> {t('Eligible Courses', 'தகுதியான படிப்புகள்')} ({result.eligible.length})
            </h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {result.eligible.map((c) => (
                <div key={c.id} className="glass-card p-3 border-l-4 border-green-500">
                  <div className="font-medium text-sm text-gray-900 dark:text-white">{c.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{c.duration} | Rs.{c.fee_annual.toLocaleString()}/yr</div>
                </div>
              ))}
            </div>
          </div>

          {/* Not eligible */}
          {result.notEligible.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-red-500 mb-3 flex items-center gap-2">
                <XCircle className="w-5 h-5" /> {t('Need Different Stream / Higher Marks', 'வேறு பிரிவு தேவை')} ({result.notEligible.length})
              </h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {result.notEligible.map((c) => (
                  <div key={c.id} className="glass-card p-3 border-l-4 border-red-400 opacity-75">
                    <div className="font-medium text-sm text-gray-700 dark:text-gray-300">{c.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{c.eligibility}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {!result && (
        <div className="glass-card p-12 text-center text-gray-400">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>{t('Select your stream and percentage to check eligibility', 'தகுதி சரிபார்க்க பிரிவு மற்றும் சதவீதம் உள்ளிடவும்')}</p>
        </div>
      )}
    </div>
  );
}
