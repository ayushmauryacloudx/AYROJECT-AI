import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { LayoutDashboard, Lightbulb, FolderKanban, Settings, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import ThemeToggle from './ThemeToggle';
import Footer from './Footer';

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Generate Ideas', path: '/generate', icon: Lightbulb },
    { name: 'My Projects', path: '/projects', icon: FolderKanban },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className={cn("fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static", isMobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="p-6 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <img src="https://i.ibb.co/7dGTh3P7/Chat-GPT-Image-Sep-5-2026-11-45-34-AM.png" alt="AYROJECT AI logo" className="w-8 h-8 rounded-lg" />
            AYROJECT AI
          </Link>
          <ThemeToggle />
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium text-sm",
                  isActive 
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" 
                    : "text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-slate-400 dark:text-slate-500")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <div className="px-3 py-2 text-sm font-medium text-slate-900 dark:text-white truncate">
            {user?.email}
          </div>
          <Link 
            to="/settings"
             onClick={() => setIsMobileMenuOpen(false)} 
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
              location.pathname === '/settings' ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" : "text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <Settings className={cn("w-5 h-5", location.pathname === '/settings' ? "text-indigo-600" : "text-slate-400 dark:text-slate-500")} />
            Settings
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col w-full min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600 dark:text-slate-300">
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <img src="https://i.ibb.co/7dGTh3P7/Chat-GPT-Image-Sep-5-2026-11-45-34-AM.png" alt="Logo" className="w-6 h-6 rounded" />
              AYROJECT
            </span>
          </div>
          <ThemeToggle />
        </div>
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}
