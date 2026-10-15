import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowRight, RotateCcw, Share2, CheckCircle } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { useApp } from '@/context/AppContext';

const questions = [
  {
    id: 'interest',
    text: { en: 'What field interests you the most?', ta: 'எதில் அதிக ஆர்வம்?' },
    options: [
      { value: 'tech', label: { en: 'Computers & Technology', ta: 'கணினி' } },
      { value: 'business', label: { en: 'Business & Management', ta: 'வணிகம்' } },
      { value: 'science', label: { en: 'Science & Research', ta: 'அறிவியல்' } },
      { value: 'arts', label: { en: 'Arts & Literature', ta: 'கலை' } },
      { value: 'fashion', label: { en: 'Fashion & Design', ta: 'வடிவமைப்பு' } },
    ],
  },
  {
    id: 'subject',
    text: { en: 'What was your favorite subject in 12th?', ta: 'பிடித்த பாடம்?' },
    options: [
      { value: 'math', label: { en: 'Mathematics', ta: 'கணிதம்' } },
      { value: 'science', label: { en: 'Science (Physics/Chemistry/Biology)', ta: 'அறிவியல்' } },
      { value: 'commerce', label: { en: 'Commerce / Accountancy', ta: 'வணிகம்' } },
      { value: 'english', label: { en: 'English / Literature', ta: 'ஆங்கிலம்' } },
      { value: 'tamil', label: { en: 'Tamil', ta: 'தமிழ்' } },
    ],
  },
  {
    id: 'career',
    text: { en: 'What is your career goal?', ta: 'தொழில் இலக்கு?' },
    options: [
      { value: 'software', label: { en: 'Software Engineer / Developer', ta: 'மென்பொருள்' } },
      { value: 'manager', label: { en: 'Business Manager / Entrepreneur', ta: 'மேலாளர்' } },
      { value: 'researcher', label: { en: 'Researcher / Scientist', ta: 'ஆராய்ச்சி' } },
      { value: 'teacher', label: { en: 'Teacher / Professor', ta: 'ஆசிரியர்' } },
      { value: 'designer', label: { en: 'Fashion Designer / Creative', ta: 'வடிவமைப்பாளர்' } },
    ],
  },
  {
    id: 'stream',
    text: { en: 'What stream did you study in 12th?', ta: '12ஆம் வகுப்பு பிரிவு?' },
    options: [
      { value: 'science', label: { en: 'Science (PCM/PCB)', ta: 'அறிவியல்' } },
      { value: 'commerce', label: { en: 'Commerce', ta: 'வணிகம்' } },
      { value: 'arts', label: { en: 'Arts / Humanities', ta: 'கலை' } },
      { value: 'vocational', label: { en: 'Vocational / Other', ta: 'தொழில்நுட்பம்' } },
    ],
  },
  {
    id: 'marks',
    text: { en: 'What is your 12th percentage range?', ta: 'மதிப்பெண் வரம்பு?' },
    options: [
      { value: '90+', label: { en: 'Above 90%', ta: '90%+' } },
      { value: '75-90', label: { en: '75% - 90%', ta: '75-90%' } },
      { value: '60-75', label: { en: '60% - 75%', ta: '60-75%' } },
      { value: 'below60', label: { en: 'Below 60%', ta: '60% குறைவு' } },
    ],
  },
];

// Course scoring maps
const courseScores: Record<string, Record<string, number>> = {
  'B.Sc. AI & Data Science': { tech: 3, math: 3, software: 3, science: 2, '90+': 3, '75-90': 2, '60-75': 1 },
  'B.Sc. AI & Machine Learning': { tech: 3, math: 3, software: 3, science: 2, '90+': 3, '75-90': 2, '60-75': 1 },
  'B.C.A.': { tech: 3, math: 2, software: 3, science: 1, '75-90': 3, '60-75': 2, '90+': 2, below60: 1 },
  'B.Sc. Computer Science': { tech: 3, math: 2, software: 3, science: 2, '75-90': 3, '60-75': 2, '90+': 2 },
  'B.Com.': { business: 3, commerce: 3, manager: 3, '75-90': 2, '60-75': 2, below60: 1 },
  'B.B.A.': { business: 3, manager: 3, commerce: 2, '75-90': 2, '60-75': 2, below60: 1 },
  'B.Sc. Biotechnology': { science: 3, researcher: 3, '90+': 2, '75-90': 2, '60-75': 1 },
  'B.A. English': { arts: 3, english: 3, teacher: 2, '75-90': 2, '60-75': 2, below60: 1 },
  'B.A. Tamil': { arts: 3, tamil: 3, teacher: 2, '75-90': 2, '60-75': 2, below60: 1 },
  'B.Sc. Costume Design and Fashion': { fashion: 3, designer: 3, arts: 1, '75-90': 2, '60-75': 2, below60: 1 },
  'M.B.A.': { business: 3, manager: 3, '75-90': 2, '90+': 2 },
  'M.C.A.': { tech: 3, software: 3, math: 2, '75-90': 2, '90+': 2 },
};

