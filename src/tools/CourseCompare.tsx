import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, X, Clock, IndianRupee, Briefcase, GraduationCap, CheckCircle } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useApp } from '@/context/AppContext';

export default function CourseCompare() {
  const { courses, departments } = useData();
  const { t } = useApp();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCourse = (code: string) => {
    if (selected.includes(code)) {
      setSelected(selected.filter((c) => c !== code));
    } else if (selected.length < 3) {
      setSelected([...selected, code]);
    }
  };

  const selectedCourses = courses.filter((c) => selected.includes(c.code));

  const getDept = (id: string) => departments.find((d) => d.id === id);

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <GitCompare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('Course Compare', 'படிப்பு ஒப்பீடு')}</h3>
        <span className="text-xs text-gray-400">({t('Pick 2 or 3', '2 அல்லது 3 தேர்வு')})</span>
      </div>

      {/* Course picker */}
      <div className="mb-6">
        <select
          value=""
          onChange={(e) => e.target.value && toggleCourse(e.target.value)}
          className="input-field"
        >
          <option value="">-- Add a course to compare --</option>
          {courses.filter((c) => !selected.includes(c.code)).map((c) => (
            <option key={c.id} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selected.map((code) => {
            const c = courses.find((co) => co.code === code);
            return (
              <span key={code} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm">
                {c?.name}
                <button onClick={() => toggleCourse(code)}><X className="w-3.5 h-3.5" /></button>
              </span>
            );
          })}
        </div>
      )}

      {/* Comparison table */}
      {selectedCourses.length >= 2 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="text-left p-3 font-semibold text-gray-600 dark:text-gray-300 w-32">Feature</th>
                  {selectedCourses.map((c) => (
                    <th key={c.id} className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                      {c.name}
                      <span className="block text-xs font-normal text-gray-400 mt-1">{c.level}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Department', getValue: (c: typeof selectedCourses[0]) => getDept(c.department_id)?.name || '—' },
                  { label: 'Duration', icon: Clock, getValue: (c: typeof selectedCourses[0]) => c.duration },
                  { label: 'Annual Fee', icon: IndianRupee, getValue: (c: typeof selectedCourses[0]) => `Rs. ${c.fee_annual.toLocaleString()}` },
                  { label: 'Total Fee', icon: IndianRupee, getValue: (c: typeof selectedCourses[0]) => `Rs. ${c.fee_total.toLocaleString()}` },
                  { label: 'Eligibility', icon: GraduationCap, getValue: (c: typeof selectedCourses[0]) => c.eligibility },
                  { label: 'Intake', getValue: (c: typeof selectedCourses[0]) => `${c.intake} seats` },
                  { label: 'Careers', icon: Briefcase, getValue: (c: typeof selectedCourses[0]) => c.careers },
                  { label: 'Subjects', icon: CheckCircle, getValue: (c: typeof selectedCourses[0]) => c.subjects || c.syllabus },
                ].map((row) => (
                  <tr key={row.label} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-500 dark:text-gray-400">{row.label}</td>
                    {selectedCourses.map((c) => (
                      <td key={c.id} className="p-3 text-gray-700 dark:text-gray-300">{row.getValue(c)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <div className="glass-card p-12 text-center text-gray-400">
          <GitCompare className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>{t('Select at least 2 courses to compare', 'ஒப்பிட 2 படிப்புகளை தேர்வு செய்யவும்')}</p>
        </div>
      )}
    </div>
  );
}
