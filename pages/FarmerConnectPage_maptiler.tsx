import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';//hi
import { MapSearchCategory } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Card from '../components/Card';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

const MAPTILER_API_KEY = 'dkITdiV302sFN88xOmK5';

const initialSearchCategories: MapSearchCategory[] = [
  { id: 'markets', translationKey: 'fcCategoryMarkets', defaultText: 'Markets', textQuery: 'agricultural market' },
  { id: 'fertilizers', translationKey: 'fcCategoryFertilizers', defaultText: 'Fertilizer Shops', textQuery: 'fertilizer shop' },
  { id: 'nurseries', translationKey: 'fcCategoryNurseries', defaultText: 'Plant Nurseries', textQuery: 'plant nursery' },
  { id: 'equipment', translationKey: 'fcCategoryEquipment', defaultText: 'Agri Equipment', textQuery: 'agricultural equipment' },
  { id: 'cold_storage', translationKey: 'fcCategoryColdStorage', defaultText: 'Cold Storage', textQuery: 'cold storage' },
  { id: 'veterinary', translationKey: 'fcCategoryVeterinary', defaultText: 'Veterinary Services', textQuery: 'veterinary clinic' },
  { id: 'agri_consultants', translationKey: 'fcCategoryAgriConsultants', defaultText: 'Agri Consultants', textQuery: 'agricultural consultant' },
  { id: 'soil_testing', translationKey: 'fcCategorySoilTesting', defaultText: 'Soil Testing Labs', textQuery: 'soil testing laboratory' },
  { id: 'warehousing', translationKey: 'fcCategoryWarehousing', defaultText: 'Warehousing', textQuery: 'warehouse' },
];

const MAP_DEFAULT_ZOOM = 12;
const MAP_DEFAULT_LOCATION = { lat: 13.3506, lng: 77.7256 };

const categoryIcons: Record<string, string> = {
  markets: '🛒', fertilizers: '🧪', nurseries: '🌱', equipment: '🚜', cold_storage: '❄️',
  veterinary: '🐄', agri_consultants: '👨‍🌾', soil_testing: '🧬', warehousing: '🏬',
};

interface SearchResult {
  name: string;
  address: string;
  coordinates: [number, number];
  distance?: string;
  category?: string;
}

