
import { useState, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TTSHook {//hi
  speak: (text: string, langOverride?: string) => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
}

const useTTS = (): TTSHook => {
  const { language: currentAppLanguage, translate } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    setIsSupported(supported);

    if (!supported) {
        console.warn("Text-to-speech is not supported by this browser.");
        return;
    }

    const loadVoices = () => {
        // Ensure voices are loaded. Some browsers require this to be called.
        speechSynthesis.getVoices();
    };
    
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if (speechSynthesis) { // Check if speechSynthesis itself is defined
        speechSynthesis.cancel();
      }
      if (currentUtteranceRef.current) {
        currentUtteranceRef.current.onstart = null;
        currentUtteranceRef.current.onend = null;
        currentUtteranceRef.current.onerror = null;
        currentUtteranceRef.current.onpause = null;
        currentUtteranceRef.current.onresume = null;
        currentUtteranceRef.current = null;
      }
    };
  }, []);

  const mapLangCodeToTTS = (appLang: string): string => {
    if (appLang === 'kn') return 'kn-IN';
    if (appLang === 'hi') return 'hi-IN';
    return 'en-US'; // Default
  };

  const speak = useCallback((text: string, langOverride?: string) => {
    if (!isSupported) {
      console.warn(translate('ttsUnsupported'));
      return;
    }
    if (!text || !text.trim()) {
        console.warn("TTS: Attempted to speak empty or whitespace-only text.");
        return;
    }

    if (currentUtteranceRef.current) {
        currentUtteranceRef.current.onstart = null;
        currentUtteranceRef.current.onend = null;
        currentUtteranceRef.current.onerror = null;
        currentUtteranceRef.current.onpause = null;
        currentUtteranceRef.current.onresume = null;
    }
    
    speechSynthesis.cancel(); 

    const newUtterance = new SpeechSynthesisUtterance(text);
    const targetLang = langOverride || mapLangCodeToTTS(currentAppLanguage);
    newUtterance.lang = targetLang;
    
    const voices = speechSynthesis.getVoices();
    let voice = voices.find(v => v.lang === targetLang);
    if (!voice && targetLang.includes('-')) { // Try finding by base language e.g. 'en' from 'en-US'
        voice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));
    }
    if (voice) {
      newUtterance.voice = voice;
    } else {
      console.warn(`No specific voice found for language: ${targetLang}. Using browser default for this language if available, or global default.`);
    }

    newUtterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    newUtterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      if (currentUtteranceRef.current === newUtterance) {
          currentUtteranceRef.current = null;
      }
    };

    newUtterance.onerror = (event) => {
      if (event.error !== 'interrupted' && event.error !== 'canceled') { // 'canceled' is also common on explicit stop
        console.error('Speech synthesis error:', event.error, 'Text snippet:', text.substring(0, 70) + "...");
      }
      setIsSpeaking(false);
      setIsPaused(false);
      if (currentUtteranceRef.current === newUtterance) {
          currentUtteranceRef.current = null;
      }
    };

    newUtterance.onpause = () => {
      if (speechSynthesis.speaking && speechSynthesis.paused) { 
          setIsPaused(true);
          setIsSpeaking(true); // Remain true while paused
      }
    };

    newUtterance.onresume = () => {
       if (speechSynthesis.speaking && !speechSynthesis.paused) { 
          setIsPaused(false);
       }
    };
    
    currentUtteranceRef.current = newUtterance;
    
    // Reset states before speaking, event handlers will update them.
    setIsSpeaking(false); 
    setIsPaused(false);

    try {
        speechSynthesis.speak(newUtterance);
    } catch (e) {
        console.error("Error directly calling speechSynthesis.speak:", e);
        setIsSpeaking(false);
        setIsPaused(false);
        if (currentUtteranceRef.current === newUtterance) {
             currentUtteranceRef.current = null;
        }
    }

  }, [isSupported, currentAppLanguage, translate]);

  const pause = useCallback(() => {
    if (isSupported && speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (isSupported && speechSynthesis.paused) { 
      speechSynthesis.resume();
    }
  }, [isSupported]);

  const cancel = useCallback(() => {
    if (isSupported && (speechSynthesis.speaking || speechSynthesis.pending)) {
      speechSynthesis.cancel();
      // Explicitly reset states as onend/onerror might not fire or fire too late.
      setIsSpeaking(false);
      setIsPaused(false);
      if(currentUtteranceRef.current) {
          currentUtteranceRef.current.onstart = null;
          currentUtteranceRef.current.onend = null;
          currentUtteranceRef.current.onerror = null;
          currentUtteranceRef.current.onpause = null;
          currentUtteranceRef.current.onresume = null;
          currentUtteranceRef.current = null;
      }
    }
  }, [isSupported]);

  return { speak, pause, resume, cancel, isSpeaking, isPaused, isSupported };
};

export default useTTS;
