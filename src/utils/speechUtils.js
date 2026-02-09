// TTS-modul med Edge TTS (via HuggingFace Space) og Web Speech API fallback
// Optimalisert for norsk og engelsk tale med naturlige Microsoft Neural stemmer
import { timeToText } from './timeUtils';

// Edge TTS via HuggingFace Gradio Space
const EDGE_TTS_SPACE = 'https://innoai-edge-tts-text-to-speech.hf.space';

// Microsoft Neural stemmer (Edge TTS)
const EDGE_VOICES = {
  no: 'nb-NO-PernilleNeural',
  en: 'en-US-JennyNeural',
};

// Google Chirp3-HD fallback
const GOOGLE_TTS_API = 'https://free-tts.thvroyal.workers.dev/api/text-to-speech';
const GOOGLE_VOICES = {
  no: { languageCode: 'nb-NO', voiceName: 'Kore' },
  en: { languageCode: 'en-US', voiceName: 'Kore' },
};

// Cache for native stemmer
let cachedVoices = [];
let norwegianVoice = null;
let englishVoice = null;
let isInitialized = false;

// Audio element for cloud TTS
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
 * Snakk med Edge TTS via HuggingFace Space (Gradio API)
 * Bruker Microsoft Neural stemmer - mye mer naturlig enn Google Chirp3-HD
 */
async function speakWithEdgeTTS(text, lang) {
  try {
    const voice = EDGE_VOICES[lang] || EDGE_VOICES.en;

    // Gradio API: start job
    const joinResponse = await fetch(`${EDGE_TTS_SPACE}/call/tts_interface`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [text, voice, 0, 0],
      }),
    });

    if (!joinResponse.ok) {
      throw new Error(`Edge TTS join feilet: ${joinResponse.status}`);
    }

    const { event_id } = await joinResponse.json();

    // Gradio API: hent resultat via SSE stream
    const resultResponse = await fetch(`${EDGE_TTS_SPACE}/call/tts_interface/${event_id}`);
    if (!resultResponse.ok) {
      throw new Error(`Edge TTS result feilet: ${resultResponse.status}`);
    }

    const resultText = await resultResponse.text();

    // Parse SSE-format: finn "data: " linjen med JSON-resultatet
    const dataLine = resultText.split('\n').find(line => line.startsWith('data: '));
    if (!dataLine) {
      throw new Error('Ingen data i Edge TTS-respons');
    }

    const data = JSON.parse(dataLine.slice(6));
    // data er [audioFileData, warningText] - audioFileData har url-felt
    const audioData = data[0];
    if (!audioData || !audioData.url) {
      throw new Error('Ingen audio-URL i respons');
    }

    // Stopp eventuell pågående lyd
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    const audio = new Audio(audioData.url);
    currentAudio = audio;
    audio.volume = userSettings.volume;
    await audio.play();
    return true;
  } catch (error) {
    console.warn('Edge TTS feilet:', error.message);
    return false;
  }
}

/**
 * Snakk med Google Chirp3-HD via free-tts (fallback)
 */
async function speakWithGoogle(text, lang) {
  try {
    const voiceConfig = GOOGLE_VOICES[lang] || GOOGLE_VOICES.en;

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
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }

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
 * Snakk med native Web Speech API (siste fallback)
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
 * Prøver: 1) Edge TTS  2) Google Chirp3-HD  3) Native Web Speech API
 */
export async function speak(text, lang = 'no', options = {}) {
  if (!text || text.trim().length === 0) {
    return null;
  }

  // Stopp pågående tale
  stopSpeaking();

  // 1) Prøv Edge TTS først (beste kvalitet)
  const edgeSuccess = await speakWithEdgeTTS(text, lang);
  if (edgeSuccess) {
    options.onStart?.();
    return { provider: 'edge' };
  }

  // 2) Fallback til Google Chirp3-HD
  const googleSuccess = await speakWithGoogle(text, lang);
  if (googleSuccess) {
    options.onStart?.();
    return { provider: 'google' };
  }

  // 3) Siste fallback: native Web Speech API
  console.log('Faller tilbake til native TTS');
  return speakWithNative(text, lang, options);
}

/**
 * Stopp pågående tale
 */
export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
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
  return true; // Edge TTS alltid tilgjengelig
}

/**
 * Sjekk om engelsk stemme er tilgjengelig
 */
export function hasEnglishVoice() {
  return true;
}

/**
 * Hent info om nåværende stemme
 */
export function getCurrentVoiceInfo(lang = 'no') {
  const edgeVoice = EDGE_VOICES[lang] || EDGE_VOICES.en;
  return {
    name: `Edge TTS ${edgeVoice}`,
    lang: lang === 'no' ? 'nb-NO' : 'en-US',
    provider: 'edge',
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
  const text = timeToText(hours, minutes, lang);
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
