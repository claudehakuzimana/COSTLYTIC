import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const shortcuts = {
  '1': '/app/dashboard',
  '2': '/app/usage',
  '3': '/app/token-attribution',
  '4': '/app/infrastructure',
  '5': '/app/vector-storage',
  '6': '/app/shadow-ai',
  '7': '/app/guardrails',
  '8': '/app/forecasting',
  ',': '/app/settings',
};

export function useKeyboardShortcuts(enabled = true) {
  const navigate = useNavigate();

  const handleKeyDown = useCallback((e) => {
    if (!enabled) return;
    
    if ((e.metaKey || e.ctrlKey) && shortcuts[e.key]) {
      e.preventDefault();
      navigate(shortcuts[e.key]);
    }

    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
    }
  }, [enabled, navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export default useKeyboardShortcuts;
