import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, PartyPopper } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const steps = [
  { id: 'documents', labelEn: 'Collect Documents', labelTa: 'ஆவணங்கள் சேகரிக்க', descEn: '12th mark sheet, TC, community certificate, photos, Aadhaar', descTa: 'மதிப்பெண், TC, சமூக சான்றிதழ், புகைப்படம்' },
  { id: 'application', labelEn: 'Submit Application', labelTa: 'விண்ணப்பம் சமர்ப்பிக்க', descEn: 'Fill and submit the online/offline application form', descTa: 'விண்ணப்ப படிவத்தை சமர்ப்பிக்கவும்' },
  { id: 'verification', labelEn: 'Document Verification', labelTa: 'ஆவண சரிபார்ப்பு', descEn: 'Bring original documents for verification at college', descTa: 'அசல் ஆவணங்களை கொண்டு வரவும்' },
  { id: 'payment', labelEn: 'Pay Admission Fee', labelTa: 'கட்டணம் செலுத்து', descEn: 'Pay the admission and first year tuition fee', descTa: 'சேர்க்கை கட்டணம் செலுத்தவும்' },
  { id: 'confirmation', labelEn: 'Admission Confirmed', labelTa: 'சேர்க்கை உறுதி', descEn: 'Receive your admission confirmation and welcome kit', descTa: 'சேர்க்கை உறுதிப்படுத்தல் பெறவும்' },
];

export default function AdmissionTracker() {
  const { t, language } = useApp();
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nasc-admission-progress');
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('nasc-admission-progress', JSON.stringify(completed));
    const allDone = steps.every((s) => completed[s.id]);
    if (allDone && !showConfetti) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [completed]);

  const toggle = (id: string) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const progress = (steps.filter((s) => completed[s.id]).length / steps.length) * 100;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('Admission Journey Tracker', 'சேர்க்கை பயண கண்காணிப்பு')}</h3>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">{progress.toFixed(0)}% Complete</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">{steps.filter((s) => completed[s.id]).length}/{steps.length}</span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-amber-500 rounded-full" />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, i) => {
          const isDone = completed[step.id];
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => toggle(step.id)}
              className={`glass-card p-4 cursor-pointer transition-all hover:scale-[1.01] flex items-start gap-4 ${isDone ? 'border-l-4 border-green-500' : ''}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isDone ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                )}
              </div>
              <div className="flex-1">
                <div className={`font-semibold text-sm ${isDone ? 'text-green-600 dark:text-green-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                  {language === 'ta' ? step.labelTa : step.labelEn}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {language === 'ta' ? step.descTa : step.descEn}
                </div>
              </div>
              <span className="text-xs text-gray-400">Step {i + 1}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl"
            >
              <PartyPopper className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Congratulations!</h3>
              <p className="text-gray-500 text-center mt-2">Your admission journey is complete!</p>
            </motion.div>
            {/* Confetti pieces */}
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ top: '50%', left: '50%', opacity: 1 }}
                animate={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0,
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 2 + Math.random() * 2 }}
                className="absolute w-2 h-2 rounded"
                style={{ backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'][i % 5] }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
