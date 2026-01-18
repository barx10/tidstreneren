import React, { useState } from 'react';
import YearClock from './components/YearClock';
import HelpBox from './components/HelpBox';
import SimplifiedMode from './components/SimplifiedMode';
import PracticeMode from './components/PracticeMode';
import CountdownTimer from './components/CountdownTimer';
import DailyRoutine from './components/DailyRoutine';

function App() {
  const [showHelp, setShowHelp] = useState(true);
  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showRoutine, setShowRoutine] = useState(false);

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
        maxWidth: '450px',
        justifyContent: 'flex-end',
      }}>
        <button
          onClick={() => setShowHelp(!showHelp)}
          style={buttonStyle(showHelp)}
        >
          {showHelp ? 'Skjul hjelp' : 'Vis hjelp'}
        </button>

        <button
          onClick={() => setSimplifiedMode(!simplifiedMode)}
          style={buttonStyle(simplifiedMode)}
        >
          {simplifiedMode ? 'Full modus' : 'Enkel modus'}
        </button>

        <button
          onClick={() => setShowPractice(true)}
          style={buttonStyle(false)}
        >
          Øvelser
        </button>

        <button
          onClick={() => setShowCountdown(true)}
          style={buttonStyle(false)}
        >
          Nedtelling
        </button>

        <button
          onClick={() => setShowRoutine(true)}
          style={buttonStyle(false)}
        >
          Min dag
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
      <YearClock simplifiedMode={simplifiedMode} selectedUnits={selectedUnits} />

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
    </div>
  );
}

export default App;
