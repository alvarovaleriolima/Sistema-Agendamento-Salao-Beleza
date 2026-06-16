import { SIcon } from './SIcon';

interface SConfirmProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function SConfirm({ open, title, message, confirmLabel = 'Confirmar', onConfirm, onCancel, loading }: SConfirmProps) {
  if (!open) return null;
  return (
    <div className="s-modal-overlay">
      <div className="s-modal" style={{ maxWidth: 400 }}>
        <div className="s-modal-body">
          <div className="s-confirm-icon" style={{ color: 'var(--red)' }}>
            <SIcon name="alert" size={20} />
          </div>
          <div className="s-confirm-title">{title}</div>
          <div className="s-confirm-msg">{message}</div>
          <div className="s-modal-actions">
            <button className="s-btn-cancel" onClick={onCancel} disabled={loading}>Cancelar</button>
            <button className="s-btn-danger" onClick={onConfirm} disabled={loading}>
              {loading ? 'Aguarde...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
