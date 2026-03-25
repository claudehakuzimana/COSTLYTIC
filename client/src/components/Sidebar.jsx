import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  Database, 
  Shield, 
  AlertTriangle,
  BarChart3,
  Settings,
  Key,
  ArrowUpRight,
  X,
  Command
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard, shortcut: '⌘1' },
  { name: 'AI Usage', href: '/app/usage', icon: Sparkles, shortcut: '⌘2' },
  { name: 'Token Attribution', href: '/app/token-attribution', icon: TrendingUp, shortcut: '⌘3' },
  { name: 'Infrastructure', href: '/app/infrastructure', icon: Cpu, shortcut: '⌘4' },
  { name: 'Vector Storage', href: '/app/vector-storage', icon: Database, shortcut: '⌘5' },
  { name: 'Shadow AI', href: '/app/shadow-ai', icon: Shield, shortcut: '⌘6' },
  { name: 'Guardrails', href: '/app/guardrails', icon: AlertTriangle, shortcut: '⌘7' },
  { name: 'Forecasting', href: '/app/forecasting', icon: BarChart3, shortcut: '⌘8' },
  { name: 'Settings', href: '/app/settings', icon: Settings, shortcut: '⌘,' },
  { name: 'API Keys', href: '/app/settings/api-keys', icon: Key },
  { name: 'Billing', href: '/app/billing', icon: ArrowUpRight },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900/50 z-40 md:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <Link to="/app/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">AI Cost Intel</span>
            </Link>
            <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition group
                        ${isActive 
                          ? 'bg-gray-900 dark:bg-gray-800 text-white' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-orange-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                        {item.name}
                      </div>
                      {item.shortcut && (
                        <kbd className={`hidden sm:inline-flex px-1.5 py-0.5 text-xs rounded ${
                          isActive 
                            ? 'bg-gray-800 text-gray-400' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                        }`}>
                          {item.shortcut}
                        </kbd>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
              className="w-full p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-left"
            >
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Command className="w-4 h-4" />
                <span>Quick actions</span>
                <kbd className="ml-auto px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                  ⌘K
                </kbd>
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