const FarmerConnectPage: React.FC = () => {
  const { translate } = useLanguage();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const markersRef = useRef<maptilersdk.Marker[]>([]);
  const userMarkerRef = useRef<maptilersdk.Marker | null>(null);

  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number}>(MAP_DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MapSearchCategory | null>(null);
  const [customSearchQuery, setCustomSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [mapStyle, setMapStyle] = useState<string>('streets-v2');

  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    maptilersdk.config.apiKey = MAPTILER_API_KEY;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setCurrentLocation(userLoc);
          initializeMap(userLoc);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setError('Could not get your location. Using default location.');
          initializeMap(MAP_DEFAULT_LOCATION);
        }
      );
    } else {
      setError('Geolocation not supported');
      initializeMap(MAP_DEFAULT_LOCATION);
    }
  }, []);

  const initializeMap = useCallback((location: {lat: number, lng: number}) => {
    if (!mapContainer.current) return;
    try {
      const mapInstance = new maptilersdk.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/${mapStyle}/style.json?key=${MAPTILER_API_KEY}`,
        center: [location.lng, location.lat],
        zoom: MAP_DEFAULT_ZOOM,
      });
      map.current = mapInstance;
      const el = document.createElement('div');
      el.className = 'w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg';
      const userMarker = new maptilersdk.Marker({ element: el, anchor: 'center' })
        .setLngLat([location.lng, location.lat])
        .addTo(mapInstance);
      userMarkerRef.current = userMarker;
      mapInstance.on('load', () => setIsLoading(false));
    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Failed to initialize map');
      setIsLoading(false);
    }
  }, [mapStyle]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  }, []);

  const performSearch = useCallback(async (query: string, categoryName: string) => {
    if (!map.current) return;
    setLoadingSearch(true);
    setError(null);
    clearMarkers();
    setResults([]);
    
    try {
      // Get city/area name from current location for context
      const reverseGeoUrl = `https://api.maptiler.com/geocoding/${currentLocation.lng},${currentLocation.lat}.json?key=${MAPTILER_API_KEY}`;
      const reverseResponse = await fetch(reverseGeoUrl);
      const reverseData = await reverseResponse.json();
      
      let locationContext = 'Bangalore, Karnataka';
      if (reverseData.features && reverseData.features.length > 0) {
        const place = reverseData.features[0];
        locationContext = place.context?.find((c: any) => c.id.includes('place'))?.text || 
                         place.place_name.split(',')[0] || 
                         'Bangalore';
      }

      // Search for specific locations using the location context
      const searchQuery = `${query} near ${locationContext}`;
      const searchUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(searchQuery)}.json?key=${MAPTILER_API_KEY}&proximity=${currentLocation.lng},${currentLocation.lat}&limit=20&types=poi`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const searchResults: SearchResult[] = data.features
          .filter((feature: any) => {
            const coords = feature.geometry.coordinates;
            const distance = calculateDistance(currentLocation.lat, currentLocation.lng, coords[1], coords[0]);
            return distance <= 50; // Within 50km
          })
          .map((feature: any) => {
            const coords = feature.geometry.coordinates;
            const distance = calculateDistance(currentLocation.lat, currentLocation.lng, coords[1], coords[0]);
            return {
              name: feature.text || feature.place_name.split(',')[0],
              address: feature.place_name,
              coordinates: coords,
              distance: `${distance.toFixed(2)} km`,
              category: categoryName
            };
          })
          .sort((a: SearchResult, b: SearchResult) => parseFloat(a.distance!) - parseFloat(b.distance!))
          .slice(0, 10); // Top 10 closest

        if (searchResults.length === 0) {
          setError(`No ${categoryName} found within 50km. Try searching in a specific area.`);
        } else {
          setResults(searchResults);
          searchResults.forEach((result, index) => {
            const el = document.createElement('div');
            el.className = 'flex items-center justify-center w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:bg-green-600 transition-colors';
            el.innerHTML = `<span class="text-white font-bold text-sm">${index + 1}</span>`;
            const marker = new maptilersdk.Marker({ element: el, anchor: 'bottom' })
              .setLngLat(result.coordinates)
              .setPopup(new maptilersdk.Popup({ offset: 25 }).setHTML(
                `<div class="p-2"><h3 class="font-bold text-green-700">${result.name}</h3><p class="text-sm text-gray-600 mt-1">${result.address}</p><p class="text-sm text-blue-600 mt-1">📍 ${result.distance}</p></div>`
              ))
              .addTo(map.current!);
            markersRef.current.push(marker);
          });
          
          const bounds = new maptilersdk.LngLatBounds();
          bounds.extend([currentLocation.lng, currentLocation.lat]);
          searchResults.forEach(result => bounds.extend(result.coordinates));
          map.current.fitBounds(bounds, { padding: 50 });
        }
      } else {
        setError(`No results found for ${categoryName}. Try custom search with specific location.`);
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError(`Search failed: ${err.message || 'Please try again'}`);
    } finally {
      setLoadingSearch(false);
    }
  }, [currentLocation, clearMarkers]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleCategoryClick = (category: MapSearchCategory) => {
    setSelectedCategory(category);
    performSearch(category.textQuery, translate(category.translationKey, { default: category.defaultText }));
  };

  const handleCustomSearch = () => {
    if (customSearchQuery.trim()) performSearch(customSearchQuery, 'Custom Search');
  };

  const changeMapStyle = (style: string) => {
    if (map.current) {
      map.current.setStyle(`https://api.maptiler.com/maps/${style}/style.json?key=${MAPTILER_API_KEY}`);
      setMapStyle(style);
    }
  };

  const panToResult = (result: SearchResult) => {
    if (map.current) map.current.flyTo({ center: result.coordinates, zoom: 15, duration: 1500 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white border-none shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <span className="text-5xl">🗺️</span>
            {translate('fcTitle', { default: 'Farmer Connect - Find Services' })}
          </h1>
          <p className="text-lg opacity-90">{translate('fcDescription', { default: 'Discover agricultural services near you - Powered by MapTiler!' })}</p>
        </Card>

        {error && <Alert type="error" message={error} />}

        <Card className="mb-4">
          <h3 className="font-semibold text-green-700 mb-3">🎨 Map Style</h3>
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'streets-v2', name: 'Streets' },
              { id: 'satellite', name: 'Satellite' },
              { id: 'hybrid', name: 'Hybrid' },
              { id: 'topo-v2', name: 'Topographic' },
              { id: 'outdoor-v2', name: 'Outdoor' },
            ].map(style => (
              <button
                key={style.id}
                onClick={() => changeMapStyle(style.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  mapStyle === style.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-300'
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </Card>

        <Card className="mb-4">
          <h3 className="font-semibold text-green-700 mb-3 text-lg">
            {translate('fcSearchCategories', { default: 'Search Categories' })}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {initialSearchCategories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                disabled={loadingSearch}
                className={`flex flex-col items-center p-4 rounded-xl transition-all shadow-md hover:shadow-xl ${
                  selectedCategory?.id === category.id
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white transform scale-105'
                    : 'bg-white hover:bg-green-50 text-gray-700'
                }`}
              >
                <span className="text-3xl mb-2">{categoryIcons[category.id]}</span>
                <span className="text-sm font-medium text-center">
                  {translate(category.translationKey, { default: category.defaultText })}
                </span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="mb-4">
          <h3 className="font-semibold text-green-700 mb-3">{translate('fcCustomSearch', { default: 'Custom Search' })}</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={customSearchQuery}
              onChange={(e) => setCustomSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomSearch()}
              placeholder={translate('fcSearchPlaceholder', { default: 'Search for any service...' })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleCustomSearch}
              disabled={loadingSearch || !customSearchQuery.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {translate('fcSearch', { default: 'Search' })}
            </button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden">
              <div ref={mapContainer} className="w-full h-[500px] lg:h-[600px]">
                {isLoading && (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <LoadingSpinner text="Loading MapTiler..." size="lg" />
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <h3 className="font-bold text-green-700 text-xl mb-4">
                {translate('fcResults', { default: 'Search Results' })} ({results.length})
              </h3>
              
              {loadingSearch && (
                <div className="flex justify-center py-8">
                  <LoadingSpinner text="Searching..." />
                </div>
              )}

              {!loadingSearch && results.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-4xl mb-2">🔍</p>
                  <p>{translate('fcSelectCategory', { default: 'Select a category or search to find services' })}</p>
                </div>
              )}

              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => panToResult(result)}
                    className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-bold text-green-700">{result.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{result.address}</p>
                        {result.distance && (
                          <p className="text-sm text-blue-600 mt-2 font-medium">
                            📍 {result.distance}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <Card className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-start gap-4">
            <span className="text-4xl">ℹ️</span>
            <div>
              <h3 className="font-bold text-blue-700 mb-2">{translate('fcHowToUse', { default: 'How to Use' })}</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✅ Click on any category to find nearby services</li>
                <li>✅ Use custom search for specific queries</li>
                <li>✅ Click on map markers to see details</li>
                <li>✅ Click on results to zoom to location</li>
                <li>✅ Change map style (Satellite, Topographic, etc.)</li>
                <li>✅ <strong>Powered by MapTiler - No Google Maps needed!</strong></li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FarmerConnectPage;
