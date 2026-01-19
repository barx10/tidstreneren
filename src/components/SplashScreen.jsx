import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

function SplashScreen({ onClose }) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-close splash screen after 4 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Allow fade-out animation
  };

  return (
    <>
      {/* Blur backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(4px)',
          zIndex: 2500,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease-out',
          pointerEvents: isVisible ? 'auto' : 'none',
        }}
        onClick={handleClose}
      />

      {/* Splash screen modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          zIndex: 2501,
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -50%) scale(0.9)',
          transition: 'all 0.3s ease-out',
          textAlign: 'center',
        }}
      >
        {/* Illustration - place image at public/splash-illustration.png or src/assets/splash-illustration.png */}
        <div
          style={{
            width: '100%',
            height: '250px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '60px',
            fontWeight: 'bold',
          }}
        >
          <img
            src="/splash-illustration.png"
            alt="Tidstreneren"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '16px',
            }}
            onError={(e) => {
              // Fallback if image doesn't exist
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#2c3e50',
            margin: '0 0 12px 0',
          }}
        >
          🕐 Tidstreneren
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '16px',
            color: '#666',
            margin: '0 0 30px 0',
            lineHeight: '1.6',
          }}
        >
          Lær å forstå tid på en enkel og morsom måte
        </p>

        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            padding: '12px 40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
          }}
        >
          Kom i gang
        </button>

        {/* Skip text */}
        <p
          style={{
            fontSize: '12px',
            color: '#999',
            margin: '20px 0 0 0',
          }}
        >
          Stenger automatisk om 4 sekunder
        </p>
      </div>
    </>
  );
}

export default SplashScreen;
