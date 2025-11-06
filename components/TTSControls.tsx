
import React from 'react';
import useTTS from '../hooks/useTTS';
import { useLanguage } from '../contexts/LanguageContext';

interface TTSControlsProps {
  textToSpeak: string;
  langForTTS?: string; // Optional: ISO lang code like 'en-US', 'kn-IN'
}//hi

const TTSControls: React.FC<TTSControlsProps> = ({ textToSpeak, langForTTS: langOverride }) => {
  const { speak, pause, resume, cancel, isSpeaking, isPaused, isSupported } = useTTS();
  const { language, translate } = useLanguage();

  // Helper to map app language code to TTS specific codes if needed.
  // This could be part of useTTS or LanguageContext if more complex mapping is needed.
  const mapAppLangToTTSLang = (appLang: string): string => {
    if (appLang === 'kn') return 'kn-IN';
    if (appLang === 'hi') return 'hi-IN';
    return 'en-US'; // Default
  };

  const effectiveLangForTTS = langOverride || mapAppLangToTTSLang(language);

  if (!isSupported) {
    return <p className="text-sm text-yellow-700 bg-yellow-100 p-2 rounded-md my-2">{translate('ttsUnsupported')}</p>;
  }
  
  const handlePlay = () => {
    if (textToSpeak && textToSpeak.trim()) {
      speak(textToSpeak, effectiveLangForTTS);
    } else {
      console.warn("TTSControls: Text to speak is empty.");
    }
  };

  return (
    <div className="flex items-center space-x-2 mt-4">
      {!isSpeaking ? (
        <button
          onClick={handlePlay}
          disabled={!textToSpeak || !textToSpeak.trim()}
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={translate('ttsPlay')}
          aria-label={translate('ttsPlay')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>
        </button>
      ) : isPaused ? (
        <button
          onClick={resume}
          className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
          title={translate('ttsResume')}
          aria-label={translate('ttsResume')}
        >
          {/* Play icon for resume */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>
        </button>
      ) : (
        <button
          onClick={pause}
          className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
          title={translate('ttsPause')}
          aria-label={translate('ttsPause')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></svg>
        </button>
      )}
      {isSpeaking && (
        <button
          onClick={cancel}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          title={translate('ttsStop')}
          aria-label={translate('ttsStop')}
        >
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" /></svg>
        </button>
      )}
      {isSpeaking && !isPaused && <span className="text-sm text-gray-600 italic">{translate('ttsSpeaking')}</span>}
      {isSpeaking && isPaused && <span className="text-sm text-gray-600 italic">{translate('ttsPaused')}</span>}
    </div>
  );
};

export default TTSControls;
