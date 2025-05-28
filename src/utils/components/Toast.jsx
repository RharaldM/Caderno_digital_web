import React, { useEffect } from 'react';
import './Toast.css';

function Toast({ message, type = "success", onClose, duration = 2500 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`} role="alert" aria-live="assertive">
      {message}
    </div>
  );
}

export default React.memo(Toast);