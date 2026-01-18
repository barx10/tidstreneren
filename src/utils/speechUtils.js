// TTS-modul med Web Speech API
// Optimalisert for norsk og engelsk tale

// Cache for stemmer
let cachedVoices = [];
let norwegianVoice = null;
let englishVoice = null;
let isInitialized = false;

// Standard TTS-innstillinger optimalisert for barn
const defaultSettings = {
  rate: 0.9,       // Litt langsommere for bedre forståelse
  pitch: 1.0,      // Normal tonehøyde
  volume: 1.0,     // Full volum
};

let userSettings = { ...defaultSettings };

// Prioriterte norske stemmer (beste først)
const norwegianVoicePriority = [
  'Microsoft Iselin Online',  // Windows - god kvalitet
  'Nora',                     // macOS/iOS
  'Google norsk',             // Chrome
  'Henrik',                   // macOS/iOS
  'Norwegian',
];

// Prioriterte engelske stemmer
const englishVoicePriority = [
  'Microsoft Zira Online',    // Windows - kvinnelig
  'Microsoft David Online',   // Windows - mannlig
  'Samantha',                 // macOS/iOS
  'Google US English',        // Chrome
  'Daniel',                   // macOS/iOS UK
  'Karen',                    // macOS/iOS AU
];

/**
 * Initialiser TTS-systemet og last inn stemmer
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
        console.log(`Norsk stemme: ${norwegianVoice.name} (${norwegianVoice.lang})`);
      } else {
        console.warn('Ingen norsk stemme funnet');
      }
      if (englishVoice) {
        console.log(`English voice: ${englishVoice.name} (${englishVoice.lang})`);
      }

      resolve(true);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      loadVoices();
    } else {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      // Timeout som fallback
      setTimeout(() => {
        if (!isInitialized) loadVoices();
      }, 1000);
    }
  });
}

/**
 * Finn den beste tilgjengelige stemmen for et språk
 */
function findBestVoice(lang) {
  if (cachedVoices.length === 0) return null;

  let voices;
  let priority;

  if (lang === 'no') {
    // Filtrer norske stemmer (nb-NO, no-NO, nn-NO)
    voices = cachedVoices.filter(
      voice => voice.lang === 'nb-NO' ||
               voice.lang === 'no-NO' ||
               voice.lang === 'nn-NO' ||
               voice.lang.startsWith('nb') ||
               voice.lang.startsWith('no')
    );
    priority = norwegianVoicePriority;
  } else {
    // Filtrer engelske stemmer
    voices = cachedVoices.filter(voice => voice.lang.startsWith('en'));
    priority = englishVoicePriority;
  }

  if (voices.length === 0) return null;

  // Søk etter prioriterte stemmer først
  for (const preferredName of priority) {
    const match = voices.find(
      voice => voice.name.toLowerCase().includes(preferredName.toLowerCase())
    );
    if (match) return match;
  }

  // Foretrekk online/remote stemmer (ofte bedre kvalitet)
  const onlineVoice = voices.find(v => !v.localService);
  if (onlineVoice) return onlineVoice;

  return voices[0];
}

/**
 * Snakk ut tekst
 */
export function speak(text, lang = 'no', options = {}) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis ikke støttet');
    options.onError?.('TTS ikke støttet');
    return null;
  }

  if (!text || text.trim().length === 0) {
    return null;
  }

  // Stopp eventuell pågående tale
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Sett riktig språk
  if (lang === 'no') {
    utterance.lang = 'nb-NO';
  } else {
    utterance.lang = 'en-US';
  }

  utterance.rate = options.rate ?? userSettings.rate;
  utterance.pitch = options.pitch ?? userSettings.pitch;
  utterance.volume = options.volume ?? userSettings.volume;

  // Bruk cached stemme for riktig språk
  const voice = lang === 'no' ? norwegianVoice : englishVoice;
  if (voice) {
    utterance.voice = voice;
  } else {
    // Fallback: prøv å finne stemme på nytt
    const voices = window.speechSynthesis.getVoices();
    const fallbackVoice = voices.find(v => {
      if (lang === 'no') {
        return v.lang === 'nb-NO' || v.lang === 'no-NO' || v.lang.startsWith('nb');
      }
      return v.lang.startsWith('en');
    });
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
 */
export function isTTSAvailable() {
  return 'speechSynthesis' in window;
}

/**
 * Sjekk om norsk stemme er tilgjengelig
 */
export function hasNorwegianVoice() {
  return norwegianVoice !== null;
}

/**
 * Sjekk om engelsk stemme er tilgjengelig
 */
export function hasEnglishVoice() {
  return englishVoice !== null;
}

/**
 * Hent info om nåværende stemme
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
 */
export function updateSettings(settings) {
  userSettings = { ...userSettings, ...settings };
}

/**
 * Hent nåværende innstillinger
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
