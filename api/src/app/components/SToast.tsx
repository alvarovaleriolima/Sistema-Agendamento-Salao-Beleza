import { useState, useCallback } from 'react';

export interface Toast { id: number; msg: string; type: 'success' | 'error' }

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return { toasts, toast };
}

export function SToasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="s-toasts">
      {toasts.map(t => (
        <div key={t.id} className={`s-toast s-toast-${t.type}`}>
          {t.type === 'success' ? '✓' : '✕'} {t.msg}
        </div>
      ))}
    </div>
  );
}
