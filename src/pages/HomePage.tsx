import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, BookOpen, GraduationCap, Trophy, Users, Building2,
  CheckCircle, Star, MapPin, Phone, Award, TrendingUp,
} from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';
import { useData } from '@/context/DataContext';
import { useApp } from '@/context/AppContext';

const floatingShapes = [
  { className: 'top-20 left-10 w-32 h-32 rounded-full bg-blue-400/20', delay: 0 },
  { className: 'top-40 right-20 w-24 h-24 rounded-full bg-amber-400/20', delay: 1 },
  { className: 'bottom-32 left-1/4 w-40 h-40 rounded-full bg-blue-300/10', delay: 2 },
  { className: 'top-1/3 right-1/3 w-20 h-20 rounded-full bg-amber-300/15', delay: 1.5 },
  { className: 'bottom-20 right-10 w-28 h-28 rounded-full bg-blue-400/15', delay: 0.5 },
];

export default function HomePage() {
  const { departments, courses, settings } = useData();
  const { t } = useApp();

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
        {/* Animated floating shapes */}
        {floatingShapes.map((shape, i) => (
          <motion.div
            key={i}
            className={`absolute ${shape.className} animate-float`}
            style={{ animationDelay: `${shape.delay}s` }}
          />
        ))}

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm mb-6"
          >
            <Star className="w-4 h-4 text-amber-400" />
            NAAC B+ Accredited | Since {settings?.established || 2000}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white leading-tight text-balance mb-4"
          >
            Your Smart Guide to{' '}
            <span className="text-amber-400">Nandha Arts and Science College</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg text-blue-100 max-w-2xl mx-auto mb-10"
          >
            {t(
              'Explore courses, calculate fees, find your perfect program, and chat with our AI assistant — all in one place.',
              'படிப்புகளை ஆராயுங்கள், கட்டணத்தை கணக்கிடுங்கள், உங்களுக்கான படிப்பை கண்டுபிடியுங்கள்.'
            )}
          </motion.p>

          {/* Animated counters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-3xl mx-auto"
          >
            {[
              { label: 'Departments', value: 18, suffix: '+', icon: Building2 },
              { label: 'Recruiters', value: 300, suffix: '+', icon: Users },
              { label: 'Highest Package', value: 42, suffix: ' LPA', icon: TrendingUp },
              { label: 'Since', value: 2000, suffix: '', icon: GraduationCap },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card bg-white/10 border-white/20 p-4 text-center"
              >
                <stat.icon className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-white">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-blue-200 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/chat" className="btn-gold text-base">
              Start Chat
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/tools?tab=finder" className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur border-2 border-white/30 text-white font-semibold hover:bg-white/20 transition-all">
              Find My Course
            </Link>
          </motion.div>
        </div>

        {/* Wave divider */}
        <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ height: '80px' }}>
          <path d="M0,60 C320,120 720,0 1440,60 L1440,120 L0,120 Z" fill="currentColor" className="text-gray-50 dark:text-gray-950" />
        </svg>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-4">
                About Our College
              </div>
              <h2 className="section-title mb-4">
                {settings?.college_name || 'Nandha Arts and Science College'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {t(
                  `A self-financed, co-educational institution established in ${settings?.established || 2000} by ${settings?.trust || 'Sri Nandha Educational Trust'}. ${settings?.affiliation ? 'Affiliated to ' + settings.affiliation : ''}. NAAC Re-accredited with ${settings?.naac_grade || 'B+'} Grade (CGPA ${settings?.naac_cgpa || 2.64}).`,
                  `ஸ்ரீ நந்தா கல்வி அறக்கட்டளையால் ${settings?.established || 2000}ல் நிறுவப்பட்டது. NAAC ${settings?.naac_grade || 'B+'} தரம்.`
                )}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Award, label: 'Motto', value: settings?.motto || 'Learn, Serve and Succeed' },
                  { icon: GraduationCap, label: 'Principal', value: settings?.principal || 'Dr. S. Manoharan' },
                  { icon: BookOpen, label: 'Affiliation', value: settings?.affiliation || 'Bharathiar University' },
                  { icon: Star, label: 'NAAC Grade', value: `${settings?.naac_grade || 'B+'} (CGPA ${settings?.naac_cgpa || 2.64})` },
                ].map((item) => (
                  <div key={item.label} className="glass-card p-4">
                    <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.label}</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Building2, label: 'Departments', value: '18+', color: 'from-blue-500 to-blue-600' },
                { icon: GraduationCap, label: 'Programs', value: '20+', color: 'from-amber-500 to-amber-600' },
                { icon: Users, label: 'Recruiters', value: '300+', color: 'from-green-500 to-green-600' },
                { icon: Trophy, label: 'Highest Package', value: '42 LPA', color: 'from-purple-500 to-purple-600' },
              ].map((card) => (
                <div
                  key={card.label}
                  className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white shadow-lg`}
                >
                  <card.icon className="w-8 h-8 mb-3" />
                  <div className="text-3xl font-bold">{card.value}</div>
                  <div className="text-sm text-white/80 mt-1">{card.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* DEPARTMENTS PREVIEW */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Departments & Courses</h2>
            <p className="section-subtitle">Explore our {departments.length}+ departments across multiple streams</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {departments.slice(0, 8).map((dept, i) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/explore?dept=${dept.code}`}
                  className="block glass-card p-5 h-full hover:shadow-xl transition-all hover:scale-[1.02] group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {dept.stream}
                    </span>
                    <span className="text-xs text-gray-400">{dept.code}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{dept.description}</p>
                  <div className="text-xs text-gray-400 mt-3">HOD: {dept.hod_name}</div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/explore" className="btn-outline">
              View All Departments
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* PLACEMENT SECTION */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Placement Highlights</h2>
            <p className="text-blue-200 mt-2">Dedicated placement cell with 300+ recruiting partners</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Highest Package', value: 42, suffix: ' LPA' },
              { label: 'Average Package', value: 5.5, suffix: ' LPA' },
              { label: 'Recruiters', value: 300, suffix: '+' },
              { label: 'Placement Rate', value: 85, suffix: '%' },
            ].map((stat) => (
              <div key={stat.label} className="text-center bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-4xl font-bold text-amber-400">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-blue-200 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-6">Package Distribution (as reported)</h3>
            <div className="space-y-4">
              {[
                { range: '3-5 LPA', pct: 40, count: 120 },
                { range: '5-10 LPA', pct: 30, count: 90 },
                { range: '10-20 LPA', pct: 20, count: 60 },
                { range: '20-42 LPA', pct: 10, count: 30 },
              ].map((bar) => (
                <div key={bar.range}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{bar.range}</span>
                    <span className="text-amber-400">{bar.count} students</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bar.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <div className="flex flex-wrap justify-center gap-2">
              {['TCS', 'Infosys', 'Wipro', 'CTS', 'HCL', 'Zoho', 'Accenture', 'Capgemini'].map((company) => (
                <span
                  key={company}
                  className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur text-sm font-medium"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12"
          >
            <h2 className="section-title mb-4">Ready to Join Nandha?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Take our Course Finder quiz, calculate your fees, or chat with our AI assistant to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tools?tab=finder" className="btn-primary">
                Find My Course
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/tools?tab=callback" className="btn-outline">
                Get a Call Back
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
