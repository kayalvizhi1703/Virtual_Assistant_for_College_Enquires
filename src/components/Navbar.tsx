import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, Languages, MessageCircle, Search } from 'lucide-react';
import Logo from './Logo';
import { useApp } from '@/context/AppContext';

const navLinks = [
  { to: '/', labelEn: 'Home', labelTa: 'முகப்பு' },
  { to: '/explore', labelEn: 'Explore', labelTa: 'ஆய்வு' },
  { to: '/tools', labelEn: 'Tools', labelTa: 'கருவிகள்' },
  { to: '/notifications', labelEn: 'Notifications', labelTa: 'அறிவிப்புகள்' },
  { to: '/contact', labelEn: 'Contact', labelTa: 'தொடர்பு' },
];

export default function Navbar() {
  const { theme, toggleTheme, language, toggleLanguage, t } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl shadow-md'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <Logo size={40} />
              <span className={`font-bold text-lg hidden sm:block ${
                scrolled ? 'text-gray-900 dark:text-white' : 'text-white'
              }`}>
                NASC
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? scrolled ? 'text-blue-600 dark:text-blue-400' : 'text-amber-400'
                      : scrolled ? 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {t(link.labelEn, link.labelTa)}
                </Link>
              ))}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/chat')}
                className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  scrolled
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-amber-500 text-white hover:bg-amber-600'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Ask Nandha
              </button>

              <button
                onClick={toggleLanguage}
                className={`p-2 rounded-lg transition-colors ${
                  scrolled ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-white hover:bg-white/10'
                }`}
                title="Toggle language"
              >
                <div className="flex items-center gap-1">
                  <Languages className="w-5 h-5" />
                  <span className="text-xs font-bold">{language === 'en' ? 'EN' : 'த'}</span>
                </div>
              </button>

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  scrolled ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-white hover:bg-white/10'
                }`}
                title="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setMobileOpen(true)}
                className={`md:hidden p-2 rounded-lg ${
                  scrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white'
                }`}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white dark:bg-gray-900 z-50 md:hidden shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <Logo size={36} />
                <button onClick={() => setMobileOpen(false)} className="p-2 text-gray-500 dark:text-gray-400">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-lg font-medium transition-colors ${
                      location.pathname === link.to
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {t(link.labelEn, link.labelTa)}
                  </Link>
                ))}
                <Link to="/chat" className="btn-primary mt-4 w-full">
                  <MessageCircle className="w-5 h-5" />
                  Ask Nandha
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
