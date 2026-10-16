import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, IndianRupee, Briefcase, BookOpen, CheckCircle, GraduationCap, Users } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useApp } from '@/context/AppContext';

export default function ExplorePage() {
  const { departments, courses, faculty } = useData();
  const { t } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [streamFilter, setStreamFilter] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  // Handle URL params
  useEffect(() => {
    const courseCode = searchParams.get('course');
    const deptCode = searchParams.get('dept');
    if (courseCode) setSelectedCourse(courseCode);
    if (deptCode) setSelectedDept(deptCode);
  }, [searchParams]);

  const streams = useMemo(() => {
    const set = new Set(departments.map((d) => d.stream));
    return ['all', ...Array.from(set)];
  }, [departments]);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const dept = departments.find((d) => d.id === c.department_id);
      if (!dept) return false;
      if (levelFilter !== 'all' && c.level !== levelFilter) return false;
      if (streamFilter !== 'all' && dept.stream !== streamFilter) return false;
      if (selectedDept && dept.code !== selectedDept) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          dept.name.toLowerCase().includes(q) ||
          (c.description || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [courses, departments, levelFilter, streamFilter, selectedDept, search]);

  const selectedCourseData = courses.find((c) => c.code === selectedCourse);
  const selectedCourseDept = selectedCourseData
    ? departments.find((d) => d.id === selectedCourseData.department_id)
    : null;
  const selectedCourseFaculty = selectedCourseData
    ? faculty.filter((f) => f.department_id === selectedCourseData.department_id)
    : [];

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {t('Explore Departments & Courses', 'துறைகள் & படிப்புகள்')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {t('Browse all departments, filter by level or stream, and click for details.', 'அனைத்து துறைகளையும் உலாவவும்.')}
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('Search courses or departments...', 'படிப்புகளை தேடவும்...')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'UG', 'PG'].map((level) => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  levelFilter === level
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {level === 'all' ? t('All Levels', 'அனைத்தும்') : level}
              </button>
            ))}
          </div>
          <select
            value={streamFilter}
            onChange={(e) => setStreamFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 dark:text-white"
          >
            {streams.map((s) => (
              <option key={s} value={s}>{s === 'all' ? t('All Streams', 'அனைத்து துறைகள்') : s}</option>
            ))}
          </select>
        </div>

        {/* Department filter chips */}
        {selectedDept && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">Filtered by:</span>
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
              {departments.find((d) => d.code === selectedDept)?.name}
            </span>
            <button onClick={() => { setSelectedDept(null); setSearchParams({}); }} className="text-gray-400 hover:text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Course cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course, i) => {
            const dept = departments.find((d) => d.id === course.department_id);
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => { setSelectedCourse(course.code); setSearchParams({ course: course.code }); }}
                className="glass-card p-5 cursor-pointer hover:shadow-xl transition-all hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    course.level === 'UG' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  }`}>
                    {course.level}
                  </span>
                  <span className="text-xs text-gray-400">{dept?.stream}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {course.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                  <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" /> {course.fee_annual.toLocaleString()}/yr</span>
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-3 font-medium">
                  {dept?.name} →
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No courses found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Slide-over detail panel */}
      <AnimatePresence>
        {selectedCourseData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => { setSelectedCourse(null); setSearchParams({}); }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-white dark:bg-gray-900 z-50 shadow-2xl overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-blue-600 text-white p-6 z-10">
                <button
                  onClick={() => { setSelectedCourse(null); setSearchParams({}); }}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
                <span className="text-xs px-2 py-1 rounded-full bg-white/20">{selectedCourseData.level}</span>
                <h2 className="text-2xl font-bold mt-2">{selectedCourseData.name}</h2>
                <p className="text-blue-200 text-sm mt-1">{selectedCourseDept?.name}</p>
              </div>

              <div className="p-6 space-y-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{selectedCourseData.description}</p>

                {/* Key info grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Clock, label: 'Duration', value: selectedCourseData.duration },
                    { icon: IndianRupee, label: 'Annual Fee', value: `Rs. ${selectedCourseData.fee_annual.toLocaleString()}` },
                    { icon: IndianRupee, label: 'Total Fee', value: `Rs. ${selectedCourseData.fee_total.toLocaleString()}` },
                    { icon: Users, label: 'Total Seats', value: `${selectedCourseData.intake}` },
                  ].map((item) => (
                    <div key={item.label} className="glass-card p-3">
                      <item.icon className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1" />
                      <div className="text-xs text-gray-500">{item.label}</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Seat availability */}
                <div className="glass-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" /> Seat Availability
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCourseData.intake}</div>
                      <div className="text-xs text-gray-500">Total Seats</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{selectedCourseData.filled_seats}</div>
                      <div className="text-xs text-gray-500">Filled</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedCourseData.intake - selectedCourseData.filled_seats}</div>
                      <div className="text-xs text-gray-500">Available</div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                      style={{ width: `${selectedCourseData.intake > 0 ? (selectedCourseData.filled_seats / selectedCourseData.intake) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {selectedCourseData.intake > 0 ? Math.round((selectedCourseData.filled_seats / selectedCourseData.intake) * 100) : 0}% filled
                  </p>
                </div>

                {/* Eligibility */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" /> Eligibility
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCourseData.eligibility}</p>
                </div>

                {/* Syllabus */}
                {selectedCourseData.syllabus && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-500" /> Syllabus / Subjects
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCourseData.subjects || selectedCourseData.syllabus}</p>
                  </div>
                )}

                {/* Careers */}
                {selectedCourseData.careers && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-amber-500" /> Career Opportunities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCourseData.careers.split(',').map((career, i) => (
                        <span key={i} className="text-xs px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                          {career.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* HOD */}
                {selectedCourseDept && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-500" /> Head of Department
                    </h3>
                    <div className="glass-card p-4">
                      <div className="font-semibold text-gray-900 dark:text-white">{selectedCourseDept.hod_name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{selectedCourseDept.hod_qualification}</div>
                    </div>
                  </div>
                )}

                {/* Faculty */}
                {selectedCourseFaculty.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Faculty</h3>
                    <div className="space-y-2">
                      {selectedCourseFaculty.map((f) => (
                        <div key={f.id} className="glass-card p-3 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{f.name}</div>
                            <div className="text-xs text-gray-500">{f.designation} | {f.qualification}</div>
                          </div>
                          <span className="text-xs text-gray-400">{f.experience} yrs</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
