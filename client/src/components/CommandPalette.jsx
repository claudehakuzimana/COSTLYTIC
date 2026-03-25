import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Settings, BarChart2, Key, Zap, Users, DollarSign, Moon, Sun, X } from 'lucide-react';
import useThemeStore from '../store/themeStore';

const commands = [
  { id: 'dashboard', name: 'Go to Dashboard', icon: BarChart2, path: '/app/dashboard', category: 'Navigation' },
  { id: 'usage', name: 'AI Usage Analytics', icon: Zap, path: '/app/usage', category: 'Navigation' },
  { id: 'tokens', name: 'Token Attribution', icon: Key, path: '/app/token-attribution', category: 'Navigation' },
  { id: 'infrastructure', name: 'Infrastructure', icon: Users, path: '/app/infrastructure', category: 'Navigation' },
  { id: 'vector', name: 'Vector Storage', icon: FileText, path: '/app/vector-storage', category: 'Navigation' },
  { id: 'shadow', name: 'Shadow AI Detection', icon: Users, path: '/app/shadow-ai', category: 'Navigation' },
  { id: 'guardrails', name: 'Guardrails', icon: Settings, path: '/app/guardrails', category: 'Navigation' },
  { id: 'forecast', name: 'Forecasting', icon: BarChart2, path: '/app/forecasting', category: 'Navigation' },
  { id: 'billing', name: 'Billing & Upgrade', icon: DollarSign, path: '/app/billing', category: 'Navigation' },
  { id: 'settings', name: 'Settings', icon: Settings, path: '/app/settings', category: 'Navigation' },
  { id: 'api-keys', name: 'API Keys', icon: Key, path: '/app/settings/api-keys', category: 'Navigation' },
];

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();

  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    const lower = search.toLowerCase();
    return commands.filter(cmd => 
      cmd.name.toLowerCase().includes(lower) ||
      cmd.category.toLowerCase().includes(lower)
    );
  }, [search]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const executeCommand = (cmd) => {
    if (cmd.id === 'toggle-theme') {
      toggleTheme();
    } else {
      navigate(cmd.path);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      executeCommand(filteredCommands[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands..."
            className="flex-1 px-3 py-4 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <p className="px-4 py-8 text-center text-gray-500">No commands found</p>
          ) : (
            filteredCommands.map((cmd, idx) => (
              <button
                key={cmd.id}
                onClick={() => executeCommand(cmd)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  idx === selectedIndex 
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <cmd.icon className="w-4 h-4" />
                <span className="flex-1">{cmd.name}</span>
                <span className="text-xs text-gray-400">{cmd.category}</span>
              </button>
            ))
          )}
        </div>
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-400">
          <div className="flex gap-2">
            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↑↓</span> to navigate
            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↵</span> to select
          </div>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
