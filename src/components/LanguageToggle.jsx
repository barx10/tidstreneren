import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      style={{
        padding: '8px 12px',
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}
      title={language === 'no' ? 'Switch to English' : 'Bytt til norsk'}
    >
      <span style={{ fontSize: '16px' }}>{language === 'no' ? '🇳🇴' : '🇬🇧'}</span>
      {language === 'no' ? 'NO' : 'EN'}
    </button>
  );
}

export default LanguageToggle;
