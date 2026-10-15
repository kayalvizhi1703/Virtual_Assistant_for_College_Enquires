import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, MapPin, Clock, Info } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const zones = [
  { id: 'main-block', name: { en: 'Main Block', ta: 'பிரதான கட்டிடம்' }, x: 40, y: 30, w: 20, h: 15, color: '#3b82f6', desc: { en: 'Administrative offices, principal\'s office, admission cell', ta: 'நிர்வாக அலுவலகங்கள்' }, timing: '9:00 AM - 5:00 PM' },
  { id: 'library', name: { en: 'Digital Library', ta: 'டிஜிட்டல் நூலகம்' }, x: 65, y: 25, w: 18, h: 12, color: '#f59e0b', desc: { en: 'Books, e-resources, journals, reading hall, internet browsing', ta: 'புத்தகங்கள், இ-வளங்கள்' }, timing: '8:00 AM - 6:00 PM' },
  { id: 'cs-lab', name: { en: 'Computer Labs', ta: 'கணினி ஆய்வகம்' }, x: 15, y: 50, w: 18, h: 12, color: '#10b981', desc: { en: 'Programming labs with latest hardware, AI/ML GPU workstations', ta: 'நிரலாக்க ஆய்வகம்' }, timing: '9:00 AM - 4:30 PM' },
  { id: 'science-lab', name: { en: 'Science Labs', ta: 'அறிவியல் ஆய்வகம்' }, x: 40, y: 50, w: 18, h: 12, color: '#8b5cf6', desc: { en: 'Biotechnology, Chemistry, Physics labs with modern equipment', ta: 'உயிரி, வேதியியல், இயற்பியல்' }, timing: '9:00 AM - 4:30 PM' },
  { id: 'mens-hostel', name: { en: "Men's Hostel", ta: 'ஆண்கள் விடுதி' }, x: 70, y: 55, w: 15, h: 12, color: '#ef4444', desc: { en: 'Residential facility with mess, Wi-Fi, study hall, recreation', ta: 'உணவு, Wi-Fi, படிப்பு அறை' }, timing: '24/7' },
  { id: 'womens-hostel', name: { en: "Women's Hostel", ta: 'பெண்கள் விடுதி' }, x: 70, y: 72, w: 15, h: 12, color: '#ec4899', desc: { en: 'Separate residential facility with 24/7 security and mess', ta: 'தனி விடுதி, 24/7 பாதுகாப்பு' }, timing: '24/7' },
  { id: 'canteen', name: { en: 'Canteen', ta: 'உணவகம்' }, x: 20, y: 72, w: 15, h: 10, color: '#f97316', desc: { en: 'Hygienic food, snacks, beverages at affordable prices', ta: 'சுகாதார உணவு' }, timing: '8:00 AM - 5:00 PM' },
  { id: 'sports', name: { en: 'Sports Ground', ta: 'விளையாட்டு மைதானம்' }, x: 40, y: 72, w: 20, h: 12, color: '#14b8a6', desc: { en: 'Cricket, football, basketball, volleyball, athletics track', ta: 'கிரிக்கெட், கால்பந்து' }, timing: '6:00 AM - 6:00 PM' },
  { id: 'bus-stop', name: { en: 'Bus Stop', ta: 'பேருந்து நிறுத்தம்' }, x: 10, y: 25, w: 12, h: 8, color: '#6366f1', desc: { en: 'College bus pickup and drop point for all routes', ta: 'பேருந்து நிறுத்தம்' }, timing: '6:30 AM - 6:30 PM' },
];

export default function CampusMap() {
  const { t, language } = useApp();
  const [selected, setSelected] = useState<typeof zones[0] | null>(null);
  const [tourIndex, setTourIndex] = useState(-1);
  const [autoTour, setAutoTour] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTour = () => {
    setAutoTour(true);
    setTourIndex(0);
  };

  useEffect(() => {
    if (autoTour && tourIndex >= 0 && tourIndex < zones.length) {
      setSelected(zones[tourIndex]);
      timerRef.current = setTimeout(() => {
        setTourIndex((i) => i + 1);
      }, 3000);
    }
    if (autoTour && tourIndex >= zones.length) {
      setAutoTour(false);
      setTourIndex(-1);
      setSelected(null);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [autoTour, tourIndex]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('Interactive Campus Map', 'இடைசெயல் வளாக வரைபடம்')}</h3>
        <button onClick={startTour} disabled={autoTour} className="btn-primary text-sm py-2 disabled:opacity-50">
          <Play className="w-4 h-4" /> {t('Virtual Tour', 'மெய்நிகர் சுற்றுலா')}
        </button>
      </div>

      {/* Campus SVG map */}
      <div className="relative glass-card p-4 overflow-hidden">
        <svg viewBox="0 0 100 95" className="w-full h-auto" style={{ minHeight: '400px' }}>
          {/* Background */}
          <rect x="0" y="0" width="100" height="95" rx="2" fill="#e5e7eb" className="dark:fill-gray-800" />
          {/* Roads */}
          <line x1="0" y1="45" x2="100" y2="45" stroke="#9ca3af" strokeWidth="0.5" strokeDasharray="2,1" />
          <line x1="50" y1="0" x2="50" y2="95" stroke="#9ca3af" strokeWidth="0.5" strokeDasharray="2,1" />
          <line x1="0" y1="20" x2="100" y2="20" stroke="#9ca3af" strokeWidth="0.3" />
          {/* Green areas */}
          <rect x="5" y="5" width="8" height="10" rx="1" fill="#86efac" opacity="0.4" />
          <rect x="87" y="5" width="8" height="10" rx="1" fill="#86efac" opacity="0.4" />

          {/* Zones */}
          {zones.map((zone) => {
            const isSelected = selected?.id === zone.id;
            return (
              <g key={zone.id} onClick={() => !autoTour && setSelected(zone)} style={{ cursor: 'pointer' }}>
                <rect
                  x={zone.x} y={zone.y} width={zone.w} height={zone.h}
                  rx="1.5"
                  fill={zone.color}
                  opacity={isSelected ? 0.9 : 0.6}
                  stroke={isSelected ? '#1e40af' : 'none'}
                  strokeWidth={isSelected ? 0.5 : 0}
                >
                  <animate attributeName="opacity" values="0.6;0.8;0.6" dur="2s" repeatCount="indefinite" />
                </rect>
                <text
                  x={zone.x + zone.w / 2}
                  y={zone.y + zone.h / 2 + 1}
                  textAnchor="middle"
                  fontSize="2.5"
                  fontWeight="600"
                  fill="white"
                >
                  {zone.name[language].length > 12 ? zone.name[language].slice(0, 11) + '…' : zone.name[language]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Zone detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="glass-card p-5 mt-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: selected.color }} />
                <h4 className="font-semibold text-gray-900 dark:text-white">{selected.name[language]}</h4>
              </div>
              {!autoTour && (
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-red-500">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Info className="w-4 h-4 text-blue-500" /> {selected.desc[language]}
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 text-amber-500" /> {t('Timings:', 'நேரம்:')} {selected.timing}
              </div>
            </div>
            {autoTour && (
              <div className="mt-3 text-xs text-blue-600 dark:text-blue-400 font-medium">
                Tour: Zone {tourIndex + 1} of {zones.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
