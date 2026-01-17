import React, { useState, useEffect } from 'react';

const DEFAULT_ROUTINES = [
  { id: 1, name: 'Våkne', hours: 7, minutes: 0, icon: '☀️' },
  { id: 2, name: 'Frokost', hours: 7, minutes: 30, icon: '🍳' },
  { id: 3, name: 'Skole begynner', hours: 8, minutes: 30, icon: '🏫' },
  { id: 4, name: 'Friminutt', hours: 10, minutes: 0, icon: '⚽' },
  { id: 5, name: 'Lunsj', hours: 11, minutes: 30, icon: '🥪' },
  { id: 6, name: 'Skole slutt', hours: 14, minutes: 0, icon: '🎒' },
  { id: 7, name: 'Middag', hours: 17, minutes: 0, icon: '🍽️' },
  { id: 8, name: 'Leggetid', hours: 20, minutes: 30, icon: '🌙' },
];

const ICONS = ['☀️', '🍳', '🏫', '⚽', '🥪', '🎒', '🍽️', '🌙', '📚', '🎮', '🛁', '🚗', '🎨', '🎵', '💊', '🦷'];

function DailyRoutine({ onClose }) {
  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem('dailyRoutines');
    return saved ? JSON.parse(saved) : DEFAULT_ROUTINES;
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editingId, setEditingId] = useState(null);
  const [newRoutine, setNewRoutine] = useState({ name: '', hours: 12, minutes: 0, icon: '⭐' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('dailyRoutines', JSON.stringify(routines));
  }, [routines]);

  const formatTime = (hours, minutes) => {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const getTimeUntil = (hours, minutes) => {
    const now = currentTime;
    const target = new Date(now);
    target.setHours(hours, minutes, 0, 0);

    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }

    const diff = target - now;
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (h === 0 && m === 0) return 'Nå!';
    if (h === 0) return `om ${m} min`;
    if (m === 0) return `om ${h} t`;
    return `om ${h}t ${m}m`;
  };

  const isCurrentActivity = (routine, index) => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    const routineTime = routine.hours * 60 + routine.minutes;

    // Finn neste rutine
    const sortedRoutines = [...routines].sort((a, b) =>
      (a.hours * 60 + a.minutes) - (b.hours * 60 + b.minutes)
    );
    const routineIndex = sortedRoutines.findIndex(r => r.id === routine.id);
    const nextRoutine = sortedRoutines[routineIndex + 1];
    const nextTime = nextRoutine
      ? nextRoutine.hours * 60 + nextRoutine.minutes
      : sortedRoutines[0].hours * 60 + sortedRoutines[0].minutes + 24 * 60;

    return now >= routineTime && now < nextTime;
  };

  const isUpcoming = (hours, minutes) => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    const target = hours * 60 + minutes;
    const diff = target - now;
    return diff > 0 && diff <= 30; // Innen 30 minutter
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'nb-NO';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakRoutine = (routine) => {
    const timeUntil = getTimeUntil(routine.hours, routine.minutes);
    speak(`${routine.name} er klokka ${routine.hours} ${routine.minutes > 0 ? `og ${routine.minutes}` : ''}. Det er ${timeUntil.replace('om ', '')}.`);
  };

  const addRoutine = () => {
    if (!newRoutine.name.trim()) return;

    setRoutines([...routines, {
      ...newRoutine,
      id: Date.now(),
    }]);
    setNewRoutine({ name: '', hours: 12, minutes: 0, icon: '⭐' });
    setShowAddForm(false);
  };

  const deleteRoutine = (id) => {
    setRoutines(routines.filter(r => r.id !== id));
  };

  const updateRoutine = (id, updates) => {
    setRoutines(routines.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const resetToDefault = () => {
    setRoutines(DEFAULT_ROUTINES);
  };

  const sortedRoutines = [...routines].sort((a, b) =>
    (a.hours * 60 + a.minutes) - (b.hours * 60 + b.minutes)
  );

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '480px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>Min dag</h2>
          <button
            onClick={onClose}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            X
          </button>
        </div>

        {/* Nåværende tid */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          padding: '15px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '20px',
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Klokka er nå</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
            {formatTime(currentTime.getHours(), currentTime.getMinutes())}
          </div>
        </div>

        {/* Rutineliste */}
        <div style={{ marginBottom: '20px' }}>
          {sortedRoutines.map((routine, index) => {
            const isCurrent = isCurrentActivity(routine, index);
            const upcoming = isUpcoming(routine.hours, routine.minutes);

            return (
              <div
                key={routine.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 15px',
                  marginBottom: '8px',
                  borderRadius: '12px',
                  background: isCurrent
                    ? 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)'
                    : upcoming
                      ? '#fff3e0'
                      : '#f8f9fa',
                  border: isCurrent
                    ? 'none'
                    : upcoming
                      ? '2px solid #ffcc80'
                      : '2px solid #e0e0e0',
                  color: isCurrent ? 'white' : '#2c3e50',
                }}
              >
                <div style={{ fontSize: '24px', marginRight: '12px' }}>
                  {routine.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    {routine.name}
                    {isCurrent && (
                      <span style={{
                        fontSize: '11px',
                        background: 'rgba(255,255,255,0.3)',
                        padding: '2px 8px',
                        borderRadius: '10px',
                      }}>
                        NÅ
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    opacity: isCurrent ? 0.9 : 0.7,
                    marginTop: '2px',
                  }}>
                    {formatTime(routine.hours, routine.minutes)}
                    {!isCurrent && (
                      <span style={{ marginLeft: '8px' }}>
                        ({getTimeUntil(routine.hours, routine.minutes)})
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => speakRoutine(routine)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: 'none',
                      background: isCurrent ? 'rgba(255,255,255,0.3)' : '#667eea',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                    title="Hør"
                  >
                    🔊
                  </button>
                  <button
                    onClick={() => deleteRoutine(routine.id)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: 'none',
                      background: isCurrent ? 'rgba(255,255,255,0.3)' : '#e74c3c',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                    title="Slett"
                  >
                    X
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legg til ny */}
        {showAddForm ? (
          <div style={{
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '15px',
            marginBottom: '15px',
          }}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>
                Navn på aktivitet
              </label>
              <input
                type="text"
                value={newRoutine.name}
                onChange={(e) => setNewRoutine({ ...newRoutine, name: e.target.value })}
                placeholder="F.eks. Gymnastikk"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>
                  Time
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={newRoutine.hours}
                  onChange={(e) => setNewRoutine({ ...newRoutine, hours: parseInt(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>
                  Minutt
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  step="5"
                  value={newRoutine.minutes}
                  onChange={(e) => setNewRoutine({ ...newRoutine, minutes: parseInt(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>
                Velg ikon
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {ICONS.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNewRoutine({ ...newRoutine, icon })}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: newRoutine.icon === icon ? '3px solid #667eea' : '2px solid #e0e0e0',
                      background: newRoutine.icon === icon ? '#f0f0ff' : 'white',
                      cursor: 'pointer',
                      fontSize: '18px',
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={addRoutine}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Legg til
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#95a5a6',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Avbryt
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                flex: 1,
                padding: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              + Legg til aktivitet
            </button>
            <button
              onClick={resetToDefault}
              style={{
                padding: '12px',
                background: '#95a5a6',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
              }}
              title="Tilbakestill til standard"
            >
              Reset
            </button>
          </div>
        )}

        {/* Hjelpetekst */}
        <div style={{
          padding: '15px',
          background: '#e8f5e9',
          borderRadius: '8px',
          border: '2px solid #c8e6c9',
        }}>
          <strong style={{ color: '#2e7d32', fontSize: '14px' }}>Slik fungerer det:</strong>
          <ul style={{ fontSize: '13px', color: '#555', margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>Grønn = det du gjør nå</li>
            <li>Oransje = kommer snart (innen 30 min)</li>
            <li>Trykk på høyttaleren for å høre tiden</li>
            <li>Legg til dine egne aktiviteter</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DailyRoutine;
