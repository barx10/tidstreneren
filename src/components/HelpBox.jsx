import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { COLORS } from '../constants/colors';

function HelpBox() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('howTo');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { id: 'howTo', label: t('help.tabs.howTo') },
    { id: 'timeUnits', label: t('help.tabs.timeUnits') },
    { id: 'connections', label: t('help.tabs.connections') },
    { id: 'stories', label: t('help.tabs.stories') },
    { id: 'concepts', label: t('help.tabs.concepts') },
    { id: 'tips', label: t('help.tabs.tips') },
  ];

  return (
    <div style={{
      position: 'fixed',
      left: 20,
      top: 20,
      width: '360px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      zIndex: 999,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '16px 20px',
        color: 'white',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderRadius: isCollapsed ? '16px' : '16px 16px 0 0',
      }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
            {t('help.title')}
          </h2>
          {!isCollapsed && (
            <p style={{ fontSize: '12px', margin: '4px 0 0 0', opacity: 0.9 }}>
              {t('help.subtitle')}
            </p>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            flexShrink: 0,
            marginLeft: '12px',
          }}
          title={isCollapsed ? t('help.expand') : t('help.minimize')}
        >
          {isCollapsed ? '+' : '−'}
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            borderBottom: '2px solid #f0f0f0',
            background: '#fafafa',
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: '1 1 auto',
                  minWidth: '60px',
                  padding: '10px 6px',
                  border: 'none',
                  background: activeTab === tab.id ? 'white' : 'transparent',
                  color: activeTab === tab.id ? '#667eea' : '#7f8c8d',
                  fontSize: '10px',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.id ? '2px solid #667eea' : 'none',
                  marginBottom: activeTab === tab.id ? '-2px' : '0',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{
            padding: '20px',
            maxHeight: '450px',
            overflowY: 'auto',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#2c3e50',
          }}>
        {activeTab === 'howTo' && (
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#667eea' }}>
              {t('help.howTo.title')}
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <strong>{t('help.howTo.dragRings')}</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                {t('help.howTo.dragRingsDesc')}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>{t('help.howTo.dragHands')}</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                {t('help.howTo.dragHandsDesc')}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>{t('help.howTo.listen')}</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                {t('help.howTo.listenDesc')}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>{t('help.howTo.stopStart')}</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                {t('help.howTo.stopStartDesc')}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'timeUnits' && (
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#667eea' }}>
              {t('help.timeUnits.title')}
            </h3>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: COLORS.seconds }} />
                <strong>{t('help.timeUnits.seconds')}</strong>
              </div>
              <p style={{ marginLeft: '30px', color: '#555', fontSize: '13px' }}>
                {t('help.timeUnits.secondsDesc')}
              </p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: COLORS.minutes }} />
                <strong>{t('help.timeUnits.minutes')}</strong>
              </div>
              <p style={{ marginLeft: '30px', color: '#555', fontSize: '13px' }}>
                {t('help.timeUnits.minutesDesc')}
              </p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: COLORS.hours }} />
                <strong>{t('help.timeUnits.hours')}</strong>
              </div>
              <p style={{ marginLeft: '30px', color: '#555', fontSize: '13px' }}>
                {t('help.timeUnits.hoursDesc')}
              </p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: COLORS.days }} />
                <strong>{t('help.timeUnits.days')}</strong>
              </div>
              <p style={{ marginLeft: '30px', color: '#555', fontSize: '13px' }}>
                {t('help.timeUnits.daysDesc')}
              </p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: COLORS.months }} />
                <strong>{t('help.timeUnits.months')}</strong>
              </div>
              <p style={{ marginLeft: '30px', color: '#555', fontSize: '13px' }}>
                {t('help.timeUnits.monthsDesc')}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'connections' && (
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#667eea' }}>
              {t('help.connections.title')}
            </h3>

            <div style={{
              background: '#f8f9fa',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '12px',
              border: '2px solid #e9ecef'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: COLORS.seconds }}>{t('help.connections.secondsToMinute')}</strong>
                <span style={{ margin: '0 8px' }}>=</span>
                <strong style={{ color: COLORS.minutes }}>{t('help.connections.oneMinute')}</strong>
              </div>
              <p style={{ fontSize: '12px', color: '#555', marginLeft: '10px' }}>
                {t('help.connections.secondsToMinuteDesc')}
              </p>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '12px',
              border: '2px solid #e9ecef'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: COLORS.minutes }}>{t('help.connections.minutesToHour')}</strong>
                <span style={{ margin: '0 8px' }}>=</span>
                <strong style={{ color: COLORS.hours }}>{t('help.connections.oneHour')}</strong>
              </div>
              <p style={{ fontSize: '12px', color: '#555', marginLeft: '10px' }}>
                {t('help.connections.minutesToHourDesc')}
              </p>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '12px',
              border: '2px solid #e9ecef'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: COLORS.hours }}>{t('help.connections.hoursToDay')}</strong>
                <span style={{ margin: '0 8px' }}>=</span>
                <strong style={{ color: COLORS.days }}>{t('help.connections.oneDay')}</strong>
              </div>
              <p style={{ fontSize: '12px', color: '#555', marginLeft: '10px' }}>
                {t('help.connections.hoursToDayDesc')}
              </p>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '16px',
              borderRadius: '8px',
              border: '2px solid #e9ecef'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: COLORS.days }}>{t('help.connections.daysToMonth')}</strong>
                <span style={{ margin: '0 8px' }}>=</span>
                <strong style={{ color: COLORS.months }}>{t('help.connections.oneMonth')}</strong>
              </div>
              <p style={{ fontSize: '12px', color: '#555', marginLeft: '10px' }}>
                {t('help.connections.daysToMonthDesc')}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'stories' && (
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#667eea' }}>
              {t('help.stories.title')}
            </h3>

            <p style={{ marginBottom: '16px', color: '#555', fontStyle: 'italic' }}>
              {t('help.stories.intro')}
            </p>

            <div style={{
              background: '#e3f2fd',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '16px',
              border: '2px solid #90caf9'
            }}>
              <h4 style={{ color: '#1565c0', marginBottom: '10px', fontSize: '14px' }}>
                {t('help.stories.emilTitle')}
              </h4>
              <p style={{ fontSize: '13px', color: '#333', lineHeight: '1.7' }}
                 dangerouslySetInnerHTML={{ __html: t('help.stories.emilStory') }}
              />
            </div>

            <div style={{
              background: '#fff3e0',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '16px',
              border: '2px solid #ffcc80'
            }}>
              <h4 style={{ color: '#e65100', marginBottom: '10px', fontSize: '14px' }}>
                {t('help.stories.sofieTitle')}
              </h4>
              <p style={{ fontSize: '13px', color: '#333', lineHeight: '1.7' }}
                 dangerouslySetInnerHTML={{ __html: t('help.stories.sofieStory') }}
              />
            </div>

            <div style={{
              background: '#e8f5e9',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '16px',
              border: '2px solid #a5d6a7'
            }}>
              <h4 style={{ color: '#2e7d32', marginBottom: '10px', fontSize: '14px' }}>
                {t('help.stories.karlTitle')}
              </h4>
              <p style={{ fontSize: '13px', color: '#333', lineHeight: '1.7' }}
                 dangerouslySetInnerHTML={{ __html: t('help.stories.karlStory') }}
              />
            </div>

            <div style={{
              background: '#fce4ec',
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid #f8bbd9'
            }}>
              <h4 style={{ color: '#c2185b', marginBottom: '10px', fontSize: '14px' }}>
                {t('help.stories.winterTitle')}
              </h4>
              <p style={{ fontSize: '13px', color: '#333', lineHeight: '1.7' }}
                 dangerouslySetInnerHTML={{ __html: t('help.stories.winterStory') }}
              />
            </div>
          </div>
        )}

        {activeTab === 'concepts' && (
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#667eea' }}>
              {t('help.concepts.title')}
            </h3>

            <p style={{ marginBottom: '16px', color: '#555', fontStyle: 'italic' }}>
              {t('help.concepts.intro')}
            </p>

            <div style={{
              background: '#f8f9fa',
              padding: '14px',
              borderRadius: '8px',
              marginBottom: '12px',
              borderLeft: '4px solid #667eea'
            }}>
              <strong style={{ color: '#333' }}>{t('help.concepts.now')}</strong>
              <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>
                {t('help.concepts.nowDesc')}
              </p>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '8px', background: '#fff', padding: '8px', borderRadius: '4px' }}>
                {t('help.concepts.nowExample')}
              </div>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '14px',
              borderRadius: '8px',
              marginBottom: '12px',
              borderLeft: '4px solid #27ae60'
            }}>
              <strong style={{ color: '#333' }}>{t('help.concepts.soon')}</strong>
              <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}
                 dangerouslySetInnerHTML={{ __html: t('help.concepts.soonDesc') }}
              />
              <div style={{ fontSize: '12px', color: '#888', marginTop: '8px', background: '#fff', padding: '8px', borderRadius: '4px' }}>
                {t('help.concepts.soonExample')}
              </div>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '14px',
              borderRadius: '8px',
              marginBottom: '12px',
              borderLeft: '4px solid #e67e22'
            }}>
              <strong style={{ color: '#333' }}>{t('help.concepts.later')}</strong>
              <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}
                 dangerouslySetInnerHTML={{ __html: t('help.concepts.laterDesc') }}
              />
              <div style={{ fontSize: '12px', color: '#888', marginTop: '8px', background: '#fff', padding: '8px', borderRadius: '4px' }}>
                {t('help.concepts.laterExample')}
              </div>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '14px',
              borderRadius: '8px',
              marginBottom: '12px',
              borderLeft: '4px solid #2980b9'
            }}>
              <strong style={{ color: '#333' }}>{t('help.concepts.tomorrow')}</strong>
              <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>
                {t('help.concepts.tomorrowDesc')}
              </p>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '8px', background: '#fff', padding: '8px', borderRadius: '4px' }}>
                {t('help.concepts.tomorrowExample')}
              </div>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '14px',
              borderRadius: '8px',
              marginBottom: '12px',
              borderLeft: '4px solid #8e44ad'
            }}>
              <strong style={{ color: '#333' }}>{t('help.concepts.yesterday')}</strong>
              <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>
                {t('help.concepts.yesterdayDesc')}
              </p>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '8px', background: '#fff', padding: '8px', borderRadius: '4px' }}>
                {t('help.concepts.yesterdayExample')}
              </div>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '14px',
              borderRadius: '8px',
              marginBottom: '12px',
              borderLeft: '4px solid #c0392b'
            }}>
              <strong style={{ color: '#333' }}>{t('help.concepts.nextWeek')}</strong>
              <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}
                 dangerouslySetInnerHTML={{ __html: t('help.concepts.nextWeekDesc') }}
              />
              <div style={{ fontSize: '12px', color: '#888', marginTop: '8px', background: '#fff', padding: '8px', borderRadius: '4px' }}>
                {t('help.concepts.nextWeekExample')}
              </div>
            </div>

            <div style={{
              background: '#fff8e1',
              padding: '14px',
              borderRadius: '8px',
              border: '2px solid #ffe082'
            }}>
              <strong style={{ color: '#f57f17' }}>{t('help.concepts.tip')}</strong>
              <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}
                 dangerouslySetInnerHTML={{ __html: t('help.concepts.tipText') }}
              />
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#667eea' }}>
              {t('help.tips.title')}
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <strong>{t('help.tips.startSimple')}</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                {t('help.tips.startSimpleDesc')}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>{t('help.tips.practiceDaily')}</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                {t('help.tips.practiceDailyDesc')}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>{t('help.tips.talkAbout')}</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                {t('help.tips.talkAboutDesc')}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>{t('help.tips.connectToLife')}</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                {t('help.tips.connectToLifeDesc')}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>{t('help.tips.playWithTime')}</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                {t('help.tips.playWithTimeDesc')}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>{t('help.tips.usePractice')}</strong>
              <p style={{ marginTop: '6px', color: '#555' }}>
                {t('help.tips.usePracticeDesc')}
              </p>
            </div>

            <div style={{
              background: '#e8f5e9',
              padding: '12px',
              borderRadius: '8px',
              marginTop: '16px',
              border: '2px solid #c8e6c9'
            }}>
              <strong style={{ color: '#2e7d32' }}>{t('help.tips.important')}</strong>
              <p style={{ marginTop: '6px', fontSize: '13px', color: '#1b5e20' }}>
                {t('help.tips.importantText')}
              </p>
            </div>
            </div>
          )}
          </div>
        </>
      )}
    </div>
  );
}

export default HelpBox;
