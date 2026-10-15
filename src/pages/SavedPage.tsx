import { useState, useEffect } from 'react';
import { Bookmark, Trash2, Volume2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';

type SavedAnswer = {
  id: string;
  text: string;
  query: string;
  savedAt: string;
};

export default function SavedPage() {
  const { t } = useApp();
  const { showToast } = useToast();
  const [saved, setSaved] = useState<SavedAnswer[]>([]);

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = () => {
    const raw = localStorage.getItem('nasc-saved-answers-full');
    if (raw) {
      setSaved(JSON.parse(raw));
    }
  };

  const removeSaved = (id: string) => {
    const filtered = saved.filter((s) => s.id !== id);
    setSaved(filtered);
    localStorage.setItem('nasc-saved-answers-full', JSON.stringify(filtered));
    // Also update the simple bookmarks list
    const simple = JSON.parse(localStorage.getItem('nasc-saved-answers') || '[]') as string[];
    const updated = simple.filter((sid) => sid !== id);
    localStorage.setItem('nasc-saved-answers', JSON.stringify(updated));
    showToast('Removed from saved', 'info');
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-IN';
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t('My Saved Answers', 'என் சேமித்த பதில்கள்')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {t('Bookmark chatbot answers to revisit them anytime.', 'சேமித்த பதில்களை பார்க்க.')}
        </p>

        {saved.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Bookmark className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {t('No saved answers yet. Bookmark answers from the chatbot to see them here.', 'இன்னும் சேமித்த பதில்கள் இல்லை.')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {saved.map((item) => (
              <div key={item.id} className="glass-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {item.query && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                        Q: {item.query}
                      </div>
                    )}
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item.text}</p>
                    <div className="text-xs text-gray-400 mt-2">{item.savedAt}</div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => speak(item.text)} className="p-2 text-gray-400 hover:text-blue-500 rounded-lg">
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeSaved(item.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
