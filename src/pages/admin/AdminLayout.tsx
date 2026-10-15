import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Inbox, Users, History, Settings, Bell, CalendarDays, Building2, GraduationCap, Bus, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/intents', label: 'Intents', icon: MessageSquare },
  { to: '/admin/unanswered', label: 'Unanswered', icon: Inbox },
  { to: '/admin/leads', label: 'Leads', icon: Users },
  { to: '/admin/chat-history', label: 'Chat History', icon: History },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/departments', label: 'Departments', icon: Building2 },
  { to: '/admin/courses', label: 'Courses', icon: GraduationCap },
  { to: '/admin/bus-routes', label: 'Bus Routes', icon: Bus },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!session) return <Navigate to="/admin" replace />;

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-gray-900 dark:bg-black text-gray-300 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <span className="font-bold text-white">NASC Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="mt-4 px-2 space-y-1">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-gray-800 w-full">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white dark:bg-gray-900 shadow-sm h-16 flex items-center px-4 gap-3">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-600 dark:text-gray-300">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold text-gray-700 dark:text-gray-300">Admin Panel</span>
          <a href="/" target="_blank" className="ml-auto text-sm text-blue-600 hover:underline">View Site →</a>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
