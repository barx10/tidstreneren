import React from 'react';

function Modal({ onClose, maxWidth = '800px', children }) {
  const isMobile = window.innerWidth < 768;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: isMobile ? 0 : '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: isMobile ? '16px 16px 0 0' : '16px',
          maxWidth: isMobile ? '100%' : maxWidth,
          width: isMobile ? '100%' : undefined,
          maxHeight: isMobile ? '85vh' : '80vh',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            fontSize: '18px',
            zIndex: 1010,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
