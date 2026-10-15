import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bus, Search, Clock, IndianRupee, MapPin } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useApp } from '@/context/AppContext';

export default function BusRouteFinder() {
  const { busRoutes } = useData();
  const { t } = useApp();
  const [search, setSearch] = useState('');

  const filtered = busRoutes.filter((r) =>
    r.area.toLowerCase().includes(search.toLowerCase()) ||
    (r.stops || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Bus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('Smart Bus Route Finder', 'பேருந்து வழி தேடி')}</h3>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('Type your area (e.g. Erode, Perundurai, Bhavani...)', 'உங்கள் பகுதி (எ.கா. ஈரோடு, பெருந்துறை...)')}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 dark:text-white"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <AnimatePresence>
          {filtered.map((route, i) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold">{route.route_number}</span>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{route.area}</h4>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>{t('Pickup:', 'பிக்கப்:')} <strong>{route.pickup_time}</strong></span>
                  {route.drop_time && <span className="text-gray-400">| Drop: {route.drop_time}</span>}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <IndianRupee className="w-4 h-4 text-green-500" />
                  <span>{t('Annual Fee:', 'ஆண்டு கட்டணம்:')} <strong>Rs. {route.fee_annual.toLocaleString()}</strong></span>
                </div>
                {route.stops && (
                  <div className="flex items-start gap-2 text-gray-500 dark:text-gray-400 text-xs mt-2">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>{route.stops}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-12 text-center text-gray-400">
          <Bus className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>{t('No routes found for your area. Try another search.', 'உங்கள் பகுதிக்கு வழி இல்லை.')}</p>
        </div>
      )}
    </div>
  );
}
