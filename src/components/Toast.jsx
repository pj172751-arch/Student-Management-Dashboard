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
    }, 3800);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 250);
  };

  const getBadgeLabel = () => {
    switch (toast.type) {
      case 'success':
        return 'System Alert • Success';
      case 'error':
        return 'System Alert • Error';
      case 'info':
      default:
        return 'System Alert • Notice';
    }
  };

  const renderIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon size={20} className="toast-icon-svg" />;
      case 'error':
        return <AlertCircleIcon size={20} className="toast-icon-svg" />;
      case 'info':
      default:
        return <InfoIcon size={20} className="toast-icon-svg" />;
    }
  };

  return (
    <div
      className={`enterprise-toast-item toast-${toast.type} ${isExiting ? 'toast-fade-out' : ''}`}
      id={`toast-${toast.id}`}
      role="alert"
    >
      <div className="toast-icon-container">
        {renderIcon()}
      </div>
      <div className="toast-message-content">
        <span className="toast-title-tag">{getBadgeLabel()}</span>
        <span className="toast-message-text">{toast.message}</span>
      </div>
      <button
        type="button"
        className="toast-dismiss-btn"
        onClick={handleDismiss}
        title="Dismiss notification"
        aria-label="Close alert"
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
}

export default Toast;