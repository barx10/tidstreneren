import React, { useState, useEffect } from 'react';
import YearClock from './components/YearClock';
import HelpBox from './components/HelpBox';
import SimplifiedMode from './components/SimplifiedMode';
import PracticeMode from './components/PracticeMode';
import CountdownTimer from './components/CountdownTimer';
import DailyRoutine from './components/DailyRoutine';
import LanguageToggle from './components/LanguageToggle';
import Sidebar from './components/Sidebar';
import SplashScreen from './components/SplashScreen';
import Modal from './components/Modal';
import { useLanguage } from './context/LanguageContext';
import AboutModal from './components/AboutModal';
import Calendar from './components/Calendar';

const MOBILE_BREAKPOINT = 768;

function getIsMobile() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function getResponsiveClockSize(isMobile) {
  const sidebarWidth = isMobile ? 0 : 280;
  const w = window.innerWidth - sidebarWidth;
  const h = window.innerHeight - 60; // subtract header height
  const available = Math.min(w, h) - 40; // padding
  const minSize = isMobile ? 260 : 350;
  return Math.max(minSize, Math.min(available, 700));
}

function App() {
  const { t } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRunning, setIsRunning] = useState(true);
  const [isMobile, setIsMobile] = useState(() => getIsMobile());
  const [showSidebar, setShowSidebar] = useState(false);
  const [clockSize, setClockSize] = useState(() => getResponsiveClockSize(getIsMobile()));

  // Recalculate clock size and mobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = getIsMobile();
      setIsMobile(mobile);
      setClockSize(getResponsiveClockSize(mobile));
      if (!mobile) setShowSidebar(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Time update effect - ticks forward from current time (preserves manual adjustments)
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setCurrentTime(prev => new Date(prev.getTime() + 1000));
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
  const closeModal = () => setActiveModal(null);
  const openModal = (modal) => { setActiveModal(modal); closeMenu(); };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#fafbfc',
    }}>
      {/* Splash Screen */}
      {showSplash && <SplashScreen onClose={() => setShowSplash(false)} />}

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        marginRight: isMobile ? 0 : '280px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: isMobile ? 0 : '280px',
          height: '60px',
          background: 'white',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '0 12px' : '0 24px',
          zIndex: 1001,
        }}>
          <h1 style={{
            fontSize: isMobile ? '16px' : '20px',
            fontWeight: '600',
            color: '#2c3e50',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span style={{ fontSize: isMobile ? '20px' : '24px' }}>🕐</span>
            {t('appName')}
          </h1>

          <div style={{ display: 'flex', gap: isMobile ? '6px' : '12px', alignItems: 'center' }}>
            <LanguageToggle />

            {/* Menu Button */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  padding: isMobile ? '6px 10px' : '8px 16px',
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
                {!isMobile && t('nav.menu')}
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
                    onClick={() => openModal('help')}
                    style={menuButtonStyle}
                  >
                    <span>❓</span> {t('nav.showHelp')}
                  </button>
                  <button
                    onClick={() => openModal('simplified')}
                    style={{ ...menuButtonStyle, marginTop: '4px' }}
                  >
                    <span>🎯</span> {t('nav.simplifiedMode')}
                  </button>
                  <div style={{ height: '1px', background: '#eee', margin: '8px 0' }} />
                  <button
                    onClick={() => openModal('practice')}
                    style={{ ...menuButtonStyle }}
                  >
                    <span>📝</span> {t('nav.exercises')}
                  </button>
                  <button
                    onClick={() => openModal('countdown')}
                    style={{ ...menuButtonStyle, marginTop: '4px' }}
                  >
                    <span>⏳</span> {t('nav.countdown')}
                  </button>
                  <button
                    onClick={() => openModal('routine')}
                    style={{ ...menuButtonStyle, marginTop: '4px' }}
                  >
                    <span>📅</span> {t('nav.myDay')}
                  </button>
                  <button
                    onClick={() => openModal('calendar')}
                    style={{ ...menuButtonStyle, marginTop: '4px' }}
                  >
                    <span>🗓️</span> {t('nav.calendar')}
                  </button>
                  <div style={{ height: '1px', background: '#eee', margin: '8px 0' }} />
                  <button
                    onClick={() => openModal('about')}
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '60px',
          position: 'relative',
        }}>
          {/* Zoom Controls */}
          <div style={{
            position: 'absolute',
            top: '80px',
            left: isMobile ? '12px' : '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 10,
          }}>
            <button
              onClick={() => setClockSize(prev => Math.min(prev + 50, 1000))}
              style={{
                width: isMobile ? '34px' : '40px',
                height: isMobile ? '34px' : '40px',
                borderRadius: '50%',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                fontWeight: 'bold',
              }}
              title={t('nav.zoomIn')}
            >
              +
            </button>
            <button
              onClick={() => setClockSize(prev => Math.max(prev - 50, isMobile ? 200 : 400))}
              style={{
                width: isMobile ? '34px' : '40px',
                height: isMobile ? '34px' : '40px',
                borderRadius: '50%',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                fontWeight: 'bold',
              }}
              title={t('nav.zoomOut')}
            >
              −
            </button>
          </div>

          <YearClock
            simplifiedMode={simplifiedMode}
            selectedUnits={selectedUnits}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            hidePalettes={true}
            clockSize={clockSize}
            setClockSize={setClockSize}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
          />
        </main>
      </div>

      {/* Mobile sidebar toggle button */}
      {isMobile && (
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            zIndex: 1100,
          }}
          title={t('clock.controls')}
        >
          {showSidebar ? '✕' : '⚙'}
        </button>
      )}

      {/* Mobile sidebar overlay */}
      {isMobile && showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 1050,
          }}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        simplifiedMode={simplifiedMode}
        selectedUnits={selectedUnits}
        isMobile={isMobile}
        isOpen={showSidebar}
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
      {activeModal === 'help' && (
        <Modal onClose={closeModal} maxWidth="800px">
          <HelpBox />
        </Modal>
      )}

      {activeModal === 'simplified' && (
        <Modal onClose={closeModal} maxWidth="500px">
          <SimplifiedMode
            selectedUnits={selectedUnits}
            setSelectedUnits={setSelectedUnits}
            simplifiedMode={simplifiedMode}
            setSimplifiedMode={setSimplifiedMode}
            onClose={closeModal}
          />
        </Modal>
      )}

      {activeModal === 'practice' && (
        <PracticeMode onClose={closeModal} />
      )}

      {activeModal === 'countdown' && (
        <CountdownTimer onClose={closeModal} />
      )}

      {activeModal === 'routine' && (
        <DailyRoutine onClose={closeModal} />
      )}

      {activeModal === 'about' && (
        <AboutModal onClose={closeModal} />
      )}

      {activeModal === 'calendar' && (
        <Calendar
          onClose={closeModal}
          currentDate={currentTime}
          onDateSelect={setCurrentTime}
        />
      )}
    </div>
  );
}

export default App;
