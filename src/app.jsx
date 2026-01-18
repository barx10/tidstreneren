import React, { useState, useEffect } from 'react';
import YearClock from './components/YearClock';
import HelpBox from './components/HelpBox';
import SimplifiedMode from './components/SimplifiedMode';
import PracticeMode from './components/PracticeMode';
import CountdownTimer from './components/CountdownTimer';
import DailyRoutine from './components/DailyRoutine';
import LanguageToggle from './components/LanguageToggle';
import Sidebar from './components/Sidebar';
import { useLanguage } from './context/LanguageContext';
import AboutModal from './components/AboutModal';
import Calendar from './components/Calendar';

function App() {
  const { t } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showRoutine, setShowRoutine] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRunning, setIsRunning] = useState(true);

  // Time update effect
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Valgte enheter for enkel modus
  const [selectedUnits, setSelectedUnits] = useState({
    year: false,
    months: false,
    days: false,
    hours: true,
    minutes: true,
    seconds: false,
  });

  const menuButtonStyle = {
    padding: '10px 14px',
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    textAlign: 'left',
    color: '#333',
  };

  const closeMenu = () => setShowMenu(false);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#fafbfc',
    }}>
      {/* Main Content Area */}
      <div style={{
        flex: 1,
        marginRight: '280px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: '280px',
          height: '60px',
          background: 'white',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 1001,
        }}>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#2c3e50',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '24px' }}>🕐</span>
            Tidstreneren
          </h1>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <LanguageToggle />

            {/* Menu Button */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  padding: '8px 16px',
                  background: showMenu
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: showMenu ? 'white' : '#333',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ fontSize: '18px' }}>☰</span>
                Meny
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  padding: '8px',
                  minWidth: '200px',
                  zIndex: 1000,
                }}>
                  <button
                    onClick={() => { setShowHelp(true); closeMenu(); }}
                    style={menuButtonStyle}
                  >
                    <span>❓</span> {t('nav.showHelp')}
                  </button>
                  <button
                    onClick={() => { setSimplifiedMode(!simplifiedMode); closeMenu(); }}
                    style={{ ...menuButtonStyle, marginTop: '4px' }}
                  >
                    <span>🎯</span> {simplifiedMode ? t('nav.fullMode') : t('nav.simplifiedMode')}
                  </button>
                  <div style={{ height: '1px', background: '#eee', margin: '8px 0' }} />
                  <button
                    onClick={() => { setShowPractice(true); closeMenu(); }}
                    style={{ ...menuButtonStyle }}
                  >
                    <span>📝</span> {t('nav.exercises')}
                  </button>
                  <button
                    onClick={() => { setShowCountdown(true); closeMenu(); }}
                    style={{ ...menuButtonStyle, marginTop: '4px' }}
                  >
                    <span>⏳</span> {t('nav.countdown')}
                  </button>
                  <button
                    onClick={() => { setShowRoutine(true); closeMenu(); }}
                    style={{ ...menuButtonStyle, marginTop: '4px' }}
                  >
                    <span>📅</span> {t('nav.myDay')}
                  </button>
                  <button
                    onClick={() => { setShowCalendar(true); closeMenu(); }}
                    style={{ ...menuButtonStyle, marginTop: '4px' }}
                  >
                    <span>🗓️</span> {t('nav.calendar')}
                  </button>
                  <div style={{ height: '1px', background: '#eee', margin: '8px 0' }} />
                  <button
                    onClick={() => { setShowAbout(true); closeMenu(); }}
                    style={{ ...menuButtonStyle }}
                  >
                    <span>ℹ️</span> {t('nav.about')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Clock Area */}
        <main style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '60px',
        }}>
          <YearClock
            simplifiedMode={simplifiedMode}
            selectedUnits={selectedUnits}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            hidePalettes={true}
          />
        </main>
      </div>

      {/* Fixed Sidebar */}
      <Sidebar
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        simplifiedMode={simplifiedMode}
        selectedUnits={selectedUnits}
      />

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 500,
          }}
          onClick={closeMenu}
        />
      )}

      {/* Modals */}
      {showHelp && (
        <div 
          onClick={() => setShowHelp(false)}
          style={{
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
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '16px',
              maxWidth: '800px',
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowHelp(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255,255,255,0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontSize: '18px',
                zIndex: 1010,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              ×
            </button>
            <HelpBox />
          </div>
        </div>
      )}

      {/* SimplifiedMode panel - vises når enkel modus er aktivert */}
      {simplifiedMode && (
        <SimplifiedMode
          selectedUnits={selectedUnits}
          setSelectedUnits={setSelectedUnits}
        />
      )}

      {showPractice && (
        <PracticeMode onClose={() => setShowPractice(false)} />
      )}

      {showCountdown && (
        <CountdownTimer onClose={() => setShowCountdown(false)} />
      )}

      {showRoutine && (
        <DailyRoutine onClose={() => setShowRoutine(false)} />
      )}

      {showAbout && (
        <AboutModal onClose={() => setShowAbout(false)} />
      )}

      {showCalendar && (
        <Calendar
          onClose={() => setShowCalendar(false)}
          currentDate={currentTime}
          onDateSelect={setCurrentTime}
        />
      )}
    </div>
  );
}

export default App;
