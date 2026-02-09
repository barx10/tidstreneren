import React from 'react';
import { COLORS } from '../constants/colors';

function AnalogClock({ hours, minutes, seconds, size = 160, showSeconds = false }) {
  const hourAngle = (hours % 12 + minutes / 60) * 30;
  const minuteAngle = (minutes + (seconds || 0) / 60) * 6;
  const secondAngle = (seconds || 0) * 6;
  const center = size / 2;
  const radius = size / 2 - 10;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={center} cy={center} r={radius} fill="#f8f9fa" stroke="#e0e0e0" strokeWidth="3"/>

      {/* Tall */}
      {[...Array(12)].map((_, i) => {
        const num = i === 0 ? 12 : i;
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = center + (radius - 20) * Math.cos(angle);
        const y = center + (radius - 20) * Math.sin(angle);
        return (
          <text
            key={i}
            x={x}
            y={y}
            fill="#2c3e50"
            fontSize={size / 10}
            fontWeight="600"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {num}
          </text>
        );
      })}

      {/* Timemarkører */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = center + (radius - 5) * Math.cos(angle);
        const y1 = center + (radius - 5) * Math.sin(angle);
        const x2 = center + radius * Math.cos(angle);
        const y2 = center + radius * Math.sin(angle);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#aaa" strokeWidth="2"/>
        );
      })}

      {/* Timeviser */}
      <line
        x1={center}
        y1={center}
        x2={center + (radius * 0.5) * Math.sin(hourAngle * Math.PI / 180)}
        y2={center - (radius * 0.5) * Math.cos(hourAngle * Math.PI / 180)}
        stroke={COLORS.hours}
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Minuttviser */}
      <line
        x1={center}
        y1={center}
        x2={center + (radius * 0.7) * Math.sin(minuteAngle * Math.PI / 180)}
        y2={center - (radius * 0.7) * Math.cos(minuteAngle * Math.PI / 180)}
        stroke={COLORS.minutes}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Sekundviser */}
      {showSeconds && seconds !== undefined && (
        <line
          x1={center}
          y1={center}
          x2={center + (radius * 0.75) * Math.sin(secondAngle * Math.PI / 180)}
          y2={center - (radius * 0.75) * Math.cos(secondAngle * Math.PI / 180)}
          stroke={COLORS.seconds}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}

      {/* Senter */}
      <circle cx={center} cy={center} r="5" fill="#2c3e50"/>
    </svg>
  );
}

export default AnalogClock;
