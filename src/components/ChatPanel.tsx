import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ThumbsUp, ThumbsDown, Bookmark, Volume2, Mic, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useData } from '@/context/DataContext';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { IntentMatcher, detectLanguage, type MatchResult } from '@/nlp/matcher';
import type { Intent } from '@/lib/supabase';

export type ChatMessage = {
  id: string;
  role: 'user' | 'bot';
  text: string;
  intent?: string | null;
  confidence?: number;
  suggestions?: string[];
  saved?: boolean;
};

type ChatPanelProps = {
  fullWidth?: boolean;
};

const FALLBACK_RESPONSE_EN =
  "Sorry, I couldn't understand that. Please contact our office at +91 424 2260000 or info@nandhaarts.ac.in. You can also try asking about: courses, fees, admissions, hostel, transport, placement, or events.";
const FALLBACK_RESPONSE_TA =
  "மன்னிக்கவும், நான் அதை புரிந்துகொள்ள முடியவில்லை. தொடர்பு கொள்ள: +91 424 2260000. கேள்விகள்: படிப்புகள், கட்டணம், சேர்க்கை, விடுதி, போக்குவரத்து, இடம்பெறுதல்.";
const FALLBACK_SUGGESTIONS = ['Courses offered', 'Fee structure', 'Admission process', 'Contact info'];

