import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CornerDownLeft } from 'lucide-react';
import { useData } from '@/context/DataContext';

type CommandItem = {
  id: string;
  label: string;
  type: 'page' | 'course' | 'feature';
  path: string;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { courses, departments } = useData();

  // Keyboard shortcut: "/" or Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setOpen(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    if (!open) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  // Build command list
  const commands: CommandItem[] = [
    { id: 'home', label: 'Home', type: 'page', path: '/' },
    { id: 'explore', label: 'Explore Departments & Courses', type: 'page', path: '/explore' },
    { id: 'tools', label: 'Interactive Tools', type: 'page', path: '/tools' },
    { id: 'chat', label: 'Chat with Nandha Assistant', type: 'page', path: '/chat' },
    { id: 'notifications', label: 'Notifications', type: 'page', path: '/notifications' },
    { id: 'contact', label: 'Contact Us', type: 'page', path: '/contact' },
    { id: 'saved', label: 'My Saved Answers', type: 'feature', path: '/saved' },
    { id: 'test', label: 'NLP Test Page', type: 'feature', path: '/test' },
    { id: 'admin', label: 'Admin Panel', type: 'page', path: '/admin' },
    // Tools
    { id: 'course-finder', label: 'Course Finder Quiz', type: 'feature', path: '/tools?tab=finder' },
    { id: 'fee-calc', label: 'Fee Calculator', type: 'feature', path: '/tools?tab=fee' },
    { id: 'eligibility', label: 'Eligibility Checker', type: 'feature', path: '/tools?tab=eligibility' },
    { id: 'admission-tracker', label: 'Admission Journey Tracker', type: 'feature', path: '/tools?tab=tracker' },
    { id: 'campus-map', label: 'Interactive Campus Map', type: 'feature', path: '/tools?tab=map' },
    { id: 'compare', label: 'Course Compare', type: 'feature', path: '/tools?tab=compare' },
    { id: 'career', label: 'Career Path Explorer', type: 'feature', path: '/tools?tab=career' },
    { id: 'bus', label: 'Bus Route Finder', type: 'feature', path: '/tools?tab=bus' },
    { id: 'countdown', label: 'Events Countdown', type: 'feature', path: '/tools?tab=countdown' },
    { id: 'callback', label: 'Get a Call Back', type: 'feature', path: '/tools?tab=callback' },
  ];

  // Add courses
  courses.forEach((c) => {
    commands.push({ id: `course-${c.id}`, label: c.name, type: 'course', path: `/explore?course=${c.code}` });
  });
  // Add departments
  departments.forEach((d) => {
    commands.push({ id: `dept-${d.id}`, label: d.name, type: 'course', path: `/explore?dept=${d.code}` });
  });

  const filtered = query
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  const handleSelect = (cmd: CommandItem) => {
    navigate(cmd.path);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) handleSelect(filtered[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-xl"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search pages, courses, tools..."
                  className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
                />
                <kbd className="text-xs text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">ESC</kbd>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {filtered.length === 0 && (
                  <div className="p-4 text-center text-gray-400 text-sm">No results found</div>
                )}
                {filtered.map((cmd, i) => (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelect(cmd)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                      i === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        cmd.type === 'page' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                        cmd.type === 'course' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                      }`}>
                        {cmd.type}
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{cmd.label}</span>
                    </div>
                    {i === selectedIndex && <CornerDownLeft className="w-4 h-4 text-gray-400" />}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
