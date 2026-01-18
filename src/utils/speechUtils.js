// TTS-modul med Puter/ElevenLabs og Web Speech API fallback
// for bedre tilgjengelighet i pedagogiske apper

// TTS Provider: 'puter' eller 'native'
let currentProvider = 'puter';
let puterAvailable = null; // null = ikke sjekket ennå

// Cache for native stemmer
let cachedVoices = [];
let norwegianVoice = null;
let englishVoice = null;
let isInitialized = false;

// Standard TTS-innstillinger optimalisert for barn
const defaultSettings = {
  rate: 0.85,      // Litt langsommere for bedre forståelse
  pitch: 1.0,      // Normal tonehøyde
  volume: 1.0,     // Full volum
};

let userSettings = { ...defaultSettings };

// ElevenLabs stemme-IDer (naturlige stemmer)
// Bruker multilingual modell som støtter norsk og engelsk
const ELEVENLABS_CONFIG = {
  model: 'eleven_multilingual_v2',
  // Rachel - en vennlig, tydelig stemme som fungerer godt for barn
  voiceId: '21m00Tcm4TlvDq8ikWAM',
};

// Prioriterte native stemmer
const norwegianVoicePriority = [
  'Microsoft Iselin Online',
  'Google norsk',
  'Nora',
  'Henrik',
  'Norwegian',
  'norsk',
];

const englishVoicePriority = [
  'Microsoft Zira Online',
  'Microsoft David Online',
  'Google US English',
  'Samantha',
  'Daniel',
  'English',
];

/**
 * Sjekk om Puter.js er tilgjengelig
 */
async function checkPuterAvailability() {
  if (puterAvailable !== null) return puterAvailable;

  try {
    if (typeof puter !== 'undefined' && puter.ai && puter.ai.txt2speech) {
      // Test med en kort tekst
      puterAvailable = true;
      console.log('Puter TTS (ElevenLabs) tilgjengelig');
    } else {
      puterAvailable = false;
      console.log('Puter TTS ikke tilgjengelig, bruker native TTS');
    }
  } catch (e) {
    puterAvailable = false;
    console.log('Puter TTS feilet, bruker native TTS:', e.message);
  }

  return puterAvailable;
}

/**
 * Initialiser TTS-systemet
 */
export async function initVoices() {
  // Sjekk Puter først
  await checkPuterAvailability();

  // Initialiser også native TTS som fallback
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Native Speech synthesis ikke støttet');
      resolve(puterAvailable);
      return;
    }

    const loadVoices = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      norwegianVoice = findBestVoice('no');
      englishVoice = findBestVoice('en');
      isInitialized = true;

      if (norwegianVoice) {
        console.log(`Native norsk stemme: ${norwegianVoice.name}`);
      }
      if (englishVoice) {
        console.log(`Native English voice: ${englishVoice.name}`);
      }

      resolve(true);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      loadVoices();
    } else {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      setTimeout(() => {
        if (!isInitialized) loadVoices();
      }, 1000);
    }
  });
}

/**
 * Finn beste native stemme
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
    voices = cachedVoices.filter(voice => voice.lang.startsWith('en'));
    priority = englishVoicePriority;
  }

  if (voices.length === 0) return null;

  for (const preferredName of priority) {
    const match = voices.find(
      voice => voice.name.toLowerCase().includes(preferredName.toLowerCase())
    );
    if (match) return match;
  }

  const localVoice = voices.find(v => v.localService);
  if (localVoice) return localVoice;

  return voices[0];
}

/**
 * Snakk med Puter/ElevenLabs
 */
async function speakWithPuter(text, lang) {
  try {
    // ElevenLabs multilingual modell håndterer språk automatisk
    // basert på teksten, men vi kan legge til språkmarkør
    const audio = await puter.ai.txt2speech(text, {
      provider: 'elevenlabs',
      voice: ELEVENLABS_CONFIG.voiceId,
      model: ELEVENLABS_CONFIG.model,
    });

    audio.play();
    return true;
  } catch (error) {
    console.error('Puter TTS feilet:', error);
    return false;
  }
}

/**
 * Snakk med native Web Speech API
 */
function speakWithNative(text, lang, options = {}) {
  if (!('speechSynthesis' in window)) {
    return null;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'no' ? 'nb-NO' : 'en-US';
  utterance.rate = options.rate ?? userSettings.rate;
  utterance.pitch = options.pitch ?? userSettings.pitch;
  utterance.volume = options.volume ?? userSettings.volume;

  const voice = lang === 'no' ? norwegianVoice : englishVoice;
  if (voice) {
    utterance.voice = voice;
  }

  utterance.onstart = () => options.onStart?.();
  utterance.onend = () => options.onEnd?.();
  utterance.onerror = (event) => {
    console.error('Native TTS feil:', event.error);
    options.onError?.(event.error);
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

/**
 * Hovedfunksjon for å snakke tekst
 * Prøver Puter først, faller tilbake til native
 */
export async function speak(text, lang = 'no', options = {}) {
  if (!text || text.trim().length === 0) {
    return null;
  }

  // Stopp eventuell pågående native tale
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  // Prøv Puter/ElevenLabs først
  if (puterAvailable === null) {
    await checkPuterAvailability();
  }

  if (puterAvailable && currentProvider === 'puter') {
    const success = await speakWithPuter(text, lang);
    if (success) {
      options.onStart?.();
      // Note: Puter audio har egen onended, men vi kaller onEnd etter en stund
      return { provider: 'puter' };
    }
    // Fallback til native hvis Puter feilet
    console.log('Faller tilbake til native TTS');
  }

  // Bruk native TTS
  return speakWithNative(text, lang, options);
}

/**
 * Stopp pågående tale
 */
export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  // Note: Puter audio må stoppes manuelt hvis lagret referanse
}

/**
 * Sjekk om TTS er tilgjengelig
 */
export function isTTSAvailable() {
  return puterAvailable || 'speechSynthesis' in window;
}

/**
 * Sjekk om norsk stemme er tilgjengelig
 */
export function hasNorwegianVoice() {
  return puterAvailable || norwegianVoice !== null;
}

/**
 * Sjekk om engelsk stemme er tilgjengelig
 */
export function hasEnglishVoice() {
  return puterAvailable || englishVoice !== null;
}

/**
 * Hent info om nåværende stemme/provider
 */
export function getCurrentVoiceInfo(lang = 'no') {
  if (puterAvailable && currentProvider === 'puter') {
    return {
      name: 'ElevenLabs (via Puter)',
      provider: 'puter',
      model: ELEVENLABS_CONFIG.model,
    };
  }

  const voice = lang === 'no' ? norwegianVoice : englishVoice;
  if (!voice) return null;
  return {
    name: voice.name,
    lang: voice.lang,
    localService: voice.localService,
    provider: 'native',
  };
}

/**
 * Bytt TTS provider
 */
export function setProvider(provider) {
  if (provider === 'puter' || provider === 'native') {
    currentProvider = provider;
    console.log(`TTS provider byttet til: ${provider}`);
  }
}

/**
 * Hent nåværende provider
 */
export function getProvider() {
  return currentProvider;
}

/**
 * Oppdater TTS-innstillinger (for native)
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
