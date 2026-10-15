import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Language = 'en' | 'ta';

type AppContextType = {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  t: (en: string, ta: string) => string;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('nasc-theme') as Theme | null;
    return saved || 'light';
  });
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('nasc-lang') as Language | null;
    return saved || 'en';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('nasc-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('nasc-lang', language);
  }, [language]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  const toggleLanguage = () => setLanguage((l) => (l === 'en' ? 'ta' : 'en'));
  const t = (en: string, ta: string) => (language === 'ta' ? ta : en);

  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, toggleLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
