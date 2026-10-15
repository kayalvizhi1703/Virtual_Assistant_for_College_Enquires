import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Play, FlaskConical } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useApp } from '@/context/AppContext';
import { IntentMatcher, detectLanguage } from '@/nlp/matcher';
import type { Intent } from '@/lib/supabase';

type TestResult = {
  query: string;
  language: string;
  expectedIntent: string;
  predictedIntent: string | null;
  confidence: number;
  passed: boolean;
};

const testQuestions: { query: string; expected: string }[] = [
  // English
  { query: 'hello', expected: 'greeting' },
  { query: 'what courses are available', expected: 'courses_list' },
  { query: 'how much are the fees', expected: 'fees_general' },
  { query: 'what is the hostel facility', expected: 'hostel_facilities' },
  { query: 'is bus transport available', expected: 'transport' },
  { query: 'what is the placement record', expected: 'placement_general' },
  { query: 'who is the principal', expected: 'principal' },
  { query: 'what is the NAAC grade', expected: 'accreditation' },
  { query: 'how to get admission', expected: 'admission_process' },
  { query: 'what documents are needed for admission', expected: 'admission_documents' },
  { query: 'tell me about BCA course', expected: 'bca_course' },
  { query: 'what is the B.Com fee structure', expected: 'bcom_course' },
  { query: 'library timings', expected: 'library' },
  { query: 'where is the college located', expected: 'location' },
  { query: 'what is the college motto', expected: 'motto' },
  { query: 'top recruiting companies', expected: 'placement_recruiters' },
  { query: 'highest salary package offered', expected: 'placement_packages' },
  { query: 'thank you', expected: 'thanks' },
  { query: 'which university is the college affiliated to', expected: 'affiliation' },
  { query: 'when was the college established', expected: 'established' },

  // Tamil
  { query: 'வணக்கம்', expected: 'greeting' },
  { query: 'கட்டணம் எவ்வளவு', expected: 'fees_general' },

  // Tanglish
  { query: 'fees evlo', expected: 'fees_general' },
  { query: 'hostel irukka', expected: 'hostel_facilities' },
  { query: 'BCA eligibility enna', expected: 'bca_course' },
];

export default function TestPage() {
  const { intents, settings } = useData();
  const { t } = useApp();
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [matcher, setMatcher] = useState<IntentMatcher | null>(null);

  useEffect(() => {
    if (intents.length > 0) {
      const threshold = settings?.confidence_threshold || 0.35;
      setMatcher(new IntentMatcher(intents as Intent[], threshold));
    }
  }, [intents, settings]);

  const runTests = () => {
    if (!matcher) return;
    setRunning(true);
    const testResults: TestResult[] = testQuestions.map((q) => {
      const result = matcher.match(q.query);
      const lang = detectLanguage(q.query);
      return {
        query: q.query,
        language: lang,
        expectedIntent: q.expected,
        predictedIntent: result.intent?.intent_name || null,
        confidence: result.confidence,
        passed: result.intent?.intent_name === q.expected,
      };
    });
    setResults(testResults);
    setRunning(false);
  };

  const passedCount = results.filter((r) => r.passed).length;
  const accuracy = results.length > 0 ? (passedCount / results.length) * 100 : 0;

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-2">
          <FlaskConical className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {t('NLP Test Suite', 'NLP சோதனை')}
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {t('Runs 25 sample questions (English, Tamil, Tanglish) through the intent matcher.', '25 கேள்விகள் மூலம் சோதனை.')}
        </p>

        {/* Run button + stats */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <button onClick={runTests} disabled={running || !matcher} className="btn-primary disabled:opacity-50">
              <Play className="w-5 h-5" />
              {running ? 'Running...' : t('Run Tests', 'சோதனையை இயக்கு')}
            </button>
            {results.length > 0 && (
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{passedCount}</div>
                  <div className="text-gray-500">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">{results.length - passedCount}</div>
                  <div className="text-gray-500">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{accuracy.toFixed(0)}%</div>
                  <div className="text-gray-500">Accuracy</div>
                </div>
              </div>
            )}
          </div>

          {results.length > 0 && (
            <div className="mt-4 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${accuracy}%` }}
                className={`h-full rounded-full ${accuracy >= 80 ? 'bg-green-500' : accuracy >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
              />
            </div>
          )}
        </div>

        {/* Results table */}
        {results.length > 0 && (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  <tr>
                    <th className="text-left p-3 font-semibold">#</th>
                    <th className="text-left p-3 font-semibold">Query</th>
                    <th className="text-left p-3 font-semibold">Language</th>
                    <th className="text-left p-3 font-semibold">Expected</th>
                    <th className="text-left p-3 font-semibold">Predicted</th>
                    <th className="text-left p-3 font-semibold">Confidence</th>
                    <th className="text-left p-3 font-semibold">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-400">{i + 1}</td>
                      <td className="p-3 font-medium text-gray-900 dark:text-white">{r.query}</td>
                      <td className="p-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          {r.language}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{r.expectedIntent}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{r.predictedIntent || '—'}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{(r.confidence * 100).toFixed(0)}%</td>
                      <td className="p-3">
                        {r.passed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
