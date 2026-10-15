import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider } from '@/context/AppContext';
import { DataProvider } from '@/context/DataContext';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import CommandPalette from '@/components/CommandPalette';

import HomePage from '@/pages/HomePage';
import ExplorePage from '@/pages/ExplorePage';
import ToolsPage from '@/pages/ToolsPage';
import NotificationsPage from '@/pages/NotificationsPage';
import ContactPage from '@/pages/ContactPage';
import ChatPage from '@/pages/ChatPage';
import SavedPage from '@/pages/SavedPage';
import TestPage from '@/pages/TestPage';

import AdminLogin from '@/pages/admin/AdminLogin';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminIntents from '@/pages/admin/AdminIntents';
import AdminUnanswered from '@/pages/admin/AdminUnanswered';
import AdminLeads from '@/pages/admin/AdminLeads';
import AdminChatHistory from '@/pages/admin/AdminChatHistory';
import AdminNotifications from '@/pages/admin/AdminNotifications';
import AdminEvents from '@/pages/admin/AdminEvents';
import AdminDepartments from '@/pages/admin/AdminDepartments';
import AdminCourses from '@/pages/admin/AdminCourses';
import AdminBusRoutes from '@/pages/admin/AdminBusRoutes';
import AdminSettings from '@/pages/admin/AdminSettings';

function AnimatedRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <Routes location={location}>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/test" element={<TestPage />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="intents" element={<AdminIntents />} />
              <Route path="unanswered" element={<AdminUnanswered />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="chat-history" element={<AdminChatHistory />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="departments" element={<AdminDepartments />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="bus-routes" element={<AdminBusRoutes />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </motion.div>
      </AnimatePresence>
      {!isAdmin && <Footer />}
      {!isAdmin && <ChatbotWidget />}
      <CommandPalette />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <ToastProvider>
          <DataProvider>
            <BrowserRouter>
              <AnimatedRoutes />
            </BrowserRouter>
          </DataProvider>
        </ToastProvider>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
