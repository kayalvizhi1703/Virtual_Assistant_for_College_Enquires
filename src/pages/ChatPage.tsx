import { useApp } from '@/context/AppContext';
import ChatPanel from '@/components/ChatPanel';

export default function ChatPage() {
  const { t } = useApp();
  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t('Nandha Assistant', 'நந்தா அசிஸ்டென்ட்')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {t('Ask me about courses, fees, admissions, hostel, transport, placements and more.', 'படிப்புகள், கட்டணம், சேர்க்கை பற்றி கேளுங்கள்.')}
        </p>
        <ChatPanel fullWidth />
      </div>
    </div>
  );
}
