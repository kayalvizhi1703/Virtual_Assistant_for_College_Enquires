import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, IndianRupee } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useData } from '@/context/DataContext';
import { useApp } from '@/context/AppContext';

const HOSTEL_FEE = 40000;
const HOSTEL_FEE_WOMEN = 42000;
const TRANSPORT_FEE_DEFAULT = 12000;

export default function FeeCalculator() {
  const { courses, busRoutes } = useData();
  const { t, language } = useApp();
  const [courseCode, setCourseCode] = useState('');
  const [hostel, setHostel] = useState(false);
  const [transport, setTransport] = useState(false);
  const [busArea, setBusArea] = useState('');
  const [isWomen, setIsWomen] = useState(false);

  const selectedCourse = courses.find((c) => c.code === courseCode);
  const transportFee = busRoutes.find((b) => b.area === busArea)?.fee_annual || TRANSPORT_FEE_DEFAULT;

  const breakdown = useMemo(() => {
    const tuition = selectedCourse?.fee_annual || 0;
    const hostelFee = hostel ? (isWomen ? HOSTEL_FEE_WOMEN : HOSTEL_FEE) : 0;
    const transportF = transport ? transportFee : 0;
    const yearly = tuition + hostelFee + transportF;
    const years = selectedCourse?.duration?.includes('2') ? 2 : 3;
    return {
      tuition,
      hostelFee,
      transportF,
      yearly,
      total: yearly * years,
      years,
    };
  }, [selectedCourse, hostel, transport, transportFee, isWomen]);

  const chartData = [
    { name: 'Tuition', value: breakdown.tuition, color: '#3b82f6' },
    ...(hostel ? [{ name: 'Hostel', value: breakdown.hostelFee, color: '#f59e0b' }] : []),
    ...(transport ? [{ name: 'Transport', value: breakdown.transportF, color: '#10b981' }] : []),
  ].filter((d) => d.value > 0);

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('Fee Calculator', 'கட்டண கணிப்பாளர்')}</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Select Course', 'படிப்பு தேர்வு')}</label>
            <select value={courseCode} onChange={(e) => setCourseCode(e.target.value)} className="input-field">
              <option value="">-- Choose a course --</option>
              {courses.map((c) => <option key={c.id} value={c.code}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender (for hostel fee)</label>
            <div className="flex gap-2">
              <button onClick={() => setIsWomen(false)} className={`flex-1 py-2 rounded-lg text-sm font-medium ${!isWomen ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>Men</button>
              <button onClick={() => setIsWomen(true)} className={`flex-1 py-2 rounded-lg text-sm font-medium ${isWomen ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>Women</button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('Hostel Required?', 'விடுதி தேவை?')}</span>
            <button onClick={() => setHostel(!hostel)} className={`w-12 h-6 rounded-full transition-colors ${hostel ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'} relative`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${hostel ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('Transport Required?', 'பேருந்து தேவை?')}</span>
            <button onClick={() => setTransport(!transport)} className={`w-12 h-6 rounded-full transition-colors ${transport ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'} relative`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${transport ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {transport && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Bus Route Area', 'பேருந்து பகுதி')}</label>
              <select value={busArea} onChange={(e) => setBusArea(e.target.value)} className="input-field">
                <option value="">-- Select area --</option>
                {busRoutes.map((b) => <option key={b.id} value={b.area}>{b.area} (Rs.{b.fee_annual}/yr)</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          {selectedCourse ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{t('Estimated Cost Breakdown', 'செலவு விவரம்')}</h4>

              {/* Pie chart */}
              {chartData.length > 0 && (
                <div className="h-48 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                        {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: any) => `Rs. ${Number(v).toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="space-y-2">
                {[
                  { label: 'Tuition (per year)', value: breakdown.tuition, color: 'text-blue-600' },
                  ...(hostel ? [{ label: 'Hostel (per year)', value: breakdown.hostelFee, color: 'text-amber-600' }] : []),
                  ...(transport ? [{ label: 'Transport (per year)', value: breakdown.transportF, color: 'text-green-600' }] : []),
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                    <span className={`font-semibold ${item.color}`}>Rs. {item.value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between text-sm font-bold">
                  <span className="text-gray-900 dark:text-white">{t('Yearly Total', 'ஆண்டு மொத்தம்')}</span>
                  <span className="text-blue-600 dark:text-blue-400">Rs. {breakdown.yearly.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mt-2">
                  <span className="text-gray-900 dark:text-white">{t(`Total (${breakdown.years} years)`, `${breakdown.years} ஆண்டு மொத்தம்`)}</span>
                  <span className="text-blue-600 dark:text-blue-400 flex items-center"><IndianRupee className="w-4 h-4" />{breakdown.total.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">* Sample figures. Contact college for exact fees.</p>
              </div>
            </motion.div>
          ) : (
            <div className="glass-card p-12 text-center text-gray-400">
              <Calculator className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>{t('Select a course to calculate fees', 'கட்டணம் கணக்கிட படிப்பு தேர்வு செய்யவும்')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
