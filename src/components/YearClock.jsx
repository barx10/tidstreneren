import React, { useState, useEffect, useRef, useCallback } from 'react';
import Palette from './Palette';
import { speak, initVoices } from '../utils/speechUtils';
import { useLanguage } from '../context/LanguageContext';
import { COLORS } from '../constants/colors';

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const leapDayColor = '#9b59b6';
const leapDayGlow = '#8e44ad';

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDaysInMonth(month, year) {
  if (month === 1 && isLeapYear(year)) {
    return 29;
  }
  return DAYS_IN_MONTH[month];
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function SpeakButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '6px',
        color: 'white',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
      }}
    >
      🔊 {children}
    </button>
  );
}

function Stepper({ value, label, width, color, onIncrement, onDecrement }) {
  const buttonStyle = {
    width: '28px',
    height: '28px',
    border: 'none',
    background: '#f0f0f0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#555',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <button style={buttonStyle} onClick={onIncrement}>+</button>
      <div style={{
        width: width || '40px',
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: '600',
        color: color || '#2c3e50',
        fontFamily: 'Georgia, serif',
      }}>
        {value}
      </div>
      <button style={buttonStyle} onClick={onDecrement}>−</button>
      <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

function YearClock({ simplifiedMode = false, selectedUnits = {}, currentTime, setCurrentTime, hidePalettes = false, clockSize: propClockSize, setClockSize: propSetClockSize, isRunning = true }) {
  const { t, language } = useLanguage();
  const months = t('months');
  const [internalClockSize, setInternalClockSize] = useState(hidePalettes ? 600 : 700);
  const clockSize = propClockSize !== undefined ? propClockSize : internalClockSize;
  const setClockSize = propSetClockSize || setInternalClockSize;
  const [isDragging, setIsDragging] = useState(null);
  const [isDraggingHand, setIsDraggingHand] = useState(null);
  const svgRef = useRef(null);
  const analogClockRef = useRef(null);
  const lastDraggedMonth = useRef(null);

  const [palettePositions, setPalettePositions] = useState({
    size: { x: 20, y: 500 },
    datetime: { x: 20, y: 580 },
    analog: { x: window.innerWidth - 240, y: 100 },
    controls: { x: window.innerWidth - 240, y: 350 },
    legend: { x: window.innerWidth - 240, y: 600 },
  });

  const [paletteZIndexes, setPaletteZIndexes] = useState({
    size: 100,
    datetime: 101,
    analog: 102,
    controls: 103,
    legend: 104,
  });

  const handlePalettePositionChange = useCallback((id, newPosition) => {
    setPalettePositions(prev => ({
      ...prev,
      [id]: newPosition
    }));
  }, []);

  const handlePaletteFocus = useCallback((id) => {
    setPaletteZIndexes(prev => {
      const maxZ = Math.max(...Object.values(prev));
      return {
        ...prev,
        [id]: maxZ + 1
      };
    });
  }, []);

  // Extract time components
  const year = currentTime.getFullYear();
  const month = currentTime.getMonth();
  const day = currentTime.getDate();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const dayOfYear = getDayOfYear(currentTime);
  const leapYear = isLeapYear(year);
  const daysInYear = leapYear ? 366 : 365;
  const daysInCurrentMonth = getDaysInMonth(month, year);
  const isLeapDay = month === 1 && day === 29;

  // Time strings based on language
  const timeStr = language === 'no'
    ? `klokka ${hours} og ${minutes}`
    : `${hours}:${String(minutes).padStart(2, '0')}`;
  const dateStr = language === 'no'
    ? `${day}. ${months[month].toLowerCase()} ${year}`
    : `${months[month]} ${day}, ${year}`;

  // Initialize TTS voices on mount
  useEffect(() => {
    initVoices();
  }, []);

  // Adjustment functions
  const adjustYear = (delta) => {
    const newDate = new Date(currentTime);
    newDate.setFullYear(newDate.getFullYear() + delta);
    setCurrentTime(newDate);
  };

  const adjustMonth = (delta) => {
    const newDate = new Date(currentTime);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentTime(newDate);
  };

  const adjustDay = (delta) => {
    const newDate = new Date(currentTime);
    newDate.setDate(newDate.getDate() + delta);
    setCurrentTime(newDate);
  };

  const adjustHour = (delta) => {
    const newDate = new Date(currentTime);
    newDate.setHours(newDate.getHours() + delta);
    setCurrentTime(newDate);
  };

  const adjustMinute = (delta) => {
    const newDate = new Date(currentTime);
    newDate.setMinutes(newDate.getMinutes() + delta);
    setCurrentTime(newDate);
  };

  const adjustSecond = (delta) => {
    const newDate = new Date(currentTime);
    newDate.setSeconds(newDate.getSeconds() + delta);
    setCurrentTime(newDate);
  };

  const setToNow = () => {
    setCurrentTime(new Date());
  };

  // Ring configuration - alle tilgjengelige ringer
  const allRings = [
    { name: 'months', count: 12, value: month, color: COLORS.months, label: t('clock.monthsLabel') },
    { name: 'days', count: daysInCurrentMonth, value: day - 1, color: COLORS.days, label: `${t('clock.daysLabel')} (${daysInCurrentMonth})` },
    { name: 'hours', count: 24, value: hours, color: COLORS.hours, label: t('clock.hoursLabel') },
    { name: 'minutes', count: 60, value: minutes, color: COLORS.minutes, label: t('clock.minutesLabel') },
    { name: 'seconds', count: 60, value: seconds, color: COLORS.seconds, label: t('clock.secondsLabel') },
  ];

  // Filtrer ringer basert på modus
  const activeRings = simplifiedMode
    ? allRings.filter(ring => selectedUnits[ring.name])
    : allRings;

  // Beregn dynamisk radius basert på antall aktive ringer
  const ringConfig = activeRings.map((ring, index) => ({
    ...ring,
    radius: 80 + index * 60, // Start ved 80, øk med 60 per ring
  }));

  // Fast viewBox-størrelse for skalering
  const viewBoxSize = 700;
  const cx = viewBoxSize / 2;
  const cy = viewBoxSize / 2;

  // Angle calculations for analog clock
  const hourAngle = (hours % 12 + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  // Ring drag handlers
  const handleMouseDown = (ringName, e) => {
    e.preventDefault();
    setIsDragging(ringName);
    if (ringName === 'months') {
      lastDraggedMonth.current = currentTime.getMonth();
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - cx;
    const y = e.clientY - rect.top - cy;
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    const ring = ringConfig.find(r => r.name === isDragging);
    if (!ring) return;

    const newValue = Math.floor((angle / 360) * ring.count);
    const newDate = new Date(currentTime);

    switch (isDragging) {
      case 'months':
        // Håndter år-overgang ved dragging over desember/januar-grensen
        const prevMonth = lastDraggedMonth.current;
        if (prevMonth !== null) {
          // Sjekk om vi krysser desember/januar-grensen
          if (prevMonth >= 10 && newValue <= 2) {
            // Drar fra desember-området til januar-området -> øk året
            newDate.setFullYear(newDate.getFullYear() + 1);
          } else if (prevMonth <= 2 && newValue >= 10) {
            // Drar fra januar-området til desember-området -> reduser året
            newDate.setFullYear(newDate.getFullYear() - 1);
          }
        }
        newDate.setMonth(newValue);
        lastDraggedMonth.current = newValue;
        break;
      case 'days':
        newDate.setDate(newValue + 1);
        break;
      case 'hours':
        newDate.setHours(newValue);
        break;
      case 'minutes':
        newDate.setMinutes(newValue);
        break;
      case 'seconds':
        newDate.setSeconds(newValue);
        break;
    }

    setCurrentTime(newDate);
  }, [isDragging, ringConfig, currentTime, cx, cy]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
    lastDraggedMonth.current = null;
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Analog clock hand drag handlers
  const startHandDrag = (hand, e) => {
    e.preventDefault();
    setIsDraggingHand(hand);
  };

  const handleHandMove = useCallback((e) => {
    if (!isDraggingHand || !analogClockRef.current) return;

    const rect = analogClockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - centerX;
    const y = clientY - centerY;

    let angle = Math.atan2(x, -y) * (180 / Math.PI);
    if (angle < 0) angle += 360;

    const newDate = new Date(currentTime);

    switch (isDraggingHand) {
      case 'hour':
        const newHour = Math.floor(angle / 30) % 12;
        const isPM = hours >= 12;
        newDate.setHours(isPM ? newHour + 12 : newHour);
        break;
      case 'minute':
        newDate.setMinutes(Math.floor(angle / 6));
        break;
      case 'second':
        newDate.setSeconds(Math.floor(angle / 6));
        break;
    }

    setCurrentTime(newDate);
  }, [isDraggingHand, currentTime, hours]);

  const handleHandUp = useCallback(() => {
    setIsDraggingHand(null);
  }, []);

  useEffect(() => {
    if (isDraggingHand) {
      window.addEventListener('mousemove', handleHandMove);
      window.addEventListener('mouseup', handleHandUp);
      window.addEventListener('touchmove', handleHandMove);
      window.addEventListener('touchend', handleHandUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleHandMove);
      window.removeEventListener('mouseup', handleHandUp);
      window.removeEventListener('touchmove', handleHandMove);
      window.removeEventListener('touchend', handleHandUp);
    };
  }, [isDraggingHand, handleHandMove, handleHandUp]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      boxSizing: 'border-box',
    }}>
      <div style={{ position: 'relative' }}>
        <svg
          ref={svgRef}
          width={clockSize}
          height={clockSize}
          viewBox="0 0 700 700"
          style={{ cursor: isDragging ? 'grabbing' : 'default' }}
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="leapGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background circle */}
          <circle cx={cx} cy={cy} r={cx - 10} fill="#f8f9fa" stroke="#e0e0e0" strokeWidth="2"/>

          {/* Rings */}
          {ringConfig.map((ring) => {
            const segments = [];
            for (let i = 0; i < ring.count; i++) {
              const startAngle = (i * 360 / ring.count - 90) * (Math.PI / 180);
              const endAngle = ((i + 1) * 360 / ring.count - 90) * (Math.PI / 180);
              const innerRadius = ring.radius - 20;
              const outerRadius = ring.radius;

              const x1 = cx + outerRadius * Math.cos(startAngle);
              const y1 = cy + outerRadius * Math.sin(startAngle);
              const x2 = cx + outerRadius * Math.cos(endAngle);
              const y2 = cy + outerRadius * Math.sin(endAngle);
              const x3 = cx + innerRadius * Math.cos(endAngle);
              const y3 = cy + innerRadius * Math.sin(endAngle);
              const x4 = cx + innerRadius * Math.cos(startAngle);
              const y4 = cy + innerRadius * Math.sin(startAngle);

              const largeArcFlag = 360 / ring.count > 180 ? 1 : 0;
              const isFilled = i <= ring.value;

              segments.push(
                <path
                  key={`${ring.name}-${i}`}
                  d={`M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`}
                  fill={isFilled ? ring.color : '#e8e8e8'}
                  stroke="#fff"
                  strokeWidth="1"
                  style={{
                    cursor: 'grab',
                    opacity: isFilled ? 1 : 0.4,
                    transition: 'fill 0.1s, opacity 0.1s',
                  }}
                  filter={isFilled && i === ring.value ? 'url(#glow)' : undefined}
                  onMouseDown={(e) => handleMouseDown(ring.name, e)}
                />
              );
            }
            return <g key={ring.name}>{segments}</g>;
          })}

          {/* Leap day marker - only in leap years and non-simplified mode */}
          {leapYear && !simplifiedMode && (
            <>
              {(() => {
                // Calculate position for Feb 29 marker
                // February is month index 1, day 29
                const febStartAngle = (1 * 30 - 90) * (Math.PI / 180); // February starts at 30 degrees
                const dayAngle = 30 / 29; // Angle per day in February (29 days in leap year)
                const leapDayAngle = (1 * 30 + 28 * dayAngle - 90) * (Math.PI / 180); // Position for day 29

                const daysRing = ringConfig.find(r => r.name === 'days');
                if (!daysRing) return null;

                const markerRadius = daysRing.radius + 5;
                const markerX1 = cx + (markerRadius - 10) * Math.cos(leapDayAngle);
                const markerY1 = cy + (markerRadius - 10) * Math.sin(leapDayAngle);
                const markerX2 = cx + (markerRadius + 15) * Math.cos(leapDayAngle);
                const markerY2 = cy + (markerRadius + 15) * Math.sin(leapDayAngle);

                const textRadius = markerRadius + 30;
                const textX = cx + textRadius * Math.cos(leapDayAngle);
                const textY = cy + textRadius * Math.sin(leapDayAngle);
                const rotation = leapDayAngle * (180 / Math.PI) + 90;
                const flipText = rotation > 90 && rotation < 270;

                return (
                  <g>
                    <line
                      x1={markerX1}
                      y1={markerY1}
                      x2={markerX2}
                      y2={markerY2}
                      stroke={leapDayColor}
                      strokeWidth="3"
                      filter="url(#leapGlow)"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill={leapDayColor}
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${flipText ? rotation + 180 : rotation}, ${textX}, ${textY})`}
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {t('clock.leapDay')}
                    </text>
                  </g>
                );
              })()}
            </>
          )}

          {/* Month labels - vis i normal modus, eller i enkel modus når måneder/år er valgt */}
          {(!simplifiedMode || selectedUnits.months || selectedUnits.year) && months.map((m, i) => {
            const centerAngle = ((i + 0.5) * 30 - 90) * (Math.PI / 180);
            const labelRadius = 330;
            const x = cx + labelRadius * Math.cos(centerAngle);
            const y = cy + labelRadius * Math.sin(centerAngle);
            const rotationDeg = (i + 0.5) * 30;
            const flipText = rotationDeg > 90 && rotationDeg < 270;
            return (
              <text
                key={m}
                x={x}
                y={y}
                fill={i === month ? '#d35400' : '#7f8c8d'}
                fontSize="16"
                textAnchor="middle"
                dominantBaseline="middle"
                fontWeight={i === month ? 'bold' : 'normal'}
                transform={`rotate(${flipText ? rotationDeg + 180 : rotationDeg}, ${x}, ${y})`}
                style={{ fontFamily: 'Georgia, serif', cursor: 'pointer' }}
                className="month-label"
                onClick={() => speak(m, language)}
              >
                {m}
              </text>
            );
          })}

          {/* Labels for alle ringer - plassert over hver ring */}
          {ringConfig.map((ring) => {
            const label = t(`clock.ringLabels.${ring.name}`);
            if (!label || label === `clock.ringLabels.${ring.name}`) return null;
            
            // Plasser etiketten over ringen (kl. 12)
            const angle = -90 * (Math.PI / 180); // Rett opp (kl. 12)
            const labelRadius = ring.radius + 12; // Litt utenfor ringen
            const labelX = cx + labelRadius * Math.cos(angle);
            const labelY = cy + labelRadius * Math.sin(angle);
            
            return (
              <text
                key={`label-${ring.name}`}
                x={labelX}
                y={labelY}
                fill={ring.color}
                fontSize="13"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="auto"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {label}
              </text>
            );
          })}

        </svg>
      </div>

      {/* Time and date display below the clock */}
      <div style={{
        textAlign: 'center',
        marginTop: '16px',
        fontFamily: 'Georgia, serif',
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '28px', lineHeight: 1.2 }}>
          {simplifiedMode ? (
            <>
              {selectedUnits.hours && (
                <span style={{ color: COLORS.hours }}>{String(hours).padStart(2, '0')}</span>
              )}
              {selectedUnits.hours && selectedUnits.minutes && (
                <span style={{ color: '#7f8c8d' }}>:</span>
              )}
              {selectedUnits.minutes && (
                <span style={{ color: COLORS.minutes }}>{String(minutes).padStart(2, '0')}</span>
              )}
              {(selectedUnits.hours || selectedUnits.minutes) && selectedUnits.seconds && (
                <span style={{ color: '#7f8c8d' }}>:</span>
              )}
              {selectedUnits.seconds && (
                <span style={{ color: COLORS.seconds }}>{String(seconds).padStart(2, '0')}</span>
              )}
            </>
          ) : (
            <>
              <span style={{ color: COLORS.hours }}>{String(hours).padStart(2, '0')}</span>
              <span style={{ color: '#7f8c8d' }}>:</span>
              <span style={{ color: COLORS.minutes }}>{String(minutes).padStart(2, '0')}</span>
              <span style={{ color: '#7f8c8d' }}>:</span>
              <span style={{ color: COLORS.seconds }}>{String(seconds).padStart(2, '0')}</span>
            </>
          )}
        </div>
        {(simplifiedMode ? (selectedUnits.year || selectedUnits.months || selectedUnits.days) : true) && (
          <div style={{ fontSize: '16px', marginTop: '4px' }}>
            {simplifiedMode ? (
              <>
                {selectedUnits.days && (
                  <span style={{ color: COLORS.days, fontWeight: '600' }}>{day}.</span>
                )}
                {selectedUnits.days && selectedUnits.months && ' '}
                {selectedUnits.months && (
                  <span style={{ color: COLORS.months, fontWeight: '600' }}>{months[month].toLowerCase()}</span>
                )}
                {(selectedUnits.days || selectedUnits.months) && selectedUnits.year && ' '}
                {selectedUnits.year && (
                  <span style={{ color: COLORS.year, fontWeight: '600' }}>{year}</span>
                )}
              </>
            ) : (
              <>
                <span style={{ color: COLORS.year, fontWeight: '600' }}>{year}</span>
                <span style={{ color: '#7f8c8d' }}>-</span>
                <span style={{ color: COLORS.months, fontWeight: '600' }}>{String(month + 1).padStart(2, '0')}</span>
                <span style={{ color: '#7f8c8d' }}>-</span>
                <span style={{ color: COLORS.days, fontWeight: '600' }}>{String(day).padStart(2, '0')}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Draggable Palettes - hidden when sidebar is used */}
      {!hidePalettes && (
      <>
      <Palette
        id="size"
        title={t('clock.size')}
        position={palettePositions.size}
        onPositionChange={handlePalettePositionChange}
        zIndex={paletteZIndexes.size}
        onFocus={handlePaletteFocus}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="range"
            min="400"
            max="1000"
            value={clockSize}
            onChange={(e) => setClockSize(Number(e.target.value))}
            style={{ width: '120px' }}
          />
          <span style={{ fontSize: '13px', color: '#2c3e50', fontWeight: '500' }}>{clockSize}px</span>
        </div>
      </Palette>

      <Palette
        id="datetime"
        title={t('clock.dateTime')}
        position={palettePositions.datetime}
        onPositionChange={handlePalettePositionChange}
        zIndex={paletteZIndexes.datetime}
        onFocus={handlePaletteFocus}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', marginBottom: '6px' }}>
              <span style={{ color: COLORS.year, fontWeight: '600' }}>{year}</span>
              <span style={{ color: '#7f8c8d' }}>-</span>
              <span style={{ color: COLORS.months, fontWeight: '600' }}>{String(month + 1).padStart(2, '0')}</span>
              <span style={{ color: '#7f8c8d' }}>-</span>
              <span style={{ color: COLORS.days, fontWeight: '600' }}>{String(day).padStart(2, '0')}</span>
              <span style={{ color: '#7f8c8d' }}> – </span>
              <span style={{ color: COLORS.days }}>{day}.</span>
              <span style={{ color: '#7f8c8d' }}> </span>
              <span style={{ color: COLORS.months }}>{months[month].toLowerCase()}</span>
              <span style={{ color: '#7f8c8d' }}> </span>
              <span style={{ color: COLORS.year }}>{year}</span>
            </div>
            <div style={{ fontSize: '18px' }}>
              <span style={{ color: COLORS.hours, fontWeight: '600' }}>{String(hours).padStart(2, '0')}</span>
              <span style={{ color: '#7f8c8d' }}>:</span>
              <span style={{ color: COLORS.minutes, fontWeight: '600' }}>{String(minutes).padStart(2, '0')}</span>
              <span style={{ color: '#7f8c8d' }}> – {timeStr}</span>
            </div>
            {isLeapDay && (
              <div style={{
                marginTop: '10px',
                padding: '8px 12px',
                background: `linear-gradient(135deg, ${leapDayColor} 0%, ${leapDayGlow} 100%)`,
                borderRadius: '8px',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '14px',
              }}>
                🎉 {t('clock.leapDay')}!
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <SpeakButton onClick={() => speak(dateStr, language)}>
              {t('clock.readDate')}
            </SpeakButton>
            <SpeakButton onClick={() => speak(timeStr, language)}>
              {t('clock.readTime')}
            </SpeakButton>
          </div>
        </div>
      </Palette>

      <Palette
        id="analog"
        title={t('clock.analogClock')}
        position={palettePositions.analog}
        onPositionChange={handlePalettePositionChange}
        zIndex={paletteZIndexes.analog}
        onFocus={handlePaletteFocus}
      >
        <svg
          ref={analogClockRef}
          width="200"
          height="200"
          viewBox="0 0 220 220"
          style={{ cursor: isDraggingHand ? 'grabbing' : 'default', display: 'block' }}
        >
          <circle cx="110" cy="110" r="105" fill="#f8f9fa" stroke="#e0e0e0" strokeWidth="2"/>

          {[...Array(12)].map((_, i) => {
            const num = i === 0 ? 12 : i;
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x = 110 + 78 * Math.cos(angle);
            const y = 110 + 78 * Math.sin(angle);
            return (
              <text
                key={i}
                x={x}
                y={y}
                fill="#2c3e50"
                fontSize="18"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {num}
              </text>
            );
          })}

          {[...Array(60)].map((_, i) => {
            if (i % 5 === 0) return null;
            const angle = (i * 6 - 90) * (Math.PI / 180);
            const x1 = 110 + 92 * Math.cos(angle);
            const y1 = 110 + 92 * Math.sin(angle);
            const x2 = 110 + 98 * Math.cos(angle);
            const y2 = 110 + 98 * Math.sin(angle);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ddd" strokeWidth="1"/>
            );
          })}

          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x1 = 110 + 90 * Math.cos(angle);
            const y1 = 110 + 90 * Math.sin(angle);
            const x2 = 110 + 98 * Math.cos(angle);
            const y2 = 110 + 98 * Math.sin(angle);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#aaa" strokeWidth="2"/>
            );
          })}

          <line
            x1="110"
            y1="110"
            x2={110 + 50 * Math.sin(hourAngle * Math.PI / 180)}
            y2={110 - 50 * Math.cos(hourAngle * Math.PI / 180)}
            stroke={COLORS.hours}
            strokeWidth="6"
            strokeLinecap="round"
            className="clock-hand"
            onMouseDown={(e) => startHandDrag('hour', e)}
            onTouchStart={(e) => startHandDrag('hour', e)}
          />

          <line
            x1="110"
            y1="110"
            x2={110 + 70 * Math.sin(minuteAngle * Math.PI / 180)}
            y2={110 - 70 * Math.cos(minuteAngle * Math.PI / 180)}
            stroke={COLORS.minutes}
            strokeWidth="4"
            strokeLinecap="round"
            className="clock-hand"
            onMouseDown={(e) => startHandDrag('minute', e)}
            onTouchStart={(e) => startHandDrag('minute', e)}
          />

          {(!simplifiedMode || selectedUnits.seconds) && (
            <line
              x1="110"
              y1="110"
              x2={110 + 75 * Math.sin(secondAngle * Math.PI / 180)}
              y2={110 - 75 * Math.cos(secondAngle * Math.PI / 180)}
              stroke={COLORS.seconds}
              strokeWidth="2"
              strokeLinecap="round"
              className="clock-hand"
              onMouseDown={(e) => startHandDrag('second', e)}
              onTouchStart={(e) => startHandDrag('second', e)}
            />
          )}

          <circle cx="110" cy="110" r="6" fill="#2c3e50"/>
          <circle cx="110" cy="110" r="3" fill="#fff"/>
        </svg>
      </Palette>

      <Palette
        id="controls"
        title={t('clock.controls')}
        position={palettePositions.controls}
        onPositionChange={handlePalettePositionChange}
        zIndex={paletteZIndexes.controls}
        onFocus={handlePaletteFocus}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Dato-kontroller - vis hvis ikke enkel modus, eller hvis år/måneder/dager er valgt */}
          {(!simplifiedMode || selectedUnits.year || selectedUnits.months || selectedUnits.days) && (
            <div>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('clock.date')}</div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {(!simplifiedMode || selectedUnits.year) && (
                  <Stepper
                    value={year}
                    label={t('clock.year')}
                    width="55px"
                    color={COLORS.year}
                    onIncrement={() => adjustYear(1)}
                    onDecrement={() => adjustYear(-1)}
                  />
                )}
                {(!simplifiedMode || selectedUnits.months) && (
                  <Stepper
                    value={String(month + 1).padStart(2, '0')}
                    label={t('clock.month')}
                    width="35px"
                    color={COLORS.months}
                    onIncrement={() => adjustMonth(1)}
                    onDecrement={() => adjustMonth(-1)}
                  />
                )}
                {(!simplifiedMode || selectedUnits.days) && (
                  <Stepper
                    value={String(day).padStart(2, '0')}
                    label={t('clock.day')}
                    width="35px"
                    color={COLORS.days}
                    onIncrement={() => adjustDay(1)}
                    onDecrement={() => adjustDay(-1)}
                  />
                )}
              </div>
            </div>
          )}

          {/* Tid-kontroller - vis hvis ikke enkel modus, eller hvis timer/minutter/sekunder er valgt */}
          {(!simplifiedMode || selectedUnits.hours || selectedUnits.minutes || selectedUnits.seconds) && (
            <div>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('clock.time')}</div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {(!simplifiedMode || selectedUnits.hours) && (
                  <Stepper
                    value={String(hours).padStart(2, '0')}
                    label={t('clock.hour')}
                    width="35px"
                    color={COLORS.hours}
                    onIncrement={() => adjustHour(1)}
                    onDecrement={() => adjustHour(-1)}
                  />
                )}
                {(!simplifiedMode || selectedUnits.minutes) && (
                  <Stepper
                    value={String(minutes).padStart(2, '0')}
                    label={t('clock.minute')}
                    width="35px"
                    color={COLORS.minutes}
                    onIncrement={() => adjustMinute(1)}
                    onDecrement={() => adjustMinute(-1)}
                  />
                )}
                {(!simplifiedMode || selectedUnits.seconds) && (
                  <Stepper
                    value={String(seconds).padStart(2, '0')}
                    label={t('clock.second')}
                    width="35px"
                    color={COLORS.seconds}
                    onIncrement={() => adjustSecond(1)}
                    onDecrement={() => adjustSecond(-1)}
                  />
                )}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={setToNow}>
              {t('clock.setNow')}
            </button>
            <button
              disabled
              style={{
                minWidth: '90px',
                background: isRunning
                  ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
                  : 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                opacity: 0.6,
                cursor: 'not-allowed'
              }}
            >
              {isRunning ? t('clock.stop') : t('clock.start')}
            </button>
          </div>
        </div>
      </Palette>

      <Palette
        id="legend"
        title={t('clock.legend')}
        position={palettePositions.legend}
        onPositionChange={handlePalettePositionChange}
        zIndex={paletteZIndexes.legend}
        onFocus={handlePaletteFocus}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
          {/* År - vises alltid i full modus, eller når valgt i enkel modus */}
          {(!simplifiedMode || selectedUnits.year) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '3px',
                background: COLORS.year,
                flexShrink: 0,
              }}/>
              <span style={{ color: '#555' }}>
                {t('clock.year')} ({year})
              </span>
            </div>
          )}
          {ringConfig.map(ring => (
            <div key={ring.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '3px',
                background: ring.color,
                flexShrink: 0,
              }}/>
              <span style={{ color: '#555' }}>
                {ring.label}
              </span>
            </div>
          ))}
          {leapYear && !simplifiedMode && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', paddingTop: '8px', borderTop: '1px solid #eee' }}>
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '3px',
                background: leapDayColor,
                flexShrink: 0,
              }}/>
              <span style={{ color: '#555' }}>
                {t('clock.leapDayFeb')}
              </span>
            </div>
          )}
          {!leapYear && !simplifiedMode && (
            <div style={{ marginTop: '4px', paddingTop: '8px', borderTop: '1px solid #eee', color: '#999', fontSize: '12px' }}>
              {year} {t('clock.notLeapYear')}
            </div>
          )}
        </div>
      </Palette>
      </>
      )}
    </div>
  );
}

export default YearClock;
