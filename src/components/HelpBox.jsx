import React, { useState } from 'react';

const COLORS = {
  months: '#e67e22',
  days: '#27ae60',
  hours: '#2980b9',
  minutes: '#8e44ad',
  seconds: '#c0392b',
};

function HelpBox() {
  const [activeTab, setActiveTab] = useState('hvordan');

  const tabs = [
    { id: 'hvordan', label: '🎯 Hvordan bruke' },
    { id: 'tidsenheter', label: '⏱️ Tidsenheter' },
    { id: 'sammenhenger', label: '🔗 Sammenhenger' },
    { id: 'tips', label: '💡 Tips' },
  ];

  return (
    <div style={{
      position: 'fixed',
      left: 20,
      top: 20,
      width: '320px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      zIndex: 999,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '16px 20px',
        color: 'white',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
          📚 Hjelpeguide
        </h2>
        <p style={{ fontSize: '12px', margin: '4px 0 0 0', opacity: 0.9 }}>
          Lær å forstå tid på en enkel måte
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #f0f0f0',
        background: '#fafafa',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '12px 8px',
              border: 'none',
              background: activeTab === tab.id ? 'white' : 'transparent',
              color: activeTab === tab.id ? '#667eea' : '#7f8c8d',
              fontSize: '11px',
              fontWeight: activeTab === tab.id ? '600' : '400',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '2px solid #667eea' : 'none',
              marginBottom: activeTab === tab.id ? '-2px' : '0',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{
        padding: '20px',
        maxHeight: '400px',
        overflowY: 'auto',
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#2c3e50',
      }}>
        {activeTab === 'hvordan' && (
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#667eea' }}>
              Slik bruker du klokka
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <strong>🖱️ Dra i ringene:</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                Klikk og dra på en ring for å endre tid. Du kan endre måneder, dager, timer, minutter og sekunder.
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>🕐 Dra i viserne:</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                På den lille klokka kan du dra timeviseren, minuttviseren og sekundviseren.
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>🔊 Lytt til tiden:</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                Trykk på "Les dato" eller "Les tid" for å høre tiden sagt høyt på norsk.
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>⏸️ Stopp og start:</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                Trykk "Stopp" for å fryse tiden. Da kan du utforske i fred. Trykk "Start" for å fortsette.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'tidsenheter' && (
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#667eea' }}>
              Hva betyr ringene?
            </h3>
            
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: COLORS.seconds }} />
                <strong>Sekunder (røde)</strong>
              </div>
              <p style={{ marginLeft: '30px', color: '#555', fontSize: '13px' }}>
                Det går 60 sekunder på ett minutt. Sekundene går raskt!
              </p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: COLORS.minutes }} />
                <strong>Minutter (lilla)</strong>
              </div>
              <p style={{ marginLeft: '30px', color: '#555', fontSize: '13px' }}>
                Det går 60 minutter på én time. Når alle 60 er fylt, blir det en ny time.
              </p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: COLORS.hours }} />
                <strong>Timer (blå)</strong>
              </div>
              <p style={{ marginLeft: '30px', color: '#555', fontSize: '13px' }}>
                Det går 24 timer på én dag. Når alle 24 er fylt, begynner en ny dag.
              </p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: COLORS.days }} />
                <strong>Dager (grønn)</strong>
              </div>
              <p style={{ marginLeft: '30px', color: '#555', fontSize: '13px' }}>
                Det går 365 dager på ett år (366 i skuddår). Hver dag er en ny sirkel rundt sola.
              </p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: COLORS.months }} />
                <strong>Måneder (oransje)</strong>
              </div>
              <p style={{ marginLeft: '30px', color: '#555', fontSize: '13px' }}>
                Det går 12 måneder på ett år. Januar, februar, mars... til desember.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'sammenhenger' && (
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#667eea' }}>
              Slik henger tid sammen
            </h3>
            
            <div style={{ 
              background: '#f8f9fa', 
              padding: '16px', 
              borderRadius: '8px',
              marginBottom: '12px',
              border: '2px solid #e9ecef'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: COLORS.seconds }}>60 sekunder</strong>
                <span style={{ margin: '0 8px' }}>→</span>
                <strong style={{ color: COLORS.minutes }}>1 minutt</strong>
              </div>
              <p style={{ fontSize: '12px', color: '#555', marginLeft: '10px' }}>
                Når den røde ringen har gått rundt én gang, hopper den lilla én plass.
              </p>
            </div>

            <div style={{ 
              background: '#f8f9fa', 
              padding: '16px', 
              borderRadius: '8px',
              marginBottom: '12px',
              border: '2px solid #e9ecef'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: COLORS.minutes }}>60 minutter</strong>
                <span style={{ margin: '0 8px' }}>→</span>
                <strong style={{ color: COLORS.hours }}>1 time</strong>
              </div>
              <p style={{ fontSize: '12px', color: '#555', marginLeft: '10px' }}>
                Når den lilla ringen er full, hopper den blå én plass.
              </p>
            </div>

            <div style={{ 
              background: '#f8f9fa', 
              padding: '16px', 
              borderRadius: '8px',
              marginBottom: '12px',
              border: '2px solid #e9ecef'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: COLORS.hours }}>24 timer</strong>
                <span style={{ margin: '0 8px' }}>→</span>
                <strong style={{ color: COLORS.days }}>1 dag</strong>
              </div>
              <p style={{ fontSize: '12px', color: '#555', marginLeft: '10px' }}>
                Når den blå ringen er full, hopper den grønne én plass.
              </p>
            </div>

            <div style={{ 
              background: '#f8f9fa', 
              padding: '16px', 
              borderRadius: '8px',
              border: '2px solid #e9ecef'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: COLORS.days }}>~30 dager</strong>
                <span style={{ margin: '0 8px' }}>→</span>
                <strong style={{ color: COLORS.months }}>1 måned</strong>
              </div>
              <p style={{ fontSize: '12px', color: '#555', marginLeft: '10px' }}>
                Når måneden er ferdig, hopper den oransje ringen til neste måned.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#667eea' }}>
              Tips for læring
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <strong>🎯 Start enkelt</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                Trykk på "Enkel modus" øverst for å bare se timer og minutter først. Legg til mer når du er klar.
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>🔄 Øv daglig</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                Bruk klokka hver dag i 5-10 minutter. Kort og ofte gir best læring.
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>🗣️ Snakk om tiden</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                Si høyt hva du ser: "Nå er klokka 3. Om 15 minutter skal vi spise."
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>📅 Koble til hverdagen</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                Bruk klokka til å vise når ting skjer: "Friminutt er om 10 minutter."
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>🎮 Lek med tiden</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                Dra ringene og se hva som skjer. Utforsking er læring!
              </p>
            </div>

            <div style={{ 
              background: '#e8f5e9', 
              padding: '12px', 
              borderRadius: '8px',
              marginTop: '16px',
              border: '2px solid #c8e6c9'
            }}>
              <strong style={{ color: '#2e7d32' }}>💚 Viktig å huske:</strong>
              <p style={{ marginTop: '6px', fontSize: '13px', color: '#1b5e20' }}>
                Alle lærer i sitt eget tempo. Det er helt greit å bruke lang tid. Det viktigste er at du utforsker og har det gøy!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HelpBox;