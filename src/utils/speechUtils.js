// Forbedret TTS-modul med optimalisert norsk stemmehåndtering
// for bedre tilgjengelighet i pedagogiske apper

// Cache for stemmer
let cachedVoices = [];
let norwegianVoice = null;
let isInitialized = false;

// Standard TTS-innstillinger optimalisert for barn med autisme
const defaultSettings = {
  rate: 0.85,      // Litt langsommere for bedre forståelse
  pitch: 1.0,      // Normal tonehøyde
  volume: 1.0,     // Full volum
  lang: 'nb-NO',   // Norsk bokmål
};

// Brukerinnstillinger (kan overstyres)
let userSettings = { ...defaultSettings };

// Prioritert liste over norske stemmer (beste først)
const norwegianVoicePriority = [
  // Premium/Neural stemmer (høyest kvalitet)
  'Microsoft Iselin Online',   // Windows neural
  'Google norsk',              // Google
  'Nora',                      // Apple neural
  'Henrik',                    // Apple neural
  // Standard stemmer
  'Microsoft Iselin',          // Windows standard
  'Iselin',
  'Nora (Enhanced)',
  'Henrik (Enhanced)',
  // Fallback patterns
  'Norwegian',
  'norsk',
];

/**
 * Initialiser TTS-systemet og last inn stemmer
 * @returns {Promise<boolean>} true hvis TTS er tilgjengelig
 */
export function initVoices() {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis ikke støttet i denne nettleseren');
      resolve(false);
      return;
    }

    const loadVoices = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      norwegianVoice = findBestNorwegianVoice();
      isInitialized = true;

      if (norwegianVoice) {
        console.log(`Norsk stemme funnet: ${norwegianVoice.name} (${norwegianVoice.lang})`);
      } else {
        console.warn('Ingen norsk stemme funnet, bruker standard');
      }

      resolve(true);
    };

    // Sjekk om stemmer allerede er lastet
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      loadVoices();
    } else {
      // Vent på at stemmer lastes
      window.speechSynthesis.onvoiceschanged = loadVoices;

      // Timeout fallback (noen nettlesere trenger dette)
      setTimeout(() => {
        if (!isInitialized) {
          loadVoices();
        }
      }, 1000);
    }
  });
}

/**
 * Finn den beste tilgjengelige norske stemmen
 * @returns {SpeechSynthesisVoice|null}
 */
function findBestNorwegianVoice() {
  if (cachedVoices.length === 0) return null;

  // Filtrer ut norske stemmer
  const norwegianVoices = cachedVoices.filter(
    voice => voice.lang.startsWith('nb') ||
             voice.lang.startsWith('no') ||
             voice.lang === 'nn-NO'
  );

  if (norwegianVoices.length === 0) return null;

  // Sorter etter prioritet
  for (const preferredName of norwegianVoicePriority) {
    const match = norwegianVoices.find(
      voice => voice.name.toLowerCase().includes(preferredName.toLowerCase())
    );
    if (match) return match;
  }

  // Foretrekk lokale stemmer over nettverksbaserte (for hastighet)
  const localVoice = norwegianVoices.find(v => v.localService);
  if (localVoice) return localVoice;

  // Returner første tilgjengelige
  return norwegianVoices[0];
}

/**
 * Snakk ut tekst med norsk stemme
 * @param {string} text - Teksten som skal leses opp
 * @param {Object} options - Valgfrie innstillinger
 * @param {Function} options.onStart - Callback når tale starter
 * @param {Function} options.onEnd - Callback når tale er ferdig
 * @param {Function} options.onError - Callback ved feil
 * @returns {SpeechSynthesisUtterance|null}
 */
