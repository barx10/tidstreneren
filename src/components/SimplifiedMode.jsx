import React from 'react';

function SimplifiedMode() {
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
        margin: 0
      }}>
        Nå vises bare de viktigste tingene på klokka. Dette gjør det lettere å forstå tid uten å bli distrahert.
      </p>

      <div style={{
        marginTop: '12px',
        padding: '12px',
        background: '#f0f7ff',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#1a5490',
        lineHeight: '1.5'
      }}>
        <strong>💡 Tips:</strong> Start med timer og minutter. Når du føler deg trygg, kan du skru av enkel modus for å se alt.
      </div>
    </div>
  );
}

export default SimplifiedMode;