import { useState, useEffect } from 'react';
import { CheckCircleIcon, AlertCircleIcon, InfoIcon, CloseIcon } from './Icons';

function Toast({ toasts, onRemove }) {
  return (
    <div className="toast-container-fixed" id="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 250);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const renderIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon size={18} className="toast-icon-emerald" />;
      case 'error':
        return <AlertCircleIcon size={18} className="toast-icon-rose" />;
      case 'info':
      default:
        return <InfoIcon size={18} className="toast-icon-cyan" />;
    }
  };

  return (
    <div
      className={`enterprise-toast-item toast-${toast.type} ${isExiting ? 'toast-fade-out' : ''}`}
      id={`toast-${toast.id}`}
    >
      <div className="toast-icon-container">
        {renderIcon()}
      </div>
      <div className="toast-message-content">
        <span className="toast-message-text">{toast.message}</span>
      </div>
      <button
        className="toast-dismiss-btn"
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onRemove(toast.id), 250);
        }}
        title="Dismiss notification"
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
}

export default Toast;