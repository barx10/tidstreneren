import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

function SplashScreen({ onClose }) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState('entering'); // entering -> visible -> exiting -> done

  useEffect(() => {
    // Entrance animation
    const enterTimer = setTimeout(() => setPhase('visible'), 50);

    return () => {
      clearTimeout(enterTimer);
    };
  }, []);

  const handleClose = () => {
    setPhase('exiting');
    setTimeout(onClose, 400);
  };

  const isVisible = phase === 'visible';
  const isExiting = phase === 'exiting';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        opacity: isExiting ? 0 : isVisible ? 1 : 0,
        transition: 'opacity 0.4s ease-out',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background circles */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '-10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        pointerEvents: 'none',
      }} />

      {/* Content card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: isExiting
            ? 'scale(0.9) translateY(20px)'
            : isVisible
              ? 'scale(1) translateY(0)'
              : 'scale(0.9) translateY(20px)',
          opacity: isExiting ? 0 : isVisible ? 1 : 0,
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          maxWidth: '400px',
          width: '90%',
          padding: '0 20px',
        }}
      >
        {/* Logo illustration in a white circular frame */}
        <div style={{
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2), 0 0 0 8px rgba(255,255,255,0.2)',
          marginBottom: '32px',
          overflow: 'hidden',
        }}>
          <img
            src="/splash-illustrations.png"
            alt="Tidstreneren"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 35%',
            }}
          />
        </div>

        {/* App name */}
        <h1 style={{
          fontSize: '36px',
          fontWeight: '700',
          color: 'white',
          margin: '0 0 8px 0',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)',
          letterSpacing: '-0.5px',
        }}>
          Tidstreneren
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '16px',
          color: 'rgba(255,255,255,0.85)',
          margin: '0 0 36px 0',
          lineHeight: '1.5',
          textAlign: 'center',
          textShadow: '0 1px 4px rgba(0,0,0,0.1)',
        }}>
          {t('splash.subtitle')}
        </p>

        {/* Get started button */}
        <button
          onClick={handleClose}
          style={{
            padding: '14px 48px',
            background: 'white',
            border: 'none',
            borderRadius: '50px',
            color: '#764ba2',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease',
            letterSpacing: '0.5px',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
          }}
        >
          {t('splash.getStarted')}
        </button>


      </div>
    </div>
  );
}

export default SplashScreen;