const courseReasons: Record<string, string> = {
  'B.Sc. AI & Data Science': 'Matches your interest in technology and strong math background. AI & Data Science is one of the fastest-growing fields with excellent career prospects.',
  'B.Sc. AI & Machine Learning': 'Perfect for your tech interest and math strength. ML is in high demand across industries with top salary packages.',
  'B.C.A.': 'Great fit for your technology interest. BCA provides comprehensive computer application skills leading to software development careers.',
  'B.Sc. Computer Science': 'Aligned with your tech and science interests. Strong foundation in programming and algorithms for a software career.',
  'B.Com.': 'Ideal for your business interest and commerce background. Opens doors to accounting, finance, and banking careers.',
  'B.B.A.': 'Matches your management career goal. Provides essential business administration skills for future managers and entrepreneurs.',
  'B.Sc. Biotechnology': 'Perfect for your science interest and research ambition. Combines biology with technology for cutting-edge careers.',
  'B.A. English': 'Great fit for your love of literature. Opens paths in teaching, content writing, and communication fields.',
  'B.A. Tamil': 'Aligned with your interest in Tamil language and literature. Ideal for teaching and journalism careers.',
  'B.Sc. Costume Design and Fashion': 'Matches your creative and design interests. The fashion industry offers exciting entrepreneurial opportunities.',
  'M.B.A.': 'Perfect for advancing your management career. Requires any bachelor\'s degree and builds strategic leadership skills.',
  'M.C.A.': 'Ideal for deepening your technical expertise. Advanced computer applications for senior software roles.',
};

export default function CourseFinder() {
  const { courses } = useData();
  const { showToast } = useToast();
  const { t, language } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<{ name: string; score: number; matchPct: number; reason: string }[]>([]);

  const handleAnswer = (qId: string, value: string) => {
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (allAnswers: Record<string, string>) => {
    const scored = courses
      .map((course) => {
        const scores = courseScores[course.name];
        if (!scores) return null;
        let score = 0;
        let maxScore = 0;
        for (const q of questions) {
          const answer = allAnswers[q.id];
          if (answer) {
            score += scores[answer] || 0;
            maxScore += 3;
          }
        }
        const matchPct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
        return {
          name: course.name,
          score,
          matchPct,
          reason: courseReasons[course.name] || 'A good match based on your preferences.',
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a, b) => b.matchPct - a.matchPct)
      .slice(0, 3);
    setResults(scored);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResults([]);
  };

  const share = () => {
    const text = results.map((r, i) => `${i + 1}. ${r.name} (${r.matchPct}% match)`).join('\n');
    if (navigator.share) {
      navigator.share({ title: 'My Course Recommendations', text: `Nandha College Course Finder results:\n${text}` });
    } else {
      navigator.clipboard.writeText(`Nandha College Course Finder results:\n${text}`);
      showToast('Results copied to clipboard!', 'success');
    }
  };

  if (results.length > 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Top 3 Matches</h3>
          <div className="flex gap-2">
            <button onClick={share} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200">
              <Share2 className="w-5 h-5" />
            </button>
            <button onClick={reset} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
        {results.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                  i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-gray-400' : 'bg-orange-400'
                }`}>{i + 1}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{r.name}</span>
              </div>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{r.matchPct}%</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
              <motion.div initial={{ width: 0 }} animate={{ width: `${r.matchPct}%` }} className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{r.reason}</p>
            <Link to={`/explore`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-flex items-center gap-1">
              View course details <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        ))}
      </div>
    );
  }

  const currentQ = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('Course Finder Quiz', 'படிப்பு கண்டுபிடிப்பாளர்')}</h3>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Question {step + 1} of {questions.length}</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-blue-500 to-amber-500 rounded-full" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-3"
        >
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {currentQ.text[language]}
          </p>
          {currentQ.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(currentQ.id, opt.value)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:scale-[1.01] ${
                answers[currentQ.id] === opt.value
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{opt.label[language]}</span>
                {answers[currentQ.id] === opt.value && <CheckCircle className="w-5 h-5 text-blue-600" />}
              </div>
            </button>
          ))}
        </motion.div>
      </AnimatePresence>

      {step > 0 && (
        <button onClick={() => setStep(step - 1)} className="mt-4 text-sm text-gray-500 hover:text-blue-600">
          ← Back
        </button>
      )}
    </div>
  );
}
