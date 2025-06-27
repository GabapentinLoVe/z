import React from 'react';

interface ConfirmationModalProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-window">
        {title && <h3>{title}</h3>}
        <p>{message}</p>
        <div className="modal-actions">
          <button className="auth-btn" onClick={onConfirm}>Подтвердить</button>
          <button className="auth-btn" style={{ background: '#eee', color: '#222' }} onClick={onCancel}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 