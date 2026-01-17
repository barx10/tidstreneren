// Snakk ut tekst med norsk stemme
export function speak(text) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis ikke støttet i denne nettleseren');
    return;
  }

  // Stopp eventuell pågående tale
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'nb-NO';
  utterance.rate = 0.9; // Litt langsommere for bedre forståelse
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  // Prøv å finne norsk stemme
  const voices = window.speechSynthesis.getVoices();
  const norwegianVoice = voices.find(
    voice => voice.lang.startsWith('nb') || voice.lang.startsWith('no')
  );
  
  if (norwegianVoice) {
    utterance.voice = norwegianVoice;
  }
  
  window.speechSynthesis.speak(utterance);
}

// Initialiser voices (må kalles ved oppstart)
export function initVoices() {
  if ('speechSynthesis' in window) {
    // Voices lastes asynkront, så vi må vente
    window.speechSynthesis.getVoices();
    
    // Lytt på voices-endring
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}