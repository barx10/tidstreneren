import React, { useState } from 'react';

const MONTHS_NO = [
  'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
];

const DAYS_SHORT = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

function Calendar({ onClose, currentDate, onDateSelect }) {
  const [viewDate, setViewDate] = useState(new Date(currentDate));
  const [selectedDay, setSelectedDay] = useState(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  // Få første dag i måneden
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  // Juster slik at mandag er første dag (0 = søndag -> 6, 1 = mandag -> 0)
  let startDayOfWeek = firstDay.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;

  // Få ukenummer for første dag i måneden
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setViewDate(new Date(currentDate));
  };

  const handleDateClick = (day) => {
    const newDate = new Date(year, month, day, currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
    setSelectedDay(day);
    onDateSelect(newDate);
  };

  // Generer alle dager i kalenderen
  const calendarDays = [];
  
  // Tomme celler før månedens start
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Alle dager i måneden
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

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
        padding: '24px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        position: 'relative',
      }}>
        {/* Header med lukkeknapp */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <h2 style={{
            margin: 0,
            color: '#2c3e50',
            fontSize: '24px',
            fontWeight: '700',
          }}>
            Kalender
          </h2>
          <button
            onClick={onClose}
            style={{
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
        </div>

        {/* Måned/år navigering */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '12px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          color: 'white',
        }}>
          <button
            onClick={handlePrevMonth}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              width: '36px',
              height: '36px',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            ‹
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: '600' }}>
              {MONTHS_NO[month]} {year}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '4px' }}>
              Uke {getWeekNumber(firstDay)}
            </div>
          </div>
          
          <button
            onClick={handleNextMonth}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              width: '36px',
              height: '36px',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            ›
          </button>
        </div>

        {/* I dag-knapp */}
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <button
            onClick={handleToday}
            style={{
              padding: '8px 16px',
              background: '#f0f0f0',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              color: '#2c3e50',
            }}
          >
            Gå til i dag
          </button>
        </div>

        {/* Ukedager header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          marginBottom: '8px',
        }}>
          {DAYS_SHORT.map((day, i) => (
            <div
              key={day}
              style={{
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '600',
                color: i >= 5 ? '#e74c3c' : '#7f8c8d',
                padding: '8px 4px',
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Kalender grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
        }}>
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} />;
            }

            const dayOfWeek = index % 7;
            const isWeekend = dayOfWeek >= 5;
            const isToday = day === currentDay && month === currentMonth && year === currentYear;
            const date = new Date(year, month, day);
            const weekNum = getWeekNumber(date);

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                style={{
                  padding: '12px 4px',
                  border: isToday ? '2px solid #667eea' : '1px solid #e0e0e0',
                  borderRadius: '8px',
                  background: isToday 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : isWeekend 
                      ? '#fff5f5' 
                      : 'white',
                  color: isToday ? 'white' : isWeekend ? '#e74c3c' : '#2c3e50',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: isToday ? '700' : '500',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isToday) {
                    e.currentTarget.style.background = '#f0f7ff';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isToday) {
                    e.currentTarget.style.background = isWeekend ? '#fff5f5' : 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
                title={`${day}. ${MONTHS_NO[month]} ${year} (uke ${weekNum})`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Info footer */}
        <div style={{
          marginTop: '20px',
          padding: '12px',
          background: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#555',
          textAlign: 'center',
        }}>
          {selectedDay ? (() => {
            const selectedDate = new Date(year, month, selectedDay);
            const today = new Date(currentDate);
            
            // Sett begge datoer til midnatt for korrekt dagtelling
            selectedDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            
            const diffTime = selectedDate - today;
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) {
              return '📅 I dag';
            } else if (diffDays === 1) {
              return '📅 I morgen (1 dag til)';
            } else if (diffDays === -1) {
              return '📅 I går (1 dag siden)';
            } else if (diffDays > 0) {
              return `📅 ${diffDays} dager til`;
            } else {
              return `📅 ${Math.abs(diffDays)} dager siden`;
            }
          })() : '💡 Klikk på en dato for å hoppe til den dagen på klokka'}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
