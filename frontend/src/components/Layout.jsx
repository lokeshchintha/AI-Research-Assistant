import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Network,
  Lightbulb,
  Users,
  LogOut,
  Menu,
  X,
  Sparkles,
  Brain,
  HelpCircle,
  Info,
  Settings,
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import ThemeToggle from './ThemeToggle';
import ProfileModal from './ProfileModal';
import logo from '../assets/logo.jpg';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Extract paper ID from current path
  const pathParts = location.pathname.split('/');
  const currentPaperId = pathParts[2]; // Gets ID from paths like /paper/:id, /graph/:id, etc.

  const menuItems = [
    { icon: Upload, label: 'Upload', path: '/upload' },
    { icon: FileText, label: 'My Papers', path: '/papers' },
  ];

  // Feature items - only show if we have a paper ID
  const featureItems = currentPaperId ? [
    { icon: Network, label: 'Knowledge Graph', path: `/graph/${currentPaperId}` },
    { icon: Lightbulb, label: 'Research Ideas', path: `/ideas/${currentPaperId}` },
    { icon: Brain, label: 'AI Insights', path: `/insights/${currentPaperId}` },
    { icon: HelpCircle, label: 'Knowledge Quiz', path: `/quiz/${currentPaperId}` },
    { icon: Users, label: 'Collaborate', path: `/collaborate/${currentPaperId}` },
  ] : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0a0a0f]">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-64 bg-white dark:bg-[#13131a] border-r border-gray-200 dark:border-gray-800 flex flex-col"
          >
            {/* Logo */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <img 
                  src={logo} 
                  alt="Research Partner Logo" 
                  className="w-10 h-10 rounded-lg object-cover shadow-md"
                />
                <div>
                  <h1 className="text-xl font-bold neon-text">Research</h1>
                  <p className="text-xs text-gray-400">Partner</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {/* Main Navigation */}
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Paper Features - Show when paper is open */}
              {featureItems.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2 mb-3 px-3">
                    <Sparkles className="w-4 h-4 text-neon-blue" />
                    <span className="text-xs font-semibold text-gray-400 uppercase">Paper Features</span>
                  </div>
                  <div className="space-y-2">
                    {featureItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => setProfileModalOpen(true)}
                  className="relative group"
                >
                  <img
                    src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full border-2 border-neon-blue group-hover:border-neon-purple transition-colors"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setProfileModalOpen(true)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a1a24] rounded-lg transition-all"
                >
                  <Settings className="w-4 h-4" />
                  <span>Profile Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a1a24] rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-[#13131a] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#1a1a24] rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-gray-400" />
            ) : (
              <Menu className="w-6 h-6 text-gray-400" />
            )}
          </button>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Welcome back, <span className="text-neon-blue font-medium">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
      />
    </div>
  );
};

export default Layout;