function getSessionId() {
  let id = sessionStorage.getItem('nasc-session-id');
  if (!id) {
    id = `sess-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    sessionStorage.setItem('nasc-session-id', id);
  }
  return id;
}

// Simple HTML escape to prevent XSS
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default function ChatPanel({ fullWidth = false }: ChatPanelProps) {
  const { intents, courses, busRoutes, settings } = useData();
  const { language, t } = useApp();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [matcher, setMatcher] = useState<IntentMatcher | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize matcher when intents change
  useEffect(() => {
    if (intents.length > 0) {
      const threshold = settings?.confidence_threshold || 0.35;
      setMatcher(new IntentMatcher(intents as Intent[], threshold));
    }
  }, [intents, settings]);

  // Welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'bot',
        text:
          language === 'ta'
            ? 'வணக்கம்! நான் நந்தா அசிஸ்டென்ட். கட்டணம், படிப்புகள், சேர்க்கை பற்றி கேளுங்கள்!'
            : 'Hello! I am Nandha Assistant. Ask me about courses, fees, admissions, hostel, transport, placement and more!',
        suggestions: ['Courses offered', 'Fee structure', 'Admission process', 'Hostel info'],
      },
    ]);
  }, [language]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load saved bookmarks
  useEffect(() => {
    const saved = localStorage.getItem('nasc-saved-answers');
    if (saved) {
      const savedIds = JSON.parse(saved) as string[];
      setMessages((prev) =>
        prev.map((m) => (savedIds.includes(m.id) ? { ...m, saved: true } : m))
      );
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[^\w\s.,!?-]/g, ''));
      utterance.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    },
    [language]
  );

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Voice input not supported in this browser', 'warning');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      setTimeout(() => handleSend(transcript), 100);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
    recognitionRef.current = recognition;
  }, [language, showToast]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const saveBookmark = (msgId: string) => {
    const saved = JSON.parse(localStorage.getItem('nasc-saved-answers') || '[]') as string[];
    if (!saved.includes(msgId)) {
      saved.push(msgId);
      localStorage.setItem('nasc-saved-answers', JSON.stringify(saved));
      setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, saved: true } : m)));
      showToast('Answer saved to My Saved', 'success');
    } else {
      const filtered = saved.filter((id) => id !== msgId);
      localStorage.setItem('nasc-saved-answers', JSON.stringify(filtered));
      setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, saved: false } : m)));
      showToast('Removed from saved', 'info');
    }
  };

  const submitFeedback = async (msgId: string, rating: 'up' | 'down', intentName: string, query: string) => {
    await supabase.from('feedback').insert({
      session_id: getSessionId(),
      message_id: msgId,
      rating,
      intent_name: intentName,
      query,
    });
    showToast(rating === 'up' ? 'Thanks for the feedback!' : 'Feedback noted, we will improve!', 'success');
  };

  const logChat = async (userMsg: string, botMsg: string, intent: string | null, confidence: number) => {
    const lang = detectLanguage(userMsg);
    await supabase.from('chat_logs').insert({
      session_id: getSessionId(),
      user_message: userMsg,
      bot_response: botMsg,
      intent_name: intent,
      confidence,
      language: lang,
    });
  };

  const handleSend = useCallback(
    async (overrideText?: string) => {
      const text = (overrideText ?? input).trim();
      if (!text || !matcher) return;

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        text: escapeHtml(text),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');

      // Match intent
      const result: MatchResult = matcher.match(text);
      let botText: string;
      let intentName: string | null = null;
      let confidence = 0;
      let suggestions: string[] = [];

      if (result.intent) {
        intentName = result.intent.intent_name;
        confidence = result.confidence;
        botText = language === 'ta' && result.intent.response_ta ? result.intent.response_ta : result.intent.response_en;
        suggestions = result.intent.suggestions || [];
      } else {
        botText = language === 'ta' ? FALLBACK_RESPONSE_TA : FALLBACK_RESPONSE_EN;
        suggestions = FALLBACK_SUGGESTIONS;
        // Save unanswered query
        await supabase.from('unanswered_queries').insert({
          query: text,
          session_id: getSessionId(),
        });
      }

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        role: 'bot',
        text: botText,
        intent: intentName,
        confidence,
        suggestions,
      };

      setMessages((prev) => [...prev, botMsg]);
      await logChat(text, botText, intentName, confidence);
    },
    [input, matcher, language]
  );

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
    handleSend(suggestion);
  };

  return (
    <div className={`flex flex-col ${fullWidth ? 'h-[calc(100vh-4rem)]' : 'h-[600px]'} glass-card overflow-hidden`}>
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              {/* Bot badge */}
              {msg.role === 'bot' && (
                <div className="flex items-center gap-1.5 mb-1 text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">Nandha Assistant</span>
                  {msg.confidence !== undefined && msg.confidence > 0 && (
                    <span className="text-xs text-gray-400 ml-1">
                      {(msg.confidence * 100).toFixed(0)}% match
                    </span>
                  )}
                </div>
              )}

              {/* Message text */}
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>

              {/* Rich course suggestions */}
              {msg.intent && courses.length > 0 && msg.intent.includes('course') && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {courses.slice(0, 4).map((c) => (
                    <Link
                      key={c.id}
                      to={`/explore?course=${c.code}`}
                      className="text-xs px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Rich bus route info */}
              {msg.intent === 'transport' && busRoutes.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {busRoutes.slice(0, 4).map((r) => (
                    <div key={r.id} className="text-xs p-2 rounded-lg bg-white dark:bg-gray-700">
                      <div className="font-semibold text-blue-600 dark:text-blue-400">{r.area}</div>
                      <div className="text-gray-500">{r.pickup_time} - Rs.{r.fee_annual}/yr</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Follow-up chips */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestion(s)}
                      className="text-xs px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors border border-blue-200 dark:border-blue-800"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Bot action buttons */}
              {msg.role === 'bot' && msg.id !== 'welcome' && (
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => submitFeedback(msg.id, 'up', msg.intent || '', messages.find((m) => m.id === msg.id)?.text || '')}
                    className="p-1 rounded text-gray-400 hover:text-green-500 transition-colors"
                    title="Helpful"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => submitFeedback(msg.id, 'down', msg.intent || '', messages.find((m) => m.id === msg.id)?.text || '')}
                    className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors"
                    title="Not helpful"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => saveBookmark(msg.id)}
                    className={`p-1 rounded transition-colors ${msg.saved ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'}`}
                    title="Save answer"
                  >
                    <Bookmark className="w-4 h-4" fill={msg.saved ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => speak(msg.text)}
                    className="p-1 rounded text-gray-400 hover:text-blue-500 transition-colors"
                    title="Read aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`p-2.5 rounded-xl transition-colors flex-shrink-0 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title="Voice input"
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('Type your question...', 'உங்கள் கேள்வியை தட்டச்சு செய்யவும்...')}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 dark:text-white"
          />
          <button
            onClick={() => handleSend()}
            className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
