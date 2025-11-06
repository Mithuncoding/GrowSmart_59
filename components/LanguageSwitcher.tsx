
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageCode } from '../types';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, translate } = useLanguage();

  const languages: { code: LanguageCode; name: string, localName: string }[] = [
    { code: 'en', name: 'English', localName: 'English' },
    { code: 'kn', name: 'Kannada', localName: 'ಕನ್ನಡ' },
  ];//hi

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as LanguageCode);
  };

  return (
    <div className="flex flex-col items-start">
      <label htmlFor="language-select" className="block text-sm font-medium text-gray-200 mb-1">
        {translate('language') || 'Language:'} 
      </label>
      <select
        id="language-select"
        value={language}
        onChange={handleChange}
        className="w-full p-2 border border-green-500 rounded-md bg-green-600 text-white focus:ring-green-400 focus:border-green-400"
        aria-label={translate('selectLanguage') || 'Select Language'}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.localName} ({lang.name})
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
