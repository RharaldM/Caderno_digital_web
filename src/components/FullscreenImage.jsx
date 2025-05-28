import React, { useEffect } from 'react';
import './FullscreenImage.css';

function FullscreenImage({ src, alt, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fullscreen-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <img
        src={src}
        alt={alt}
        className="fullscreen-img"
        onClick={e => e.stopPropagation()}
        tabIndex={0}
      />
      <button
        className="close-btn"
        onClick={onClose}
        aria-label="Fechar imagem ampliada"
      >×</button>
    </div>
  );
}

export default React.memo(FullscreenImage);