import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Calculator, Search, CheckSquare, Map as MapIcon,
  GitCompare, Compass, Bus, Calendar, Phone,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import CourseFinder from '@/tools/CourseFinder';
import FeeCalculator from '@/tools/FeeCalculator';
import EligibilityChecker from '@/tools/EligibilityChecker';
import AdmissionTracker from '@/tools/AdmissionTracker';
import CampusMap from '@/tools/CampusMap';
import CourseCompare from '@/tools/CourseCompare';
import CareerPath from '@/tools/CareerPath';
import BusRouteFinder from '@/tools/BusRouteFinder';
import EventsCountdown from '@/tools/EventsCountdown';
import CallbackForm from '@/tools/CallbackForm';

const tabs = [
  { id: 'finder', labelEn: 'Course Finder', labelTa: 'படிப்பு கண்டுபிடிப்பாளர்', icon: Brain },
  { id: 'fee', labelEn: 'Fee Calculator', labelTa: 'கட்டண கணிப்பாளர்', icon: Calculator },
  { id: 'eligibility', labelEn: 'Eligibility Checker', labelTa: 'தகுதி சரிபார்ப்பு', icon: Search },
  { id: 'tracker', labelEn: 'Admission Tracker', labelTa: 'சேர்க்கை கண்காணிப்பு', icon: CheckSquare },
  { id: 'map', labelEn: 'Campus Map', labelTa: 'வளாக வரைபடம்', icon: MapIcon },
  { id: 'compare', labelEn: 'Course Compare', labelTa: 'படிப்பு ஒப்பீடு', icon: GitCompare },
  { id: 'career', labelEn: 'Career Path', labelTa: 'தொழில் பாதை', icon: Compass },
  { id: 'bus', labelEn: 'Bus Routes', labelTa: 'பேருந்து வழி', icon: Bus },
  { id: 'countdown', labelEn: 'Events Countdown', labelTa: 'நிகழ்வு கவுண்டவுன்', icon: Calendar },
  { id: 'callback', labelEn: 'Get a Call Back', labelTa: 'அழைப்பு கோரு', icon: Phone },
];

export default function ToolsPage() {
  const { t, language } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('finder');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tabs.find((tb) => tb.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const switchTab = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t('Interactive Tools', 'இடைசெயல் கருவிகள்')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {t('Smart tools to help you explore courses, calculate costs, and plan your admission.', 'படிப்பு, கட்டணம், சேர்க்கை திட்டமிட கருவிகள்.')}
        </p>

        {/* Tab buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {language === 'ta' ? tab.labelTa : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="glass-card p-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'finder' && <CourseFinder />}
              {activeTab === 'fee' && <FeeCalculator />}
              {activeTab === 'eligibility' && <EligibilityChecker />}
              {activeTab === 'tracker' && <AdmissionTracker />}
              {activeTab === 'map' && <CampusMap />}
              {activeTab === 'compare' && <CourseCompare />}
              {activeTab === 'career' && <CareerPath />}
              {activeTab === 'bus' && <BusRouteFinder />}
              {activeTab === 'countdown' && <EventsCountdown />}
              {activeTab === 'callback' && <CallbackForm />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
