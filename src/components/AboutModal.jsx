import React from 'react';
import logo from '../assets/logo.png';

function AboutModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        position: 'relative',
      }}>
        {/* Lukkeknapp */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Lukk"
        >
          ×
        </button>

        {/* Innhold */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            margin: '0 0 24px 0',
            color: '#2c3e50',
            fontSize: '28px',
            fontWeight: '700',
          }}>
            Om Tidstreneren
          </h2>

          {/* Logo */}
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 24px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <img 
              src={logo} 
              alt="Lærerliv logo" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Om utvikleren */}
          <div style={{
            marginBottom: '24px',
            lineHeight: '1.6',
            color: '#555',
          }}>
            <h3 style={{
              fontSize: '20px',
              margin: '0 0 12px 0',
              color: '#667eea',
            }}>
              Kenneth Bareksten
            </h3>
            <p style={{ margin: '0 0 16px 0' }}>
              Lærer og hobbyprogrammerer som lager digitale verktøy for å gjøre hverdagen litt enklere og mer kreativ.
            </p>
          </div>

          {/* Kontaktinformasjon */}
          <div style={{
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '24px',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                <span style={{ fontSize: '18px' }}>🌐</span>
                <a
                  href="http://laererliv.no"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: '500',
                  }}
                >
                  laererliv.no
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                <span style={{ fontSize: '18px' }}>✉️</span>
                <a
                  href="mailto:kenneth@laererliv.no"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: '500',
                  }}
                >
                  kenneth@laererliv.no
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p style={{
            marginTop: '20px',
            fontSize: '12px',
            color: '#999',
          }}>
            Autismeklokke © 2026
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutModal;
