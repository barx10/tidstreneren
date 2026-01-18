import React, { useState, useEffect } from 'react';
import { speak, initVoices } from '../utils/speechUtils';
import { useLanguage } from '../context/LanguageContext';

function CountdownTimer({ onClose }) {
  const { t, language } = useLanguage();
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
    const hourWord = timeRemaining.hours === 1 ? t('countdown.hourSingular') : t('countdown.hourPlural');
    const minuteWord = timeRemaining.minutes === 1 ? t('countdown.minuteSingular') : t('countdown.minutePlural');

    if (eventName) {
      text = `${eventName} ${t('countdown.isIn')} `;
    } else {
      text = `${t('countdown.itIs')} `;
    }

    if (timeRemaining.hours > 0) {
      text += `${timeRemaining.hours} ${hourWord} ${language === 'no' ? 'og' : 'and'} `;
    }
    text += `${timeRemaining.minutes} ${minuteWord}`;

    if (!eventName) {
      text += ` ${t('countdown.remaining')}`;
    }

    speak(text, language);
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
          <h2 style={{ margin: 0, color: '#2c3e50' }}>{t('countdown.title')}</h2>
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
              {t('countdown.description')}
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '8px' }}>
                {t('countdown.whatHappens')}
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder={t('countdown.placeholder')}
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
                {t('countdown.whenHappens')}
              </label>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <label style={{ fontSize: '11px', color: '#888' }}>{t('countdown.hour')}</label>
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
                  <label style={{ fontSize: '11px', color: '#888' }}>{t('countdown.minute')}</label>
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
                {t('countdown.quickSelect')}
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { label: t('countdown.min5'), mins: 5 },
                  { label: t('countdown.min10'), mins: 10 },
                  { label: t('countdown.min15'), mins: 15 },
                  { label: t('countdown.min30'), mins: 30 },
                  { label: t('countdown.hour1'), mins: 60 },
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
              {t('countdown.startCountdown')}
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
              {language === 'no' ? 'Klokka' : 'At'} {formatTime(targetHours)}:{formatTime(targetMinutes)}
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
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>{t('countdown.hours')}</div>
                    </div>
                    <div style={{ fontSize: '48px', fontWeight: 'bold' }}>:</div>
                    <div>
                      <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
                        {formatTime(timeRemaining.minutes)}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>{t('countdown.minutes')}</div>
                    </div>
                    <div style={{ fontSize: '48px', fontWeight: 'bold' }}>:</div>
                    <div>
                      <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
                        {formatTime(timeRemaining.seconds)}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>{t('countdown.seconds')}</div>
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
                      ? `${timeRemaining.hours} ${timeRemaining.hours === 1 ? t('countdown.hourSingular') : t('countdown.hourPlural')} ${language === 'no' ? 'og' : 'and'} ${timeRemaining.minutes} ${timeRemaining.minutes === 1 ? t('countdown.minuteSingular') : t('countdown.minutePlural')} ${t('countdown.remaining')}`
                      : timeRemaining.minutes > 0
                        ? `${timeRemaining.minutes} ${timeRemaining.minutes === 1 ? t('countdown.minuteSingular') : t('countdown.minutePlural')} ${t('countdown.remaining')}`
                        : t('countdown.almostThere')
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
                      {t('countdown.soonOnly')} {timeRemaining.minutes} {timeRemaining.minutes === 1 ? t('countdown.minuteSingular') : t('countdown.minutePlural')} {t('countdown.remaining')}!
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
                {t('countdown.hearRemaining')}
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
                {t('countdown.stop')}
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
          <strong style={{ color: '#1565c0', fontSize: '14px' }}>{t('countdown.whatIsThis')}</strong>
          <p style={{ fontSize: '13px', color: '#555', margin: '8px 0 0 0' }}>
            {t('countdown.explanation')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CountdownTimer;