export function speak(text, options = {}) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis ikke støttet i denne nettleseren');
    options.onError?.('TTS ikke støttet');
    return null;
  }

  if (!text || text.trim().length === 0) {
    return null;
  }

  // Stopp eventuell pågående tale
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Bruk innstillinger
  utterance.lang = userSettings.lang;
  utterance.rate = options.rate ?? userSettings.rate;
  utterance.pitch = options.pitch ?? userSettings.pitch;
  utterance.volume = options.volume ?? userSettings.volume;

  // Bruk cached norsk stemme hvis tilgjengelig
  if (norwegianVoice) {
    utterance.voice = norwegianVoice;
  } else {
    // Fallback: prøv å finne stemme på nytt
    const voices = window.speechSynthesis.getVoices();
    const fallbackVoice = voices.find(
      voice => voice.lang.startsWith('nb') || voice.lang.startsWith('no')
    );
    if (fallbackVoice) {
      utterance.voice = fallbackVoice;
    }
  }

  // Event handlers
  utterance.onstart = () => {
    options.onStart?.();
  };

  utterance.onend = () => {
    options.onEnd?.();
  };

  utterance.onerror = (event) => {
    console.error('TTS feil:', event.error);
    options.onError?.(event.error);
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

/**
 * Stopp pågående tale
 */
export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Sjekk om TTS er tilgjengelig
 * @returns {boolean}
 */
export function isTTSAvailable() {
  return 'speechSynthesis' in window;
}

/**
 * Sjekk om norsk stemme er tilgjengelig
 * @returns {boolean}
 */
export function hasNorwegianVoice() {
  return norwegianVoice !== null;
}

/**
 * Hent info om nåværende stemme
 * @returns {Object|null}
 */
export function getCurrentVoiceInfo() {
  if (!norwegianVoice) return null;
  return {
    name: norwegianVoice.name,
    lang: norwegianVoice.lang,
    localService: norwegianVoice.localService,
  };
}

/**
 * Hent alle tilgjengelige norske stemmer
 * @returns {Array}
 */
export function getAvailableNorwegianVoices() {
  return cachedVoices.filter(
    voice => voice.lang.startsWith('nb') ||
             voice.lang.startsWith('no') ||
             voice.lang === 'nn-NO'
  ).map(voice => ({
    name: voice.name,
    lang: voice.lang,
    localService: voice.localService,
  }));
}

/**
 * Sett hvilken stemme som skal brukes
 * @param {string} voiceName - Navnet på stemmen
 * @returns {boolean} true hvis stemmen ble funnet og satt
 */
export function setVoice(voiceName) {
  const voice = cachedVoices.find(v => v.name === voiceName);
  if (voice) {
    norwegianVoice = voice;
    return true;
  }
  return false;
}

/**
 * Oppdater TTS-innstillinger
 * @param {Object} settings - Nye innstillinger
 */
export function updateSettings(settings) {
  userSettings = { ...userSettings, ...settings };
}

/**
 * Hent nåværende innstillinger
 * @returns {Object}
 */
export function getSettings() {
  return { ...userSettings };
}

/**
 * Tilbakestill til standardinnstillinger
 */
export function resetSettings() {
  userSettings = { ...defaultSettings };
}

/**
 * Snakk tall på norsk (spesialhåndtering)
 * @param {number} number - Tallet som skal leses
 */
export function speakNumber(number) {
  // Norsk talluttale
  const text = number.toString();
  speak(text);
}

/**
 * Snakk klokkeslett på norsk
 * @param {number} hours - Timer (0-23)
 * @param {number} minutes - Minutter (0-59)
 */
export function speakTime(hours, minutes) {
  let text;

  if (minutes === 0) {
    text = `klokken ${hours}`;
  } else if (minutes === 30) {
    text = `halv ${hours + 1 > 12 ? hours + 1 - 12 : hours + 1}`;
  } else if (minutes === 15) {
    text = `kvart over ${hours}`;
  } else if (minutes === 45) {
    text = `kvart på ${hours + 1 > 12 ? hours + 1 - 12 : hours + 1}`;
  } else if (minutes < 30) {
    text = `${minutes} over ${hours}`;
  } else {
    text = `${60 - minutes} på ${hours + 1 > 12 ? hours + 1 - 12 : hours + 1}`;
  }

  speak(text);
}

/**
 * Snakk dato på norsk
 * @param {Date} date - Datoen som skal leses
 */
export function speakDate(date) {
  const days = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
  const months = [
    'januar', 'februar', 'mars', 'april', 'mai', 'juni',
    'juli', 'august', 'september', 'oktober', 'november', 'desember'
  ];

  const dayName = days[date.getDay()];
  const dayNumber = date.getDate();
  const monthName = months[date.getMonth()];

  const text = `${dayName} ${dayNumber}. ${monthName}`;
  speak(text);
}
