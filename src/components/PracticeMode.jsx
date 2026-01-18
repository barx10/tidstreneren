import React, { useState, useEffect, useCallback } from 'react';
import { speak, initVoices } from '../utils/speechUtils';
import { useLanguage } from '../context/LanguageContext';

const COLORS = {
  hours: '#2980b9',
  minutes: '#8e44ad',
};

// Genererer tilfeldig tid
function generateRandomTime(difficulty = 'easy') {
  let hours, minutes;

  if (difficulty === 'easy') {
    // Enkle tider: hele timer og halve timer
    hours = Math.floor(Math.random() * 12) + 1;
    minutes = Math.random() > 0.5 ? 0 : 30;
  } else if (difficulty === 'medium') {
    // Medium: kvarter
    hours = Math.floor(Math.random() * 12) + 1;
    minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
  } else {
    // Vanskelig: alle 5-minutters intervaller
    hours = Math.floor(Math.random() * 12) + 1;
    minutes = Math.floor(Math.random() * 12) * 5;
  }

  return { hours, minutes };
}

// Formaterer tid til tekst basert på språk
function timeToText(hours, minutes, language, t) {
  if (language === 'no') {
    if (minutes === 0) {
      return `klokka ${hours}`;
    } else if (minutes === 15) {
      return `kvart over ${hours}`;
    } else if (minutes === 30) {
      const nextHour = hours === 12 ? 1 : hours + 1;
      return `halv ${nextHour}`;
    } else if (minutes === 45) {
      const nextHour = hours === 12 ? 1 : hours + 1;
      return `kvart på ${nextHour}`;
    } else if (minutes < 30) {
      return `${minutes} over ${hours}`;
    } else {
      const nextHour = hours === 12 ? 1 : hours + 1;
      return `${60 - minutes} på ${nextHour}`;
    }
  } else {
    // English
    if (minutes === 0) {
      return `${hours} o'clock`;
    } else if (minutes === 15) {
      return `quarter past ${hours}`;
    } else if (minutes === 30) {
      return `half past ${hours}`;
    } else if (minutes === 45) {
      const nextHour = hours === 12 ? 1 : hours + 1;
      return `quarter to ${nextHour}`;
    } else if (minutes < 30) {
      return `${minutes} past ${hours}`;
    } else {
      const nextHour = hours === 12 ? 1 : hours + 1;
      return `${60 - minutes} to ${nextHour}`;
    }
  }
}

// Formaterer tid digitalt
function timeToDigital(hours, minutes) {
  return `${hours}:${String(minutes).padStart(2, '0')}`;
}

// Genererer feil svaralternativer
function generateWrongAnswers(correctHours, correctMinutes, count = 3) {
  const answers = [];
  const usedTimes = new Set([`${correctHours}:${correctMinutes}`]);

  while (answers.length < count) {
    let h = correctHours + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1);
    let m = correctMinutes;

    // Varier også minuttene noen ganger
    if (Math.random() > 0.5) {
      m = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    }

    // Hold timene innenfor 1-12
    if (h < 1) h = 12;
    if (h > 12) h = h - 12;

    const key = `${h}:${m}`;
    if (!usedTimes.has(key)) {
      usedTimes.add(key);
      answers.push({ hours: h, minutes: m });
    }
  }

  return answers;
}

function AnalogClockDisplay({ hours, minutes, size = 160 }) {
  const hourAngle = (hours % 12 + minutes / 60) * 30;
  const minuteAngle = minutes * 6;
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

      {/* Senter */}
      <circle cx={center} cy={center} r="5" fill="#2c3e50"/>
    </svg>
  );
}

