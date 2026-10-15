import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useApp } from '@/context/AppContext';

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, past: false });

  useEffect(() => {
    const calculate = () => {
      const target = new Date(targetDate).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, past: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        past: false,
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function CountdownCard({ event }: { event: { id: string; title: string; event_date: string; event_time: string; venue: string; description: string } }) {
  const time = useCountdown(event.event_date);

  const addToCalendar = () => {
    const date = new Date(event.event_date);
    const startStr = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = new Date(date.getTime() + 60 * 60 * 1000);
    const endStr = end.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${startStr}\nDTEND:${endStr}\nSUMMARY:${event.title}\nLOCATION:${event.venue || ''}\nDESCRIPTION:${event.description || ''}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
          {event.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{event.description}</p>}
        </div>
        <button onClick={addToCalendar} className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200" title="Add to calendar">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {event.event_date}</span>
        {event.event_time && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {event.event_time}</span>}
        {event.venue && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {event.venue}</span>}
      </div>

      {time.past ? (
        <div className="text-center py-3 text-gray-400 text-sm">Event has passed</div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Days', value: time.days },
            { label: 'Hours', value: time.hours },
            { label: 'Min', value: time.minutes },
            { label: 'Sec', value: time.seconds },
          ].map((unit) => (
            <div key={unit.label} className="text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">{String(unit.value).padStart(2, '0')}</div>
              <div className="text-xs text-gray-500">{unit.label}</div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function EventsCountdown() {
  const { events } = useData();
  const { t } = useApp();
  const upcoming = events.filter((e) => new Date(e.event_date) >= new Date()).sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('Events Countdown', 'நிகழ்வு கவுண்டவுன்')}</h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {upcoming.map((event) => (
          <CountdownCard key={event.id} event={event} />
        ))}
      </div>

      {upcoming.length === 0 && (
        <div className="glass-card p-12 text-center text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>{t('No upcoming events. Check back later!', 'வரவிருக்கும் நிகழ்வுகள் இல்லை.')}</p>
        </div>
      )}
    </div>
  );
}
