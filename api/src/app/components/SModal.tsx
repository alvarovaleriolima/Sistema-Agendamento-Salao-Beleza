import { useEffect } from 'react';
import { SIcon } from './SIcon';

interface SModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  large?: boolean;
}

export function SModal({ open, onClose, title, children, large }: SModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="s-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`s-modal${large ? ' s-modal-lg' : ''}`}>
        <div className="s-modal-header">
          <div className="s-modal-title">{title}</div>
          <button className="s-modal-close" onClick={onClose}><SIcon name="x" size={16} /></button>
        </div>
        <div className="s-modal-body">{children}</div>
      </div>
    </div>
  );
}
