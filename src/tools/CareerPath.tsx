import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, Lightbulb, ArrowRight, Compass } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useApp } from '@/context/AppContext';

// Career path data keyed by course code
const careerPaths: Record<string, {
  jobs: string[];
  higherStudies: string[];
  skills: string[];
}> = {
  'BCA': {
    jobs: ['Software Developer', 'Web Developer', 'System Analyst', 'Mobile App Developer', 'IT Support Specialist'],
    higherStudies: ['MCA', 'M.Sc. Computer Science', 'MBA (IT)', 'PG Diploma in Software Engineering'],
    skills: ['Java', 'Python', 'Web Technologies', 'Database Management', 'Software Testing'],
  },
  'BSCAIDS': {
    jobs: ['Data Scientist', 'ML Engineer', 'AI Developer', 'Data Analyst', 'Business Intelligence Analyst'],
    higherStudies: ['M.Sc. AI & Data Science', 'M.Tech AI', 'MS in Data Science', 'Ph.D. in AI'],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Data Visualization', 'Statistics'],
  },
  'BSCAIML': {
    jobs: ['ML Engineer', 'AI Researcher', 'Computer Vision Engineer', 'NLP Engineer', 'Deep Learning Specialist'],
    higherStudies: ['M.Sc. AI & ML', 'M.Tech ML', 'MS in AI', 'Ph.D. in Machine Learning'],
    skills: ['Python', 'Neural Networks', 'OpenCV', 'NLP', 'Reinforcement Learning', 'MLOps'],
  },
  'BSCCSC': {
    jobs: ['Software Developer', 'Programmer', 'System Administrator', 'IT Consultant', 'DevOps Engineer'],
    higherStudies: ['M.Sc. Computer Science', 'MCA', 'M.Tech CS', 'MBA IT'],
    skills: ['C/C++', 'Java', 'Linux', 'Networking', 'Cloud Computing'],
  },
  'BCOM': {
    jobs: ['Accountant', 'Auditor', 'Tax Consultant', 'Bank Officer', 'Financial Analyst'],
    higherStudies: ['M.Com.', 'MBA Finance', 'CA', 'CMA', 'ACCA'],
    skills: ['Accounting', 'Taxation', 'Tally', 'Excel', 'Financial Analysis'],
  },
  'BBA': {
    jobs: ['Management Trainee', 'Marketing Executive', 'HR Assistant', 'Business Analyst', 'Entrepreneur'],
    higherStudies: ['MBA', 'PGDM', 'M.Com.', 'MS in Management'],
    skills: ['Leadership', 'Marketing', 'Financial Analysis', 'Communication', 'Strategic Planning'],
  },
  'BSCBIO': {
    jobs: ['Research Associate', 'Lab Technician', 'Biotech Analyst', 'Quality Control Officer', 'Clinical Researcher'],
    higherStudies: ['M.Sc. Biotechnology', 'M.Sc. Genetics', 'Ph.D. Biotechnology', 'MBA Biotech'],
    skills: ['Lab Techniques', 'Genomics', 'Bioinformatics', 'Cell Culture', 'PCR'],
  },
  'BAENG': {
    jobs: ['Teacher', 'Content Writer', 'BPO Executive', 'Translator', 'Journalist', 'Copywriter'],
    higherStudies: ['M.A. English', 'B.Ed.', 'Journalism', 'Mass Communication'],
    skills: ['Communication', 'Writing', 'Editing', 'Public Speaking', 'Creative Writing'],
  },
  'BATAM': {
    jobs: ['Teacher', 'Translator', 'Journalist', 'Content Writer', 'Tamil Editor'],
    higherStudies: ['M.A. Tamil', 'B.Ed.', 'M.Phil. Tamil', 'Ph.D. Tamil'],
    skills: ['Tamil Literature', 'Writing', 'Translation', 'Teaching', 'Journalism'],
  },
  'BSCCDF': {
    jobs: ['Fashion Designer', 'Stylist', 'Apparel Merchandiser', 'Entrepreneur', 'Costume Designer'],
    higherStudies: ['M.Sc. Fashion Design', 'MBA Fashion Management', 'PG Diploma in Design'],
    skills: ['Fashion Illustration', 'Garment Construction', 'CAD', 'Textile Science', 'Trend Analysis'],
  },
  'MBA': {
    jobs: ['Business Manager', 'Consultant', 'Project Manager', 'Entrepreneur', 'Operations Manager'],
    higherStudies: ['Ph.D. Management', 'Executive MBA', 'CFA'],
    skills: ['Strategic Management', 'Leadership', 'Analytics', 'Finance', 'Marketing Strategy'],
  },
  'MCA': {
    jobs: ['Senior Software Engineer', 'Project Manager', 'Cloud Architect', 'System Architect', 'CTO'],
    higherStudies: ['Ph.D. Computer Science', 'M.Tech'],
    skills: ['Advanced Programming', 'Software Architecture', 'Cloud Computing', 'AI', 'DevOps'],
  },
};

export default function CareerPath() {
  const { courses } = useData();
  const { t } = useApp();
  const [courseCode, setCourseCode] = useState('');

  const selectedCourse = courses.find((c) => c.code === courseCode);
  const path = courseCode ? careerPaths[courseCode] : null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Compass className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('Career Path Explorer', 'தொழில் பாதை')}</h3>
      </div>

      <div className="mb-6">
        <select value={courseCode} onChange={(e) => setCourseCode(e.target.value)} className="input-field">
          <option value="">-- Choose a course --</option>
          {courses.map((c) => <option key={c.id} value={c.code}>{c.name}</option>)}
        </select>
      </div>

      <AnimatePresence mode="wait">
        {path && selectedCourse ? (
          <motion.div
            key={courseCode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
              {t('Career Roadmap for', 'தொழில் வரைபடம்')} {selectedCourse.name}
            </h4>

            {/* Jobs */}
            <div className="glass-card p-5">
              <h5 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-4">
                <Briefcase className="w-5 h-5 text-blue-500" /> {t('Job Opportunities', 'வேலை வாய்ப்புகள்')}
              </h5>
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-blue-200 dark:bg-blue-800" />
                {path.jobs.map((job, i) => (
                  <motion.div
                    key={job}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-10 pb-4"
                  >
                    <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-blue-600 border-2 border-white dark:border-gray-900" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{job}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Higher Studies */}
            <div className="glass-card p-5">
              <h5 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-4">
                <GraduationCap className="w-5 h-5 text-amber-500" /> {t('Higher Studies', 'உயர் படிப்பு')}
              </h5>
              <div className="flex flex-wrap gap-2">
                {path.higherStudies.map((hs, i) => (
                  <motion.span
                    key={hs}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                    className="text-sm px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                  >
                    {hs}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="glass-card p-5">
              <h5 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-4">
                <Lightbulb className="w-5 h-5 text-green-500" /> {t('Key Skills to Develop', 'முக்கிய திறன்கள்')}
              </h5>
              <div className="flex flex-wrap gap-2">
                {path.skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className="text-sm px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="glass-card p-12 text-center text-gray-400">
            <Compass className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>{t('Select a course to see the career roadmap', 'தொழில் பாதையை பார்க்க படிப்பு தேர்வு செய்யவும்')}</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
