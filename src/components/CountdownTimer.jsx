import React, { useState, useEffect } from 'react';
import { speak, initVoices } from '../utils/speechUtils';

function CountdownTimer({ onClose }) {
  const [targetHours, setTargetHours] = useState(12);
  const [targetMinutes, setTargetMinutes] = useState(0);
  const [eventName, setEventName] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date();
      target.setHours(targetHours, targetMinutes, 0, 0);

      // Hvis måltiden er passert, sett til i morgen
      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }

      const diff = target - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ hours, minutes, seconds, total: diff });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, targetHours, targetMinutes]);

  // Initialize TTS voices on mount
  useEffect(() => {
    initVoices();
  }, []);

  const speakRemaining = () => {
    if (!timeRemaining) return;

    let text = '';
    if (eventName) {
      text = `${eventName} er om `;
    } else {
      text = 'Det er ';
    }

    if (timeRemaining.hours > 0) {
      text += `${timeRemaining.hours} ${timeRemaining.hours === 1 ? 'time' : 'timer'} og `;
    }
    text += `${timeRemaining.minutes} ${timeRemaining.minutes === 1 ? 'minutt' : 'minutter'}`;

    if (!eventName) {
      text += ' igjen';
    }

    speak(text);
  };

  const getProgressColor = () => {
    if (!timeRemaining) return '#667eea';
    const totalMinutes = timeRemaining.hours * 60 + timeRemaining.minutes;

    if (totalMinutes <= 5) return '#e74c3c';
    if (totalMinutes <= 15) return '#f39c12';
    if (totalMinutes <= 30) return '#27ae60';
    return '#667eea';
  };

  const formatTime = (value) => String(value).padStart(2, '0');

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
        maxWidth: '420px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>Nedtelling</h2>
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

        {!isActive ? (
          // Oppsett
          <div>
            <p style={{ color: '#555', marginBottom: '20px', fontSize: '14px' }}>
              Sett opp en nedtelling til noe som skal skje. Dette hjelper deg å forstå hvor lang tid det er igjen.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '8px' }}>
                Hva skal skje? (valgfritt)
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="F.eks. Friminutt, Lunsj, Hjem"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '8px' }}>
                Når skal det skje?
              </label>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <label style={{ fontSize: '11px', color: '#888' }}>Time</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <button
                      onClick={() => setTargetHours(h => h <= 0 ? 23 : h - 1)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        background: '#2980b9',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '20px',
                      }}
                    >
                      -
                    </button>
                    <span style={{
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: '#2980b9',
                      minWidth: '50px',
                      textAlign: 'center',
                    }}>
                      {formatTime(targetHours)}
                    </span>
                    <button
                      onClick={() => setTargetHours(h => h >= 23 ? 0 : h + 1)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        background: '#2980b9',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '20px',
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#888', alignSelf: 'flex-end', paddingBottom: '5px' }}>
                  :
                </div>

                <div style={{ textAlign: 'center' }}>
                  <label style={{ fontSize: '11px', color: '#888' }}>Minutt</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <button
                      onClick={() => setTargetMinutes(m => m <= 0 ? 55 : m - 5)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        background: '#8e44ad',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '20px',
                      }}
                    >
                      -
                    </button>
                    <span style={{
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: '#8e44ad',
                      minWidth: '50px',
                      textAlign: 'center',
                    }}>
                      {formatTime(targetMinutes)}
                    </span>
                    <button
                      onClick={() => setTargetMinutes(m => m >= 55 ? 0 : m + 5)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        background: '#8e44ad',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '20px',
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Hurtigvalg */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '8px' }}>
                Hurtigvalg
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { label: '5 min', mins: 5 },
                  { label: '10 min', mins: 10 },
                  { label: '15 min', mins: 15 },
                  { label: '30 min', mins: 30 },
                  { label: '1 time', mins: 60 },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      const now = new Date();
                      now.setMinutes(now.getMinutes() + opt.mins);
                      setTargetHours(now.getHours());
                      setTargetMinutes(Math.floor(now.getMinutes() / 5) * 5);
                    }}
                    style={{
                      padding: '8px 14px',
                      background: '#f0f0f0',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsActive(true)}
              style={{
                width: '100%',
                padding: '15px',
                background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Start nedtelling
            </button>
          </div>
        ) : (
          // Aktiv nedtelling
          <div style={{ textAlign: 'center' }}>
            {eventName && (
              <div style={{
                fontSize: '18px',
                color: '#555',
                marginBottom: '10px',
              }}>
                {eventName}
              </div>
            )}

            <div style={{
              fontSize: '14px',
              color: '#888',
              marginBottom: '15px',
            }}>
              Klokka {formatTime(targetHours)}:{formatTime(targetMinutes)}
            </div>

            {timeRemaining && (
              <>
                <div style={{
                  background: `linear-gradient(135deg, ${getProgressColor()} 0%, ${getProgressColor()}dd 100%)`,
                  borderRadius: '16px',
                  padding: '30px',
                  marginBottom: '20px',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    color: 'white',
                  }}>
                    <div>
                      <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
                        {formatTime(timeRemaining.hours)}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>timer</div>
                    </div>
                    <div style={{ fontSize: '48px', fontWeight: 'bold' }}>:</div>
                    <div>
                      <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
                        {formatTime(timeRemaining.minutes)}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>minutter</div>
                    </div>
                    <div style={{ fontSize: '48px', fontWeight: 'bold' }}>:</div>
                    <div>
                      <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
                        {formatTime(timeRemaining.seconds)}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>sekunder</div>
                    </div>
                  </div>
                </div>

                {/* Visuell representasjon */}
                <div style={{
                  marginBottom: '20px',
                  padding: '15px',
                  background: '#f8f9fa',
                  borderRadius: '12px',
                }}>
                  <div style={{ fontSize: '14px', color: '#555', marginBottom: '10px' }}>
                    {timeRemaining.hours > 0
                      ? `${timeRemaining.hours} ${timeRemaining.hours === 1 ? 'time' : 'timer'} og ${timeRemaining.minutes} ${timeRemaining.minutes === 1 ? 'minutt' : 'minutter'} igjen`
                      : timeRemaining.minutes > 0
                        ? `${timeRemaining.minutes} ${timeRemaining.minutes === 1 ? 'minutt' : 'minutter'} igjen`
                        : 'Nesten der!'
                    }
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    height: '20px',
                    background: '#e0e0e0',
                    borderRadius: '10px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      background: getProgressColor(),
                      width: timeRemaining.minutes <= 5 && timeRemaining.hours === 0
                        ? `${(1 - (timeRemaining.minutes * 60 + timeRemaining.seconds) / 300) * 100}%`
                        : '10%',
                      transition: 'width 1s linear',
                    }} />
                  </div>

                  {timeRemaining.minutes <= 5 && timeRemaining.hours === 0 && (
                    <div style={{
                      marginTop: '10px',
                      padding: '10px',
                      background: '#fff3e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: '#e65100',
                      fontWeight: '500',
                    }}>
                      Snart! Bare {timeRemaining.minutes} {timeRemaining.minutes === 1 ? 'minutt' : 'minutter'} igjen!
                    </div>
                  )}
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={speakRemaining}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Hør hvor lenge
              </button>
              <button
                onClick={() => setIsActive(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#e74c3c',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Stopp
              </button>
            </div>
          </div>
        )}

        {/* Hjelpetekst */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#e3f2fd',
          borderRadius: '8px',
          border: '2px solid #90caf9',
        }}>
          <strong style={{ color: '#1565c0', fontSize: '14px' }}>Hva er dette?</strong>
          <p style={{ fontSize: '13px', color: '#555', margin: '8px 0 0 0' }}>
            Nedtellingen viser deg hvor lang tid det er til noe skal skje.
            Når det er lite tid igjen, blir fargen rød - da er det snart!
          </p>
        </div>
      </div>
    </div>
  );
}

export default CountdownTimer;
