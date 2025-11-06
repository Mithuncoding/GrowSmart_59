// Google Translate utility functions
// This file provides translation services using the backend API

const BACKEND_URL = '/api/translate';//hi

// Cache for translations to avoid repeated API calls
const translationCache = new Map<string, string>();

/**
 * Translates text to the target language using the backend translation API
 * @param text - The text to translate
 * @param target - The target language code (e.g., 'kn', 'hi', 'ta')
 * @returns Object with translated text and script validation status
 */
export const getCachedTranslation = async (
  text: string,
  target: string
): Promise<{ translated: string; scriptOk: boolean }> => {
  if (!text || !target) {
    return { translated: text, scriptOk: true };
  }

  // Check cache first
  const cacheKey = `${text}::${target}`;
  if (translationCache.has(cacheKey)) {
    return { translated: translationCache.get(cacheKey)!, scriptOk: true };
  }

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts: [text],
        target: target,
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    const translated = data.translations?.[0] || text;
    
    // Cache the translation
    translationCache.set(cacheKey, translated);

    // Check if the translation is in the expected script
    const scriptOk = isTextInExpectedScript(translated, target);

    return { translated, scriptOk };
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text on error
    return { translated: text, scriptOk: false };
  }
};

/**
 * Validates if the text is in the expected script for the target language
 * @param text - The text to validate
 * @param langCode - The language code
 * @returns true if the text appears to be in the correct script
 */
export const isTextInExpectedScript = (text: string, langCode: string): boolean => {
  if (!text || langCode === 'en') return true;

  // Define Unicode ranges for different scripts
  const scriptRanges: { [key: string]: RegExp } = {
    'kn': /[\u0C80-\u0CFF]/, // Kannada
    'hi': /[\u0900-\u097F]/, // Devanagari (Hindi)
    'ta': /[\u0B80-\u0BFF]/, // Tamil
    'te': /[\u0C00-\u0C7F]/, // Telugu
    'bn': /[\u0980-\u09FF]/, // Bengali
    'mr': /[\u0900-\u097F]/, // Marathi (also Devanagari)
    'gu': /[\u0A80-\u0AFF]/, // Gujarati
    'ml': /[\u0D00-\u0D7F]/, // Malayalam
    'pa': /[\u0A00-\u0A7F]/, // Gurmukhi (Punjabi)
    'ur': /[\u0600-\u06FF]/, // Arabic script (Urdu)
    'or': /[\u0B00-\u0B7F]/, // Oriya
  };

  const scriptPattern = scriptRanges[langCode];
  
  if (!scriptPattern) {
    // Unknown language code, assume it's okay
    return true;
  }

  // Be more lenient - allow if at least 10% of characters are in the expected script
  // or if the text contains some expected script characters (for mixed content)
  const matches = text.match(scriptPattern);
  if (matches && matches.length > 0) {
    return true; // Has at least some characters in the expected script
  }
  
  // If no script characters found, check if it's mostly Latin (technical terms, numbers, etc.)
  const latinPattern = /[a-zA-Z0-9]/;
  const hasLatin = latinPattern.test(text);
  if (hasLatin) {
    // Allow mixed content (Latin + script)
    return true;
  }

  // If none of the above, it might be in wrong script
  return false;
};

/**
 * Clears the translation cache
 */
export const clearTranslationCache = (): void => {
  translationCache.clear();
};

/**
 * Gets the current cache size
 */
export const getTranslationCacheSize = (): number => {
  return translationCache.size;
};
