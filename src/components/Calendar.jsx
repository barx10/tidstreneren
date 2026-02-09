import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const MONTHS_NO = [
  'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
];

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_SHORT = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

function Calendar({ onClose, currentDate, onDateSelect }) {
  const { t, language } = useLanguage();
  const [viewDate, setViewDate] = useState(new Date(currentDate));
  const [selectedDay, setSelectedDay] = useState(null);
  const [importantDates, setImportantDates] = useState(() => {
    const stored = localStorage.getItem('importantDates');
    return stored ? JSON.parse(stored) : [];
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [eventName, setEventName] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const MONTHS = language === 'no' ? MONTHS_NO : MONTHS_EN;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const realToday = new Date();
  const currentYear = realToday.getFullYear();
  const currentMonth = realToday.getMonth();
  const currentDay = realToday.getDate();

  // Få første dag i måneden
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Juster slik at mandag er første dag
  let startDayOfWeek = firstDay.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;

  // Få ukenummer
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  // Beregn antall dager til en dato
  const daysUntil = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    const diff = target - today;
    return Math.round(diff / (1000 * 60 * 60 * 24));
  };

  // Lagre viktige datoer
  useEffect(() => {
    localStorage.setItem('importantDates', JSON.stringify(importantDates));
  }, [importantDates]);

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setViewDate(new Date(today));
    setSelectedDay(today.getDate());
    onDateSelect(new Date(today.getFullYear(), today.getMonth(), today.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds()));
  };

  const handleDateClick = (day) => {
    const newDate = new Date(year, month, day, currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
    setSelectedDay(day);
    onDateSelect(newDate);
  };

  const handleAddImportantDate = () => {
    if (!selectedDate || !eventName.trim()) {
      alert(language === 'no' ? 'Vennligst fyll inn begge felt' : 'Please fill in both fields');
      return;
    }

    const newDate = {
      id: Date.now(),
      date: selectedDate,
      event: eventName,
    };

    setImportantDates([...importantDates, newDate]);
    setEventName('');
    setSelectedDate(null);
    setShowAddForm(false);
  };

  const handleRemoveImportantDate = (id) => {
    setImportantDates(importantDates.filter(d => d.id !== id));
  };

  const getImportantDateForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return importantDates.find(d => d.date === dateStr);
  };

  // Generer alle dager i kalenderen
  const calendarDays = [];

  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }

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
      overflowY: 'auto',
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
        {/* Header */}
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
            {t('nav.calendar')}
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

        {/* Month navigation */}
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
              {MONTHS[month]} {year}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '4px' }}>
              {language === 'no' ? 'Uke' : 'Week'} {getWeekNumber(firstDay)}
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

        {/* Today button */}
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
            {language === 'no' ? 'Gå til i dag' : 'Go to today'}
          </button>
        </div>

        {/* Calendar grid header */}
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

        {/* Calendar grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          marginBottom: '20px',
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
            const importantDate = getImportantDateForDay(day);

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                style={{
                  padding: '8px 2px',
                  border: isToday ? '2px solid #667eea' : '1px solid #e0e0e0',
                  borderRadius: '8px',
                  background: importantDate
                    ? 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)'
                    : isToday
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : isWeekend
                      ? '#fff5f5'
                      : 'white',
                  color: importantDate ? 'white' : isToday ? 'white' : isWeekend ? '#e74c3c' : '#2c3e50',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: isToday ? '700' : '500',
                  transition: 'all 0.2s',
                  position: 'relative',
                  minHeight: '45px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  if (!isToday && !importantDate) {
                    e.currentTarget.style.background = '#f0f7ff';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isToday && !importantDate) {
                    e.currentTarget.style.background = isWeekend ? '#fff5f5' : 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
                title={`${day}. ${MONTHS[month]} ${year} (uke ${weekNum})`}
              >
                <div>{day}</div>
                {importantDate && (
                  <div style={{ fontSize: '8px', marginTop: '2px', opacity: 0.9 }}>
                    🎂
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Important dates section */}
        <div style={{
          marginBottom: '20px',
          padding: '12px',
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: '600',
              color: '#2c3e50',
            }}>
              {t('calendarCountdown.editTitle')}
            </h3>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEventName('');
                setSelectedDate(null);
              }}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              {showAddForm ? t('calendarCountdown.cancel') : t('calendarCountdown.addDate')}
            </button>
          </div>

          {/* Add form */}
          {showAddForm && (
            <div style={{
              marginBottom: '12px',
              padding: '12px',
              background: 'white',
              borderRadius: '8px',
              border: '2px solid #667eea',
            }}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  color: '#555',
                  marginBottom: '4px',
                  fontWeight: '500',
                }}>
                  {t('calendarCountdown.whatEvent')}
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder={t('calendarCountdown.eventPlaceholder')}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  color: '#555',
                  marginBottom: '4px',
                  fontWeight: '500',
                }}>
                  {language === 'no' ? 'Velg dato' : 'Choose date'}
                </label>
                <input
                  type="date"
                  value={selectedDate || ''}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <button
                onClick={handleAddImportantDate}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                }}
              >
                {t('calendarCountdown.save')}
              </button>
            </div>
          )}

          {/* Important dates list */}
          {importantDates.length === 0 ? (
            <div style={{
              fontSize: '12px',
              color: '#888',
              textAlign: 'center',
              padding: '12px',
            }}>
              {t('calendarCountdown.noImportantDates')}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {importantDates.map((item) => {
                const days = daysUntil(item.date);
                const dateObj = new Date(item.date);
                const dateStr = `${dateObj.getDate()}. ${MONTHS[dateObj.getMonth()]}`;

                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px',
                      background: 'white',
                      borderRadius: '6px',
                      border: '1px solid #e0e0e0',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#2c3e50',
                      }}>
                        {item.event}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#666',
                        marginTop: '2px',
                      }}>
                        {dateStr} • {days === 0
                          ? t('calendarCountdown.today')
                          : days === 1
                          ? `1 ${t('calendarCountdown.dayCountdown')}`
                          : `${days} ${t('calendarCountdown.daysCountdown')}`}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveImportantDate(item.id)}
                      style={{
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        marginLeft: '8px',
                      }}
                    >
                      {t('routine.delete')}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info footer */}
        <div style={{
          padding: '12px',
          background: '#e3f2fd',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#555',
          textAlign: 'center',
          border: '2px solid #90caf9',
        }}>
          {selectedDay ? (() => {
            const selectedDateObj = new Date(year, month, selectedDay);
            const today = new Date();

            selectedDateObj.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            const diffTime = selectedDateObj - today;
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
              return '📅 ' + (language === 'no' ? 'I dag' : 'Today');
            } else if (diffDays === 1) {
              return language === 'no' ? '📅 I morgen (1 dag til)' : '📅 Tomorrow (1 day)';
            } else if (diffDays === -1) {
              return language === 'no' ? '📅 I går (1 dag siden)' : '📅 Yesterday (1 day ago)';
            } else if (diffDays > 0) {
              return `📅 ${diffDays} ${language === 'no' ? 'dager til' : 'days'}`;
            } else {
              return `📅 ${Math.abs(diffDays)} ${language === 'no' ? 'dager siden' : 'days ago'}`;
            }
          })() : language === 'no'
            ? '💡 Klikk på en dato for å hoppe til den dagen på klokka'
            : '💡 Click on a date to jump to that day on the clock'}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
