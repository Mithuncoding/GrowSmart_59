
import React, { useState, useCallback } from 'react';//hi
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import Alert from '../components/Alert';
import TTSControls from '../components/TTSControls';
import { EncyclopediaEntry } from '../types';
import { getEncyclopediaEntry } from '../services/geminiService';
import { PLANT_CATEGORIES, PlantCategory } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

const EncyclopediaPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [entry, setEntry] = useState<EncyclopediaEntry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { translate, language } = useLanguage();

  const handleSearch = useCallback(async (query?: string) => {
    const currentQuery = query || searchQuery;
    if (!currentQuery.trim()) {
      setError(translate('errorEnterPlantName'));
      setEntry(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setEntry(null);

    const result = await getEncyclopediaEntry(currentQuery); 
    if (result.error && (!result.plantName && !result.summary)) { // Prioritize error if no content
      setError(result.error);
      setEntry(null); 
    } else if (!result.plantName && !result.summary && !result.error) { 
      setError(translate('errorPlantNotFound', { query: currentQuery }));
      setEntry(null);
    }
    else {
      setEntry(result);
    }
    setIsLoading(false);
  }, [searchQuery, translate]);
  
  const handleCategoryClick = (category: PlantCategory) => {
    const categoryName = category.searchKeywords || category.name;
    setSearchQuery(categoryName); 
    handleSearch(categoryName); 
  };

  let entryTextForTTS = "";
  if (entry) {
    const parts = [
        entry.plantName || '',
        entry.summary ? `${translate('summary')}: ${entry.summary}` : '',
        entry.sunlight ? `${translate('sunlight')}: ${entry.sunlight}` : '',
        entry.watering ? `${translate('watering')}: ${entry.watering}` : '',
        entry.care ? `${translate('generalCare')}: ${entry.care}` : '',
        entry.commonDiseases ? `${translate('commonDiseasesPests')}: ${entry.commonDiseases}` : '',
    ];
    entryTextForTTS = parts.filter(p => p.trim()).join('. ');
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center capitalize">{translate('encyclopediaTitle')}</h2>
      <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
        {translate('encyclopediaDescription')}
      </p>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <Card className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={translate('encyclopediaSearchPlaceholder')}
            className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            aria-label={translate('searchPlantName')}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={() => handleSearch()}
            disabled={isLoading}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && !entry ? <LoadingSpinner size="sm" /> : translate('search')}
          </button>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-green-700 mb-3 capitalize">{translate('exploreCategories')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {PLANT_CATEGORIES.map(category => (
              <button 
                key={category.name} 
                onClick={() => handleCategoryClick(category)}
                className="bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm flex flex-col items-center justify-center text-center h-full focus:outline-none focus:ring-2 focus:ring-green-500"
                title={`${translate('searchFor')} ${category.name}`}
              >
                <span className="text-3xl mb-1">{category.emoji}</span>
                <span className="truncate w-full font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {isLoading && !entry && <LoadingSpinner text={translate('fetchInfoButton')} />}

      {entry && (entry.plantName || entry.summary) && (
        <Card title={translate('encyclopediaEntryTitle', { plantName: entry.plantName || translate('unknownPlant') })}>
          <div className="space-y-3 text-gray-700">
            {entry.summary && entry.summary !== "N/A" && <div><strong className="text-green-600 capitalize">{translate('summary')}:</strong> <p className="mt-1 whitespace-pre-line">{entry.summary}</p></div>}
            {entry.sunlight && entry.sunlight !== "N/A" && <div><strong className="text-green-600 capitalize">{translate('sunlight')}:</strong> <p className="mt-1 whitespace-pre-line">{entry.sunlight}</p></div>}
            {entry.watering && entry.watering !== "N/A" && <div><strong className="text-green-600 capitalize">{translate('watering')}:</strong> <p className="mt-1 whitespace-pre-line">{entry.watering}</p></div>}
            {entry.care && entry.care !== "N/A" && <div><strong className="text-green-600 capitalize">{translate('generalCare')}:</strong> <p className="mt-1 whitespace-pre-line">{entry.care}</p></div>}
            {entry.commonDiseases && entry.commonDiseases !== "N/A" && <div><strong className="text-green-600 capitalize">{translate('commonDiseasesPests')}:</strong> <p className="mt-1 whitespace-pre-line">{entry.commonDiseases}</p></div>}
          </div>
          {entry.error && !error && <Alert type="warning" message={`${translate('aiResponseWarning')}: ${entry.error}`} />}
          <TTSControls textToSpeak={entryTextForTTS} />
        </Card>
      )}
    </div>
  );
};

export default EncyclopediaPage;
