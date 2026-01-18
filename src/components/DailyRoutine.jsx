import React, { useState, useEffect } from 'react';
import { speak, initVoices } from '../utils/speechUtils';
import { useLanguage } from '../context/LanguageContext';

const ICONS = ['☀️', '🍳', '🏫', '⚽', '🥪', '🎒', '🍽️', '🌙', '📚', '🎮', '🛁', '🚗', '🎨', '🎵', '💊', '🦷'];

function DailyRoutine({ onClose }) {
  const { t, language } = useLanguage();

  const DEFAULT_ROUTINES_NO = [
    { id: 1, name: 'Våkne', hours: 7, minutes: 0, icon: '☀️' },
    { id: 2, name: 'Frokost', hours: 7, minutes: 30, icon: '🍳' },
    { id: 3, name: 'Skole begynner', hours: 8, minutes: 30, icon: '🏫' },
    { id: 4, name: 'Friminutt', hours: 10, minutes: 0, icon: '⚽' },
    { id: 5, name: 'Lunsj', hours: 11, minutes: 30, icon: '🥪' },
    { id: 6, name: 'Skole slutt', hours: 14, minutes: 0, icon: '🎒' },
    { id: 7, name: 'Middag', hours: 17, minutes: 0, icon: '🍽️' },
    { id: 8, name: 'Leggetid', hours: 20, minutes: 30, icon: '🌙' },
  ];

  const DEFAULT_ROUTINES_EN = [
    { id: 1, name: 'Wake up', hours: 7, minutes: 0, icon: '☀️' },
    { id: 2, name: 'Breakfast', hours: 7, minutes: 30, icon: '🍳' },
    { id: 3, name: 'School starts', hours: 8, minutes: 30, icon: '🏫' },
    { id: 4, name: 'Recess', hours: 10, minutes: 0, icon: '⚽' },
    { id: 5, name: 'Lunch', hours: 11, minutes: 30, icon: '🥪' },
    { id: 6, name: 'School ends', hours: 14, minutes: 0, icon: '🎒' },
    { id: 7, name: 'Dinner', hours: 17, minutes: 0, icon: '🍽️' },
    { id: 8, name: 'Bedtime', hours: 20, minutes: 30, icon: '🌙' },
  ];

  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem(`dailyRoutines_${language}`);
    return saved ? JSON.parse(saved) : (language === 'no' ? DEFAULT_ROUTINES_NO : DEFAULT_ROUTINES_EN);
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newRoutine, setNewRoutine] = useState({ name: '', hours: 12, minutes: 0, icon: '⭐' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`dailyRoutines_${language}`);
    if (saved) {
      setRoutines(JSON.parse(saved));
    } else {
      setRoutines(language === 'no' ? DEFAULT_ROUTINES_NO : DEFAULT_ROUTINES_EN);
    }
  }, [language]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem(`dailyRoutines_${language}`, JSON.stringify(routines));
  }, [routines, language]);

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

    if (h === 0 && m === 0) return t('routine.nowExclaim');
    if (h === 0) return `${t('routine.in')} ${m} ${t('routine.min')}`;
    if (m === 0) return `${t('routine.in')} ${h}${t('routine.h')}`;
    return `${t('routine.in')} ${h}${t('routine.h')} ${m}${t('routine.m')}`;
  };

  const isCurrentActivity = (routine) => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    const routineTime = routine.hours * 60 + routine.minutes;

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
    return diff > 0 && diff <= 30;
  };

  useEffect(() => {
    initVoices();
  }, []);

  const speakRoutine = (routine) => {
    const timeUntilStr = getTimeUntil(routine.hours, routine.minutes);
    let text;
    if (language === 'no') {
      text = `${routine.name} ${t('routine.isAt')} ${routine.hours} ${routine.minutes > 0 ? `${t('routine.and')} ${routine.minutes}` : ''}. ${t('routine.itIsIn')} ${timeUntilStr.replace(t('routine.in') + ' ', '')}.`;
    } else {
      text = `${routine.name} ${t('routine.isAt')} ${routine.hours}:${String(routine.minutes).padStart(2, '0')}. ${t('routine.itIsIn')} ${timeUntilStr.replace(t('routine.in') + ' ', '')}.`;
    }
    speak(text, language);
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

  const resetToDefault = () => {
    setRoutines(language === 'no' ? DEFAULT_ROUTINES_NO : DEFAULT_ROUTINES_EN);
    localStorage.removeItem(`dailyRoutines_${language}`);
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
          <h2 style={{ margin: 0, color: '#2c3e50' }}>{t('routine.title')}</h2>
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

        {/* Current time */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          padding: '15px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '20px',
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>{t('routine.currentTime')}</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
            {formatTime(currentTime.getHours(), currentTime.getMinutes())}
          </div>
        </div>

        {/* Routine list */}
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
                        {t('routine.now')}
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
                    title={t('routine.hear')}
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
                    title={t('routine.delete')}
                  >
                    X
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add new form */}
        {showAddForm ? (
          <div style={{
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '15px',
            marginBottom: '15px',
          }}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>
                {t('routine.activityName')}
              </label>
              <input
                type="text"
                value={newRoutine.name}
                onChange={(e) => setNewRoutine({ ...newRoutine, name: e.target.value })}
                placeholder={t('routine.activityPlaceholder')}
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
                  {t('routine.hour')}
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
                  {t('routine.minute')}
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
                {t('routine.chooseIcon')}
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
                {t('routine.add')}
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
                {t('routine.cancel')}
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
              {t('routine.addActivity')}
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
              title={t('routine.resetToDefault')}
            >
              {t('routine.reset')}
            </button>
          </div>
        )}

        {/* Help text */}
        <div style={{
          padding: '15px',
          background: '#e8f5e9',
          borderRadius: '8px',
          border: '2px solid #c8e6c9',
        }}>
          <strong style={{ color: '#2e7d32', fontSize: '14px' }}>{t('routine.howItWorks')}</strong>
          <ul style={{ fontSize: '13px', color: '#555', margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>{t('routine.greenCurrent')}</li>
            <li>{t('routine.orangeSoon')}</li>
            <li>{t('routine.clickSpeaker')}</li>
            <li>{t('routine.addOwn')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DailyRoutine;