function PracticeMode({ onClose }) {
  const { t, language } = useLanguage();
  const [difficulty, setDifficulty] = useState('easy');
  const [questionType, setQuestionType] = useState('read'); // 'read' eller 'set'
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  // For "still klokka"-modus
  const [userHours, setUserHours] = useState(12);
  const [userMinutes, setUserMinutes] = useState(0);

  const generateNewQuestion = useCallback(() => {
    const time = generateRandomTime(difficulty);
    setCurrentQuestion(time);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);

    if (questionType === 'read') {
      // Generer svaralternativer
      const wrong = generateWrongAnswers(time.hours, time.minutes);
      const allAnswers = [time, ...wrong].sort(() => Math.random() - 0.5);
      setAnswers(allAnswers);
    } else {
      // For "still klokka"-modus, reset brukerens klokke
      setUserHours(12);
      setUserMinutes(0);
    }
  }, [difficulty, questionType]);

  useEffect(() => {
    generateNewQuestion();
  }, [generateNewQuestion]);

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    const correct = answer.hours === currentQuestion.hours && answer.minutes === currentQuestion.minutes;
    setIsCorrect(correct);
    setShowFeedback(true);
    setTotalQuestions(prev => prev + 1);

    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleSetClockSubmit = () => {
    if (showFeedback) return;

    const correct = userHours === currentQuestion.hours && userMinutes === currentQuestion.minutes;
    setIsCorrect(correct);
    setShowFeedback(true);
    setTotalQuestions(prev => prev + 1);

    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  // Initialize TTS voices on mount
  useEffect(() => {
    initVoices();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>{t('practice.title')}</h2>
          <button
            onClick={onClose}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            X
          </button>
        </div>

        {/* Score */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          padding: '15px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '20px',
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>{t('practice.yourScore')}</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
            {score} / {totalQuestions}
          </div>
          {totalQuestions > 0 && (
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              {Math.round((score / totalQuestions) * 100)}% {t('practice.correct')}
            </div>
          )}
        </div>

        {/* Innstillinger */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: '140px' }}>
            <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>
              {t('practice.difficulty')}
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '2px solid #e0e0e0',
                fontSize: '14px',
              }}
            >
              <option value="easy">{t('practice.easy')}</option>
              <option value="medium">{t('practice.medium')}</option>
              <option value="hard">{t('practice.hard')}</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '140px' }}>
            <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>
              {t('practice.questionType')}
            </label>
            <select
              value={questionType}
              onChange={(e) => {
                setQuestionType(e.target.value);
                setScore(0);
                setTotalQuestions(0);
              }}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '2px solid #e0e0e0',
                fontSize: '14px',
              }}
            >
              <option value="read">{t('practice.readClock')}</option>
              <option value="set">{t('practice.setClock')}</option>
            </select>
          </div>
        </div>

        {/* Spørsmål */}
        {currentQuestion && (
          <div>
            {questionType === 'read' ? (
              // Les klokka-modus
              <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <p style={{ fontSize: '16px', color: '#555', marginBottom: '15px' }}>
                    {t('practice.whatTime')}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <AnalogClockDisplay
                      hours={currentQuestion.hours}
                      minutes={currentQuestion.minutes}
                      size={180}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {answers.map((answer, index) => {
                    const isSelected = selectedAnswer === answer;
                    const isCorrectAnswer = answer.hours === currentQuestion.hours && answer.minutes === currentQuestion.minutes;

                    let buttonStyle = {
                      padding: '15px',
                      borderRadius: '12px',
                      border: '3px solid #e0e0e0',
                      background: 'white',
                      cursor: showFeedback ? 'default' : 'pointer',
                      fontSize: '15px',
                      fontWeight: '500',
                      transition: 'all 0.2s',
                    };

                    if (showFeedback) {
                      if (isCorrectAnswer) {
                        buttonStyle.background = '#d4edda';
                        buttonStyle.borderColor = '#28a745';
                        buttonStyle.color = '#155724';
                      } else if (isSelected && !isCorrectAnswer) {
                        buttonStyle.background = '#f8d7da';
                        buttonStyle.borderColor = '#dc3545';
                        buttonStyle.color = '#721c24';
                      }
                    } else if (isSelected) {
                      buttonStyle.borderColor = '#667eea';
                      buttonStyle.background = '#f0f0ff';
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(answer)}
                        style={buttonStyle}
                      >
                        <div style={{ fontSize: '18px', marginBottom: '4px' }}>
                          {timeToDigital(answer.hours, answer.minutes)}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          {timeToText(answer.hours, answer.minutes, language, t)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Still klokka-modus
              <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <p style={{ fontSize: '16px', color: '#555', marginBottom: '10px' }}>
                    {t('practice.setClockTo')}
                  </p>
                  <div style={{
                    background: '#f0f0f0',
                    borderRadius: '12px',
                    padding: '15px',
                    display: 'inline-block',
                  }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50' }}>
                      {timeToDigital(currentQuestion.hours, currentQuestion.minutes)}
                    </div>
                    <div style={{ fontSize: '16px', color: '#666', marginTop: '5px' }}>
                      {timeToText(currentQuestion.hours, currentQuestion.minutes, language, t)}
                    </div>
                    <button
                      onClick={() => speak(timeToText(currentQuestion.hours, currentQuestion.minutes, language, t), language)}
                      style={{
                        marginTop: '10px',
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '13px',
                      }}
                    >
                      {t('practice.hearTime')}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                  <AnalogClockDisplay
                    hours={userHours}
                    minutes={userMinutes}
                    size={180}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>
                      {t('practice.hours')}
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => setUserHours(h => h <= 1 ? 12 : h - 1)}
                        disabled={showFeedback}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          border: 'none',
                          background: COLORS.hours,
                          color: 'white',
                          cursor: showFeedback ? 'default' : 'pointer',
                          fontSize: '20px',
                          opacity: showFeedback ? 0.5 : 1,
                        }}
                      >
                        -
                      </button>
                      <span style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: COLORS.hours,
                        minWidth: '40px',
                        textAlign: 'center',
                      }}>
                        {userHours}
                      </span>
                      <button
                        onClick={() => setUserHours(h => h >= 12 ? 1 : h + 1)}
                        disabled={showFeedback}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          border: 'none',
                          background: COLORS.hours,
                          color: 'white',
                          cursor: showFeedback ? 'default' : 'pointer',
                          fontSize: '20px',
                          opacity: showFeedback ? 0.5 : 1,
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>
                      {t('practice.minutes')}
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => setUserMinutes(m => m <= 0 ? 55 : m - 5)}
                        disabled={showFeedback}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          border: 'none',
                          background: COLORS.minutes,
                          color: 'white',
                          cursor: showFeedback ? 'default' : 'pointer',
                          fontSize: '20px',
                          opacity: showFeedback ? 0.5 : 1,
                        }}
                      >
                        -
                      </button>
                      <span style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: COLORS.minutes,
                        minWidth: '40px',
                        textAlign: 'center',
                      }}>
                        {String(userMinutes).padStart(2, '0')}
                      </span>
                      <button
                        onClick={() => setUserMinutes(m => m >= 55 ? 0 : m + 5)}
                        disabled={showFeedback}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          border: 'none',
                          background: COLORS.minutes,
                          color: 'white',
                          cursor: showFeedback ? 'default' : 'pointer',
                          fontSize: '20px',
                          opacity: showFeedback ? 0.5 : 1,
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {!showFeedback && (
                  <button
                    onClick={handleSetClockSubmit}
                    style={{
                      width: '100%',
                      padding: '15px',
                      background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    {t('practice.checkAnswer')}
                  </button>
                )}
              </div>
            )}

            {/* Feedback */}
            {showFeedback && (
              <div style={{
                marginTop: '20px',
                padding: '20px',
                borderRadius: '12px',
                background: isCorrect ? '#d4edda' : '#f8d7da',
                border: `2px solid ${isCorrect ? '#28a745' : '#dc3545'}`,
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '10px',
                }}>
                  {isCorrect ? '🎉' : '💪'}
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: isCorrect ? '#155724' : '#721c24',
                  marginBottom: '10px',
                }}>
                  {isCorrect ? t('practice.correctAnswer') : t('practice.almostAnswer')}
                </div>
                {!isCorrect && (
                  <div style={{ fontSize: '14px', color: '#721c24', marginBottom: '10px' }}>
                    {t('practice.correctWas')} <strong>{timeToDigital(currentQuestion.hours, currentQuestion.minutes)}</strong>
                    {' '}({timeToText(currentQuestion.hours, currentQuestion.minutes, language, t)})
                  </div>
                )}
                <button
                  onClick={generateNewQuestion}
                  style={{
                    marginTop: '10px',
                    padding: '12px 30px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  {t('practice.nextQuestion')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Hjelpetekst */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#fff8e1',
          borderRadius: '8px',
          border: '2px solid #ffe082',
        }}>
          <strong style={{ color: '#f57f17', fontSize: '14px' }}>{t('simplified.tip')}</strong>
          <p style={{ fontSize: '13px', color: '#555', margin: '8px 0 0 0' }}>
            {questionType === 'read'
              ? t('practice.tipRead')
              : t('practice.tipSet')
            }
          </p>
        </div>
      </div>
    </div>
  );
}

export default PracticeMode;
