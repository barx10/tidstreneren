// Forbedret TTS-modul med støtte for norsk og engelsk
// for bedre tilgjengelighet i pedagogiske apper

// Cache for stemmer
let cachedVoices = [];
let norwegianVoice = null;
let englishVoice = null;
let isInitialized = false;

// Standard TTS-innstillinger optimalisert for barn med autisme
const defaultSettings = {
  rate: 0.85,      // Litt langsommere for bedre forståelse
  pitch: 1.0,      // Normal tonehøyde
  volume: 1.0,     // Full volum
};

// Brukerinnstillinger (kan overstyres)
let userSettings = { ...defaultSettings };

// Prioritert liste over norske stemmer (beste først)
const norwegianVoicePriority = [
  'Microsoft Iselin Online',
  'Google norsk',
  'Nora',
  'Henrik',
  'Microsoft Iselin',
  'Iselin',
  'Nora (Enhanced)',
  'Henrik (Enhanced)',
  'Norwegian',
  'norsk',
];

// Prioritert liste over engelske stemmer
const englishVoicePriority = [
  'Microsoft Zira Online',
  'Microsoft David Online',
  'Google US English',
  'Samantha',
  'Daniel',
  'Karen',
  'English',
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
      norwegianVoice = findBestVoice('no');
      englishVoice = findBestVoice('en');
      isInitialized = true;

      if (norwegianVoice) {
        console.log(`Norsk stemme funnet: ${norwegianVoice.name} (${norwegianVoice.lang})`);
      }
      if (englishVoice) {
        console.log(`English voice found: ${englishVoice.name} (${englishVoice.lang})`);
      }

      resolve(true);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      loadVoices();
    } else {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      setTimeout(() => {
        if (!isInitialized) {
          loadVoices();
        }
      }, 1000);
    }
  });
}

/**
 * Finn den beste tilgjengelige stemmen for et språk
 * @param {string} lang - 'no' eller 'en'
 * @returns {SpeechSynthesisVoice|null}
 */
function findBestVoice(lang) {
  if (cachedVoices.length === 0) return null;

  let voices;
  let priority;

  if (lang === 'no') {
    voices = cachedVoices.filter(
      voice => voice.lang.startsWith('nb') ||
               voice.lang.startsWith('no') ||
               voice.lang === 'nn-NO'
    );
    priority = norwegianVoicePriority;
  } else {
    voices = cachedVoices.filter(
      voice => voice.lang.startsWith('en')
    );
    priority = englishVoicePriority;
  }

  if (voices.length === 0) return null;

  // Sorter etter prioritet
  for (const preferredName of priority) {
    const match = voices.find(
      voice => voice.name.toLowerCase().includes(preferredName.toLowerCase())
    );
    if (match) return match;
  }

  // Foretrekk lokale stemmer
  const localVoice = voices.find(v => v.localService);
  if (localVoice) return localVoice;

  return voices[0];
}

/**
 * Snakk ut tekst
 * @param {string} text - Teksten som skal leses opp
 * @param {string} lang - Språk ('no' eller 'en')
 * @param {Object} options - Valgfrie innstillinger
 * @returns {SpeechSynthesisUtterance|null}
 */
export function speak(text, lang = 'no', options = {}) {
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

  // Sett språk
  utterance.lang = lang === 'no' ? 'nb-NO' : 'en-US';
  utterance.rate = options.rate ?? userSettings.rate;
  utterance.pitch = options.pitch ?? userSettings.pitch;
  utterance.volume = options.volume ?? userSettings.volume;

  // Bruk cached stemme
  const voice = lang === 'no' ? norwegianVoice : englishVoice;
  if (voice) {
    utterance.voice = voice;
  } else {
    // Fallback
    const voices = window.speechSynthesis.getVoices();
    const fallbackVoice = voices.find(
      v => lang === 'no'
        ? (v.lang.startsWith('nb') || v.lang.startsWith('no'))
        : v.lang.startsWith('en')
    );
    if (fallbackVoice) {
      utterance.voice = fallbackVoice;
    }
  }

  // Event handlers
  utterance.onstart = () => options.onStart?.();
  utterance.onend = () => options.onEnd?.();
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
 * Sjekk om engelsk stemme er tilgjengelig
 * @returns {boolean}
 */
export function hasEnglishVoice() {
  return englishVoice !== null;
}

/**
 * Hent info om nåværende stemme
 * @param {string} lang - 'no' eller 'en'
 * @returns {Object|null}
 */
export function getCurrentVoiceInfo(lang = 'no') {
  const voice = lang === 'no' ? norwegianVoice : englishVoice;
  if (!voice) return null;
  return {
    name: voice.name,
    lang: voice.lang,
    localService: voice.localService,
  };
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
 * Snakk klokkeslett
 * @param {number} hours - Timer (0-23)
 * @param {number} minutes - Minutter (0-59)
 * @param {string} lang - Språk ('no' eller 'en')
 */
export function speakTime(hours, minutes, lang = 'no') {
  let text;

  if (lang === 'no') {
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
  } else {
    if (minutes === 0) {
      text = `${hours} o'clock`;
    } else if (minutes === 30) {
      text = `half past ${hours}`;
    } else if (minutes === 15) {
      text = `quarter past ${hours}`;
    } else if (minutes === 45) {
      text = `quarter to ${hours + 1 > 12 ? hours + 1 - 12 : hours + 1}`;
    } else {
      text = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    }
  }

  speak(text, lang);
}

/**
 * Snakk dato
 * @param {Date} date - Datoen som skal leses
 * @param {string} lang - Språk ('no' eller 'en')
 */
export function speakDate(date, lang = 'no') {
  let text;

  if (lang === 'no') {
    const days = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
    const months = [
      'januar', 'februar', 'mars', 'april', 'mai', 'juni',
      'juli', 'august', 'september', 'oktober', 'november', 'desember'
    ];
    text = `${days[date.getDay()]} ${date.getDate()}. ${months[date.getMonth()]}`;
  } else {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    text = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  }

  speak(text, lang);
}
