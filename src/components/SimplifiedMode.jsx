import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function SimplifiedMode({ selectedUnits, setSelectedUnits, simplifiedMode, setSimplifiedMode, onClose }) {
  const { t } = useLanguage();

  const UNIT_CONFIG = [
    { key: 'year', label: t('simplified.year'), color: '#16a085' },
    { key: 'months', label: t('simplified.months'), color: '#e67e22' },
    { key: 'days', label: t('simplified.days'), color: '#27ae60' },
    { key: 'hours', label: t('simplified.hours'), color: '#2980b9' },
    { key: 'minutes', label: t('simplified.minutes'), color: '#8e44ad' },
    { key: 'seconds', label: t('simplified.seconds'), color: '#c0392b' },
  ];

  const handleToggle = (key) => {
    setSelectedUnits(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const selectedCount = Object.values(selectedUnits).filter(Boolean).length;

  const handleEnableSimplified = () => {
    if (selectedCount > 0) {
      setSimplifiedMode(true);
      if (onClose) onClose();
    }
  };

  const handleDisableSimplified = () => {
    setSimplifiedMode(false);
    if (onClose) onClose();
  };

  return (
    <div style={{
      padding: '32px 24px 24px 24px',
      width: '100%',
      maxWidth: '100%',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px',
      }}>
        <span style={{ fontSize: '28px' }}>🎯</span>
        <h2 style={{
          margin: 0,
          fontSize: '24px',
          color: '#2c3e50',
          fontWeight: '600'
        }}>
          {t('simplified.title')}
        </h2>
      </div>

      <div style={{ padding: '0' }}>
          <p style={{
            fontSize: '14px',
            color: '#555',
            lineHeight: '1.5',
            margin: '0 0 16px 0'
          }}>
            {t('simplified.description')}
          </p>

          {/* Avkrysningsbokser for enhetsvalg */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '16px',
          }}>
            {UNIT_CONFIG.map(unit => (
              <label
                key={unit.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  background: selectedUnits[unit.key] ? `${unit.color}15` : '#f5f5f5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: `2px solid ${selectedUnits[unit.key] ? unit.color : 'transparent'}`,
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedUnits[unit.key]}
                  onChange={() => handleToggle(unit.key)}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: unit.color,
                    cursor: 'pointer',
                  }}
                />
                <div style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '3px',
                  background: unit.color,
                  flexShrink: 0,
                }}/>
                <span style={{
                  color: selectedUnits[unit.key] ? unit.color : '#666',
                  fontWeight: selectedUnits[unit.key] ? '600' : '400',
                  fontSize: '14px',
                }}>
                  {unit.label}
                </span>
              </label>
            ))}
          </div>

          {selectedCount === 0 && (
            <div style={{
              padding: '10px 12px',
              background: '#fff3cd',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#856404',
              marginBottom: '12px',
            }}>
              {t('simplified.selectOne')}
            </div>
          )}

          <div style={{
            padding: '12px',
            background: '#f0f7ff',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#1a5490',
            lineHeight: '1.5',
            marginBottom: '20px'
          }}>
            <strong>💡 {t('simplified.tip')}</strong> {t('simplified.tipText')}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}>
            <button
              onClick={handleDisableSimplified}
              style={{
                padding: '10px 20px',
                background: '#f0f0f0',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: '#555',
              }}
            >
              {t('nav.fullMode')}
            </button>
            <button
              onClick={handleEnableSimplified}
              disabled={selectedCount === 0}
              style={{
                padding: '10px 20px',
                background: selectedCount > 0 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#ccc',
                border: 'none',
                borderRadius: '8px',
                cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
              }}
            >
              {t('nav.simplifiedMode')}
            </button>
          </div>
        </div>
    </div>
  );
}

export default SimplifiedMode;
