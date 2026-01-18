// TTS-modul med Google Chirp3-HD (via free-tts) og Web Speech API fallback
// Optimalisert for norsk og engelsk tale

// TTS Provider konfiguration
let useGoogleTTS = true; // Prøv Google først
const GOOGLE_TTS_API = 'https://free-tts.thvroyal.workers.dev/api/text-to-speech';

// Chirp3-HD stemmer
const VOICES = {
  no: { languageCode: 'nb-NO', voiceName: 'Kore' },  // Kvinnelig norsk
  en: { languageCode: 'en-US', voiceName: 'Kore' },  // Kvinnelig engelsk
};

// Cache for native stemmer
let cachedVoices = [];
let norwegianVoice = null;
let englishVoice = null;
let isInitialized = false;

// Audio element for Google TTS
let currentAudio = null;

// Standard TTS-innstillinger
const defaultSettings = {
  rate: 0.9,
  pitch: 1.0,
  volume: 1.0,
};

let userSettings = { ...defaultSettings };

// Prioriterte native stemmer
const norwegianVoicePriority = [
  'Microsoft Iselin Online',
  'Nora',
  'Google norsk',
  'Henrik',
  'Norwegian',
];

const englishVoicePriority = [
  'Microsoft Zira Online',
  'Microsoft David Online',
  'Samantha',
  'Google US English',
  'Daniel',
];

/**
 * Initialiser TTS-systemet
 */
export function initVoices() {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Native Speech synthesis ikke støttet');
      resolve(false);
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
      voice => voice.lang === 'nb-NO' ||
               voice.lang === 'no-NO' ||
               voice.lang === 'nn-NO' ||
               voice.lang.startsWith('nb') ||
               voice.lang.startsWith('no')
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

  const onlineVoice = voices.find(v => !v.localService);
  if (onlineVoice) return onlineVoice;

  return voices[0];
}

/**
 * Snakk med Google Chirp3-HD via free-tts
 */
async function speakWithGoogle(text, lang) {
  try {
    const voiceConfig = VOICES[lang] || VOICES.en;

    const response = await fetch(GOOGLE_TTS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        languageCode: voiceConfig.languageCode,
        voiceName: voiceConfig.voiceName,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (data.audioContent) {
      // Stopp eventuell pågående lyd
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }

      // Spill av base64 audio
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      currentAudio = audio;
      audio.volume = userSettings.volume;
      await audio.play();
      return true;
    }

    throw new Error('No audio content in response');
  } catch (error) {
    console.warn('Google TTS feilet:', error.message);
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
 */
export async function speak(text, lang = 'no', options = {}) {
  if (!text || text.trim().length === 0) {
    return null;
  }

  // Stopp pågående tale
  stopSpeaking();

  // Prøv Google TTS først
  if (useGoogleTTS) {
    const success = await speakWithGoogle(text, lang);
    if (success) {
      options.onStart?.();
      return { provider: 'google' };
    }
    console.log('Faller tilbake til native TTS');
  }

  // Fallback til native
  return speakWithNative(text, lang, options);
}

/**
 * Stopp pågående tale
 */
export function stopSpeaking() {
  // Stopp Google audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  // Stopp native TTS
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
  return useGoogleTTS || norwegianVoice !== null;
}

/**
 * Sjekk om engelsk stemme er tilgjengelig
 */
export function hasEnglishVoice() {
  return useGoogleTTS || englishVoice !== null;
}

/**
 * Hent info om nåværende stemme
 */
export function getCurrentVoiceInfo(lang = 'no') {
  if (useGoogleTTS) {
    const config = VOICES[lang] || VOICES.en;
    return {
      name: `Google Chirp3-HD ${config.voiceName}`,
      lang: config.languageCode,
      provider: 'google',
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
 * Aktiver/deaktiver Google TTS
 */
export function setUseGoogleTTS(enabled) {
  useGoogleTTS = enabled;
  console.log(`Google TTS ${enabled ? 'aktivert' : 'deaktivert'}`);
}

/**
 * Sjekk om Google TTS er aktivert
 */
export function isGoogleTTSEnabled() {
  return useGoogleTTS;
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
