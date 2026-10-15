import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import ChatPanel from './ChatPanel';
import Logo from './Logo';

// Floating chatbot widget — visible on all public pages
export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/40 flex items-center justify-center transition-transform hover:scale-110"
        title="Ask Nandha"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-40 w-[calc(100vw-3rem)] sm:w-96 h-[500px] shadow-2xl rounded-2xl overflow-hidden"
          >
            <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-900 to-blue-600 text-white">
                <Logo size={28} />
                <div>
                  <div className="font-semibold text-sm">Nandha Assistant</div>
                  <div className="text-xs text-blue-200">Online — Ask me anything</div>
                </div>
                <Link to="/chat" className="ml-auto text-xs text-blue-200 hover:text-white underline">
                  Full screen
                </Link>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatPanel fullWidth={false} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
