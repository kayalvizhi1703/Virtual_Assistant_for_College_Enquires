import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Logo from './Logo';
import { useData } from '@/context/DataContext';

export default function Footer() {
  const { settings } = useData();

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo + about */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Logo size={40} />
              <span className="font-bold text-white text-lg">NASC</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              {settings?.motto || 'Learn, Serve and Succeed'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              NAAC B+ Accredited | Estd. {settings?.established || 2000}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/explore" className="hover:text-blue-400 transition-colors">Departments & Courses</Link></li>
              <li><Link to="/tools" className="hover:text-blue-400 transition-colors">Interactive Tools</Link></li>
              <li><Link to="/notifications" className="hover:text-blue-400 transition-colors">Notifications</Link></li>
              <li><Link to="/chat" className="hover:text-blue-400 transition-colors">Ask Nandha</Link></li>
              <li><Link to="/test" className="hover:text-blue-400 transition-colors">NLP Test</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                <span>{settings?.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-blue-400" />
                <span>{settings?.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-blue-400" />
                <span>{settings?.email}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white mb-4">Connect</h4>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <Link to="/admin" className="text-xs text-gray-500 hover:text-blue-400 mt-4 inline-block">
              Admin Login
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Nandha Arts and Science College (Autonomous). All rights reserved.</p>
          <p className="mt-1">Affiliated to {settings?.affiliation} | {settings?.trust}</p>
        </div>
      </div>
    </footer>
  );
}
