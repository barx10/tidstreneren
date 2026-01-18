import React from 'react';

const UNIT_CONFIG = [
  { key: 'months', label: 'Måneder', color: '#e67e22' },
  { key: 'days', label: 'Dager', color: '#27ae60' },
  { key: 'hours', label: 'Timer', color: '#2980b9' },
  { key: 'minutes', label: 'Minutter', color: '#8e44ad' },
  { key: 'seconds', label: 'Sekunder', color: '#c0392b' },
];

function SimplifiedMode({ selectedUnits, setSelectedUnits }) {
  const handleToggle = (key) => {
    setSelectedUnits(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const selectedCount = Object.values(selectedUnits).filter(Boolean).length;

  return (
    <div style={{
      position: 'fixed',
      right: 20,
      top: 80,
      width: '280px',
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      zIndex: 999,
      border: '3px solid #667eea',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '12px'
      }}>
        <span style={{ fontSize: '24px' }}>🎯</span>
        <h3 style={{
          margin: 0,
          fontSize: '16px',
          color: '#667eea',
          fontWeight: '600'
        }}>
          Enkel modus aktivert
        </h3>
      </div>

      <p style={{
        fontSize: '14px',
        color: '#555',
        lineHeight: '1.5',
        margin: '0 0 16px 0'
      }}>
        Velg hvilke tidsenheter du vil øve på:
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
          Velg minst én enhet for å se noe på klokka.
        </div>
      )}

      <div style={{
        padding: '12px',
        background: '#f0f7ff',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#1a5490',
        lineHeight: '1.5'
      }}>
        <strong>💡 Tips:</strong> Start med timer og minutter. Legg til flere når du føler deg trygg!
      </div>
    </div>
  );
}

export default SimplifiedMode;
