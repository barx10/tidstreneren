import React, { useState } from 'react';
import YearClock from './components/YearClock';
import HelpBox from './components/HelpBox';
import SimplifiedMode from './components/SimplifiedMode';

function App() {
  const [showHelp, setShowHelp] = useState(true);
  const [simplifiedMode, setSimplifiedMode] = useState(false);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Hovedmeny */}
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000,
        display: 'flex',
        gap: '10px',
      }}>
        <button
          onClick={() => setShowHelp(!showHelp)}
          style={{
            padding: '12px 20px',
            background: showHelp 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          }}
        >
          {showHelp ? '✓ Hjelp' : 'Vis hjelp'}
        </button>
        
        <button
          onClick={() => setSimplifiedMode(!simplifiedMode)}
          style={{
            padding: '12px 20px',
            background: simplifiedMode
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          }}
        >
          {simplifiedMode ? '✓ Enkel modus' : 'Enkel modus'}
        </button>
      </div>

      {/* Hjelpeboks */}
      {showHelp && <HelpBox />}

      {/* Forenklet modus info */}
      {simplifiedMode && <SimplifiedMode />}

      {/* Hovedklokke */}
      <YearClock simplifiedMode={simplifiedMode} />
    </div>
  );
}

export default App;