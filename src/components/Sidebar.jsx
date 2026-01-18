import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { speak } from '../utils/speechUtils';

const COLORS = {
  year: '#16a085',
  months: '#e67e22',
  days: '#27ae60',
  hours: '#2980b9',
  minutes: '#8e44ad',
  seconds: '#c0392b',
};

function Sidebar({
  currentTime,
  setCurrentTime,
  isRunning,
  setIsRunning,
  simplifiedMode,
  selectedUnits
}) {
  const { t, language } = useLanguage();
  const months = t('months');

  const year = currentTime.getFullYear();
  const month = currentTime.getMonth();
  const day = currentTime.getDate();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  // Adjustment functions
  const adjust = (unit, delta) => {
    const newDate = new Date(currentTime);
    switch (unit) {
      case 'year': newDate.setFullYear(newDate.getFullYear() + delta); break;
      case 'month': newDate.setMonth(newDate.getMonth() + delta); break;
      case 'day': newDate.setDate(newDate.getDate() + delta); break;
      case 'hour': newDate.setHours(newDate.getHours() + delta); break;
      case 'minute': newDate.setMinutes(newDate.getMinutes() + delta); break;
      case 'second': newDate.setSeconds(newDate.getSeconds() + delta); break;
    }
    setCurrentTime(newDate);
  };

  const setToNow = () => setCurrentTime(new Date());

  // Time/date strings for speech
  const timeStr = language === 'no'
    ? `klokka ${hours} og ${minutes}`
    : `${hours}:${String(minutes).padStart(2, '0')}`;
  const dateStr = language === 'no'
    ? `${day}. ${months[month].toLowerCase()} ${year}`
    : `${months[month]} ${day}, ${year}`;

  // Analog clock calculations
  const hourAngle = (hours % 12 + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  const sectionStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  };

  const labelStyle = {
    fontSize: '11px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
    fontWeight: '600',
  };

  const buttonStyle = {
    padding: '8px 12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const stepperButtonStyle = {
    width: '28px',
    height: '28px',
    border: 'none',
    background: '#f0f0f0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#555',
  };

  return (
    <div style={{
      width: '280px',
      height: '100vh',
      position: 'fixed',
      right: 0,
      top: 0,
      background: '#f5f6fa',
      borderLeft: '1px solid #e0e0e0',
      padding: '70px 16px 16px 16px',
      overflowY: 'auto',
      boxSizing: 'border-box',
      zIndex: 100,
    }}>
      {/* Dato & Tid Display */}
      <div style={sectionStyle}>
        <div style={labelStyle}>{t('clock.dateTime')}</div>
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>
            <span style={{ color: COLORS.hours }}>{String(hours).padStart(2, '0')}</span>
            <span style={{ color: '#7f8c8d' }}>:</span>
            <span style={{ color: COLORS.minutes }}>{String(minutes).padStart(2, '0')}</span>
            {(!simplifiedMode || selectedUnits?.seconds) && (
              <>
                <span style={{ color: '#7f8c8d' }}>:</span>
                <span style={{ color: COLORS.seconds }}>{String(seconds).padStart(2, '0')}</span>
              </>
            )}
          </div>
          <div style={{ fontSize: '14px', color: '#555' }}>
            <span style={{ color: COLORS.days }}>{day}.</span>{' '}
            <span style={{ color: COLORS.months }}>{months[month].toLowerCase()}</span>{' '}
            <span style={{ color: COLORS.year }}>{year}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button style={buttonStyle} onClick={() => speak(dateStr, language)}>
            🔊 {t('clock.readDate')}
          </button>
          <button style={buttonStyle} onClick={() => speak(timeStr, language)}>
            🔊 {t('clock.readTime')}
          </button>
        </div>
      </div>

      {/* Analog Clock */}
      <div style={sectionStyle}>
        <div style={labelStyle}>{t('clock.analogClock')}</div>
        <svg width="100%" viewBox="0 0 120 120" style={{ display: 'block', maxWidth: '150px', margin: '0 auto' }}>
          <circle cx="60" cy="60" r="55" fill="#f8f9fa" stroke="#e0e0e0" strokeWidth="2"/>
          {[...Array(12)].map((_, i) => {
            const num = i === 0 ? 12 : i;
            const angle = (i * 30 - 90) * (Math.PI / 180);
            return (
              <text
                key={i}
                x={60 + 40 * Math.cos(angle)}
                y={60 + 40 * Math.sin(angle)}
                fill="#2c3e50"
                fontSize="12"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {num}
              </text>
            );
          })}
          <line
            x1="60" y1="60"
            x2={60 + 25 * Math.sin(hourAngle * Math.PI / 180)}
            y2={60 - 25 * Math.cos(hourAngle * Math.PI / 180)}
            stroke={COLORS.hours} strokeWidth="4" strokeLinecap="round"
          />
          <line
            x1="60" y1="60"
            x2={60 + 35 * Math.sin(minuteAngle * Math.PI / 180)}
            y2={60 - 35 * Math.cos(minuteAngle * Math.PI / 180)}
            stroke={COLORS.minutes} strokeWidth="3" strokeLinecap="round"
          />
          {(!simplifiedMode || selectedUnits?.seconds) && (
            <line
              x1="60" y1="60"
              x2={60 + 38 * Math.sin(secondAngle * Math.PI / 180)}
              y2={60 - 38 * Math.cos(secondAngle * Math.PI / 180)}
              stroke={COLORS.seconds} strokeWidth="1.5" strokeLinecap="round"
            />
          )}
          <circle cx="60" cy="60" r="4" fill="#2c3e50"/>
        </svg>
      </div>

      {/* Controls */}
      <div style={sectionStyle}>
        <div style={labelStyle}>{t('clock.controls')}</div>

        {/* Date controls */}
        {(!simplifiedMode || selectedUnits?.year || selectedUnits?.months || selectedUnits?.days) && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '6px' }}>{t('clock.date')}</div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {(!simplifiedMode || selectedUnits?.year) && (
                <div style={{ textAlign: 'center' }}>
                  <button style={stepperButtonStyle} onClick={() => adjust('year', 1)}>+</button>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.year, margin: '4px 0' }}>{year}</div>
                  <button style={stepperButtonStyle} onClick={() => adjust('year', -1)}>−</button>
                  <div style={{ fontSize: '9px', color: '#888' }}>{t('clock.year')}</div>
                </div>
              )}
              {(!simplifiedMode || selectedUnits?.months) && (
                <div style={{ textAlign: 'center' }}>
                  <button style={stepperButtonStyle} onClick={() => adjust('month', 1)}>+</button>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.months, margin: '4px 0' }}>{String(month + 1).padStart(2, '0')}</div>
                  <button style={stepperButtonStyle} onClick={() => adjust('month', -1)}>−</button>
                  <div style={{ fontSize: '9px', color: '#888' }}>{t('clock.month')}</div>
                </div>
              )}
              {(!simplifiedMode || selectedUnits?.days) && (
                <div style={{ textAlign: 'center' }}>
                  <button style={stepperButtonStyle} onClick={() => adjust('day', 1)}>+</button>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.days, margin: '4px 0' }}>{String(day).padStart(2, '0')}</div>
                  <button style={stepperButtonStyle} onClick={() => adjust('day', -1)}>−</button>
                  <div style={{ fontSize: '9px', color: '#888' }}>{t('clock.day')}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Time controls */}
        {(!simplifiedMode || selectedUnits?.hours || selectedUnits?.minutes || selectedUnits?.seconds) && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '6px' }}>{t('clock.time')}</div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {(!simplifiedMode || selectedUnits?.hours) && (
                <div style={{ textAlign: 'center' }}>
                  <button style={stepperButtonStyle} onClick={() => adjust('hour', 1)}>+</button>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.hours, margin: '4px 0' }}>{String(hours).padStart(2, '0')}</div>
                  <button style={stepperButtonStyle} onClick={() => adjust('hour', -1)}>−</button>
                  <div style={{ fontSize: '9px', color: '#888' }}>{t('clock.hour')}</div>
                </div>
              )}
              {(!simplifiedMode || selectedUnits?.minutes) && (
                <div style={{ textAlign: 'center' }}>
                  <button style={stepperButtonStyle} onClick={() => adjust('minute', 1)}>+</button>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.minutes, margin: '4px 0' }}>{String(minutes).padStart(2, '0')}</div>
                  <button style={stepperButtonStyle} onClick={() => adjust('minute', -1)}>−</button>
                  <div style={{ fontSize: '9px', color: '#888' }}>{t('clock.minute')}</div>
                </div>
              )}
              {(!simplifiedMode || selectedUnits?.seconds) && (
                <div style={{ textAlign: 'center' }}>
                  <button style={stepperButtonStyle} onClick={() => adjust('second', 1)}>+</button>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.seconds, margin: '4px 0' }}>{String(seconds).padStart(2, '0')}</div>
                  <button style={stepperButtonStyle} onClick={() => adjust('second', -1)}>−</button>
                  <div style={{ fontSize: '9px', color: '#888' }}>{t('clock.second')}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={setToNow}
            style={{ ...buttonStyle, background: '#3498db' }}
          >
            {t('clock.setNow')}
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            style={{
              ...buttonStyle,
              background: isRunning
                ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
                : 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)'
            }}
          >
            {isRunning ? t('clock.stop') : t('clock.start')}
          </button>
        </div>
      </div>

      {/* Legend */}
      <div style={sectionStyle}>
        <div style={labelStyle}>{t('clock.legend')}</div>
        <div style={{ fontSize: '12px' }}>
          {(!simplifiedMode || selectedUnits?.months) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: COLORS.months }} />
              <span style={{ color: '#555' }}>{t('clock.monthsLabel')}</span>
            </div>
          )}
          {(!simplifiedMode || selectedUnits?.days) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: COLORS.days }} />
              <span style={{ color: '#555' }}>{t('clock.daysLabel')}</span>
            </div>
          )}
          {(!simplifiedMode || selectedUnits?.hours) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: COLORS.hours }} />
              <span style={{ color: '#555' }}>{t('clock.hoursLabel')}</span>
            </div>
          )}
          {(!simplifiedMode || selectedUnits?.minutes) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: COLORS.minutes }} />
              <span style={{ color: '#555' }}>{t('clock.minutesLabel')}</span>
            </div>
          )}
          {(!simplifiedMode || selectedUnits?.seconds) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: COLORS.seconds }} />
              <span style={{ color: '#555' }}>{t('clock.secondsLabel')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
