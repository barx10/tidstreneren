import React, { useState } from 'react';
import YearClock from './components/YearClock';
import HelpBox from './components/HelpBox';
import SimplifiedMode from './components/SimplifiedMode';
import PracticeMode from './components/PracticeMode';
import CountdownTimer from './components/CountdownTimer';
import DailyRoutine from './components/DailyRoutine';
import LanguageToggle from './components/LanguageToggle';
import { useLanguage } from './context/LanguageContext';
import AboutModal from './components/AboutModal';
import Calendar from './components/Calendar';

function App() {
  const { t } = useLanguage();
  const [showHelp, setShowHelp] = useState(true);
  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showRoutine, setShowRoutine] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Valgte enheter for enkel modus
  const [selectedUnits, setSelectedUnits] = useState({
    year: false,
    months: false,
    days: false,
    hours: true,
    minutes: true,
    seconds: false,
  });

  const buttonStyle = (active) => ({
    padding: '12px 16px',
    background: active
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    whiteSpace: 'nowrap',
  });

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Hovedmeny */}
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000,
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        maxWidth: '500px',
        justifyContent: 'flex-end',
      }}>
        <LanguageToggle />

        <button
          onClick={() => setShowHelp(!showHelp)}
          style={buttonStyle(showHelp)}
        >
          {showHelp ? t('nav.hideHelp') : t('nav.showHelp')}
        </button>

        <button
          onClick={() => setSimplifiedMode(!simplifiedMode)}
          style={buttonStyle(simplifiedMode)}
        >
          {simplifiedMode ? t('nav.fullMode') : t('nav.simplifiedMode')}
        </button>

        <button
          onClick={() => setShowPractice(true)}
          style={buttonStyle(false)}
        >
          {t('nav.exercises')}
        </button>

        <button
          onClick={() => setShowCountdown(true)}
          style={buttonStyle(false)}
        >
          {t('nav.countdown')}
        </button>

        <button
          onClick={() => setShowRoutine(true)}
          style={buttonStyle(false)}
        >
          {t('nav.myDay')}
        </button>

        <button
          onClick={() => setShowCalendar(true)}
          style={buttonStyle(false)}
        >
          {t('nav.calendar')}
        </button>

        <button
          onClick={() => setShowAbout(true)}
          style={buttonStyle(false)}
        >
          {t('nav.about')}
        </button>
      </div>

      {/* Hjelpeboks */}
      {showHelp && <HelpBox />}

      {/* Forenklet modus info med enhetsvalg */}
      {simplifiedMode && (
        <SimplifiedMode
          selectedUnits={selectedUnits}
          setSelectedUnits={setSelectedUnits}
        />
      )}

      {/* Hovedklokke */}
      <YearClock 
        simplifiedMode={simplifiedMode} 
        selectedUnits={selectedUnits}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
      />

      {/* Modaler */}
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
