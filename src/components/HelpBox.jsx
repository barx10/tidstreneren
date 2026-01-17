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
    { id: 'hvordan', label: 'Hvordan bruke' },
    { id: 'tidsenheter', label: 'Tidsenheter' },
    { id: 'sammenhenger', label: 'Sammenhenger' },
    { id: 'historier', label: 'Historier' },
    { id: 'begreper', label: 'Tidsbegreper' },
    { id: 'tips', label: 'Tips' },
  ];

  return (
    <div style={{
      position: 'fixed',
      left: 20,
      top: 20,
      width: '360px',
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
          Hjelpeguide
        </h2>
        <p style={{ fontSize: '12px', margin: '4px 0 0 0', opacity: 0.9 }}>
          Lær å forstå tid på en enkel måte
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        borderBottom: '2px solid #f0f0f0',
        background: '#fafafa',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: '1 1 auto',
              minWidth: '60px',
              padding: '10px 6px',
              border: 'none',
              background: activeTab === tab.id ? 'white' : 'transparent',
              color: activeTab === tab.id ? '#667eea' : '#7f8c8d',
              fontSize: '10px',
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
        maxHeight: '450px',
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
              <strong>Dra i ringene:</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                Klikk og dra på en ring for å endre tid. Du kan endre måneder, dager, timer, minutter og sekunder.
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>Dra i viserne:</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                På den lille klokka kan du dra timeviseren, minuttviseren og sekundviseren.
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>Lytt til tiden:</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                Trykk på "Les dato" eller "Les tid" for å høre tiden sagt høyt på norsk.
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>Stopp og start:</strong>
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
                <span style={{ margin: '0 8px' }}>=</span>
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
                <span style={{ margin: '0 8px' }}>=</span>
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
                <span style={{ margin: '0 8px' }}>=</span>
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
                <span style={{ margin: '0 8px' }}>=</span>
                <strong style={{ color: COLORS.months }}>1 måned</strong>
              </div>
              <p style={{ fontSize: '12px', color: '#555', marginLeft: '10px' }}>
                Når måneden er ferdig, hopper den oransje ringen til neste måned.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'historier' && (
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#667eea' }}>
              Historier om tid
            </h3>

            <p style={{ marginBottom: '16px', color: '#555', fontStyle: 'italic' }}>
              Disse historiene hjelper deg å forstå tid bedre.
            </p>

            <div style={{
              background: '#e3f2fd',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '16px',
              border: '2px solid #90caf9'
            }}>
              <h4 style={{ color: '#1565c0', marginBottom: '10px', fontSize: '14px' }}>
                Emils morgen
              </h4>
              <p style={{ fontSize: '13px', color: '#333', lineHeight: '1.7' }}>
                Emil våkner <strong>klokka 7</strong>. Han spiser frokost i <strong>30 minutter</strong>.
                Da er klokka <strong>halv 8</strong>. Han pusser tennene i <strong>2 minutter</strong>.
                Så går han til skolen. Det tar <strong>15 minutter</strong>. Han er på skolen
                <strong> kvart på 8</strong>.
              </p>
            </div>

            <div style={{
              background: '#fff3e0',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '16px',
              border: '2px solid #ffcc80'
            }}>
              <h4 style={{ color: '#e65100', marginBottom: '10px', fontSize: '14px' }}>
                Sofies favorittprogram
              </h4>
              <p style={{ fontSize: '13px', color: '#333', lineHeight: '1.7' }}>
                Sofie vil se favorittpragrammet sitt. Det begynner <strong>klokka 5</strong>.
                Nå er klokka <strong>4</strong>. Hun må vente <strong>1 time</strong>.
                Hun tegner mens hun venter. Når den store viseren har gått helt rundt, begynner programmet!
              </p>
            </div>

            <div style={{
              background: '#e8f5e9',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '16px',
              border: '2px solid #a5d6a7'
            }}>
              <h4 style={{ color: '#2e7d32', marginBottom: '10px', fontSize: '14px' }}>
                Bursdagsfesten
              </h4>
              <p style={{ fontSize: '13px', color: '#333', lineHeight: '1.7' }}>
                I dag er det <strong>15. mai</strong>. Karls bursdag er <strong>20. mai</strong>.
                Han må vente <strong>5 dager</strong>. Hver dag krysser han av på kalenderen.
                1 dag, 2 dager, 3 dager, 4 dager, 5 dager - nå er det bursdag!
              </p>
            </div>

            <div style={{
              background: '#fce4ec',
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid #f8bbd9'
            }}>
              <h4 style={{ color: '#c2185b', marginBottom: '10px', fontSize: '14px' }}>
                Vinterferien
              </h4>
              <p style={{ fontSize: '13px', color: '#333', lineHeight: '1.7' }}>
                Nå er det <strong>januar</strong>. Vinterferien er i <strong>februar</strong>.
                Det er <strong>1 måned</strong> til. Februar kommer etter januar.
                Først må alle dagene i januar passere, så begynner februar!
              </p>
            </div>
          </div>
        )}

        {activeTab === 'begreper' && (
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#667eea' }}>
              Hva betyr tidsordene?
            </h3>

            <p style={{ marginBottom: '16px', color: '#555', fontStyle: 'italic' }}>
              Her er forklaringer på ord vi bruker om tid.
            </p>

            <div style={{
              background: '#f8f9fa',
              padding: '14px',
              borderRadius: '8px',
              marginBottom: '12px',
              borderLeft: '4px solid #667eea'
            }}>
              <strong style={{ color: '#333' }}>"Nå"</strong>
              <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>
                Akkurat dette øyeblikket. Det du gjør akkurat nå.
              </p>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '8px', background: '#fff', padding: '8px', borderRadius: '4px' }}>
                Eksempel: "Nå spiser jeg frokost."
              </div>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '14px',
              borderRadius: '8px',
              marginBottom: '12px',
              borderLeft: '4px solid #27ae60'
            }}>
              <strong style={{ color: '#333' }}>"Om litt" / "Snart"</strong>
              <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>
                Betyr vanligvis <strong>5-15 minutter</strong>. Ikke lenge å vente.
              </p>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '8px', background: '#fff', padding: '8px', borderRadius: '4px' }}>
                Eksempel: "Maten er klar om litt." = Ca. 10 minutter til.
              </div>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '14px',
              borderRadius: '8px',
              marginBottom: '12px',
              borderLeft: '4px solid #e67e22'
            }}>
              <strong style={{ color: '#333' }}>"Etterpå" / "Senere"</strong>
              <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>
                Etter det du gjør nå. Kan være <strong>30 minutter til noen timer</strong>.
              </p>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '8px', background: '#fff', padding: '8px', borderRadius: '4px' }}>
                Eksempel: "Vi går på butikken etterpå." = Etter at vi har spist.
              </div>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '14px',
              borderRadius: '8px',
              marginBottom: '12px',
              borderLeft: '4px solid #2980b9'
            }}>
              <strong style={{ color: '#333' }}>"I morgen"</strong>
              <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>
                Dagen etter i dag. Når du har sovet én natt.
              </p>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '8px', background: '#fff', padding: '8px', borderRadius: '4px' }}>
                Eksempel: "I morgen er det lørdag." = Etter at du har sovet i natt.
              </div>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '14px',
              borderRadius: '8px',
              marginBottom: '12px',
              borderLeft: '4px solid #8e44ad'
            }}>
              <strong style={{ color: '#333' }}>"I går"</strong>
              <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>
                Dagen før i dag. Da du våknet forrige gang.
              </p>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '8px', background: '#fff', padding: '8px', borderRadius: '4px' }}>
                Eksempel: "I går var vi på kino." = Forrige dag, før du sov.
              </div>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '14px',
              borderRadius: '8px',
              marginBottom: '12px',
              borderLeft: '4px solid #c0392b'
            }}>
              <strong style={{ color: '#333' }}>"Neste uke"</strong>
              <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>
                Om <strong>7 dager</strong> eller mer. Du må sove 7 netter først.
              </p>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '8px', background: '#fff', padding: '8px', borderRadius: '4px' }}>
                Eksempel: "Bestemor kommer neste uke." = Først må hele denne uka passere.
              </div>
            </div>

            <div style={{
              background: '#fff8e1',
              padding: '14px',
              borderRadius: '8px',
              border: '2px solid #ffe082'
            }}>
              <strong style={{ color: '#f57f17' }}>Tips:</strong>
              <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>
                Hvis du er usikker på hva noen mener, er det helt greit å spørre:
                <strong> "Hvor mange minutter er det?"</strong> eller
                <strong> "Hvor mange dager er det?"</strong>
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
              <strong>Start enkelt</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                Trykk på "Enkel modus" øverst for å bare se timer og minutter først. Legg til mer når du er klar.
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>Øv daglig</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                Bruk klokka hver dag i 5-10 minutter. Kort og ofte gir best læring.
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>Snakk om tiden</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                Si høyt hva du ser: "Nå er klokka 3. Om 15 minutter skal vi spise."
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>Koble til hverdagen</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                Bruk klokka til å vise når ting skjer: "Friminutt er om 10 minutter."
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>Lek med tiden</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                Dra ringene og se hva som skjer. Utforsking er læring!
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>Bruk øvelsesmodus</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                Trykk på "Øvelser" for å øve på å lese og stille klokka.
              </p>
            </div>

            <div style={{
              background: '#e8f5e9',
              padding: '12px',
              borderRadius: '8px',
              marginTop: '16px',
              border: '2px solid #c8e6c9'
            }}>
              <strong style={{ color: '#2e7d32' }}>Viktig å huske:</strong>
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
