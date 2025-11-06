import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { LanguageCode, Translations } from '../types';
import { translations as appTranslations } from '../i18n/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  translate: (key: string, replacements?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const UI_KEYS = Object.keys(appTranslations.en);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en'); // Default to English
  const [dynamicTranslations, setDynamicTranslations] = useState<Translations | null>(null);

  const fetchBackendTranslations = useCallback(async (lang: LanguageCode) => {
    if (lang === 'en') {
      setDynamicTranslations(null);
      return;
    }
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: UI_KEYS, target: lang })
      });
      const data = await res.json();
      if (data.translations && Array.isArray(data.translations)) {
        const backendTranslations: Translations = {};
        UI_KEYS.forEach((key, i) => {
          backendTranslations[key] = data.translations[i] || key;
        });
        setDynamicTranslations(backendTranslations);
      } else {
        setDynamicTranslations(null);
      }
    } catch {
      setDynamicTranslations(null);
    }
  }, []);

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
    fetchBackendTranslations(lang);
  }, [fetchBackendTranslations]);

  useEffect(() => {
    if (language !== 'en') {
      fetchBackendTranslations(language);
    }
  }, [language, fetchBackendTranslations]);

  const translate = useCallback((key: string, replacements?: Record<string, string>): string => {
    const langTranslations: Translations = dynamicTranslations || appTranslations[language] || appTranslations.en;
    let translatedText = langTranslations[key] || key;
    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        translatedText = translatedText.replace(`{${placeholder}}`, replacements[placeholder]);
      });
    }
    return translatedText;
  }, [language, dynamicTranslations]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};//hi

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
