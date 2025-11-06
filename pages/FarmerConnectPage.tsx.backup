/// <reference types="@types/google.maps" />

import React, { useState, useEffect, useRef, useCallback } from 'react';//hi
import { useLanguage } from '../contexts/LanguageContext';
import { MapSearchCategory, RouteInfo } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Card from '../components/Card';

// Define search categories with textQuery for searchByText
const initialSearchCategories: MapSearchCategory[] = [
  { id: 'markets', translationKey: 'fcCategoryMarkets', defaultText: 'Markets', textQuery: 'agricultural market OR farmers market OR produce market' },
  { id: 'fertilizers', translationKey: 'fcCategoryFertilizers', defaultText: 'Fertilizer Shops', textQuery: 'fertilizer shop OR agricultural supplies OR pesticide shop' },
  { id: 'nurseries', translationKey: 'fcCategoryNurseries', defaultText: 'Plant Nurseries', textQuery: 'plant nursery OR garden center' },
  { id: 'equipment', translationKey: 'fcCategoryEquipment', defaultText: 'Agri Equipment', textQuery: 'agricultural equipment supplier OR tractor dealer OR farm machinery' },
  { id: 'cold_storage', translationKey: 'fcCategoryColdStorage', defaultText: 'Cold Storage', textQuery: 'cold storage facility OR refrigerated warehouse for produce' },
  { id: 'veterinary', translationKey: 'fcCategoryVeterinary', defaultText: 'Veterinary Services', textQuery: 'veterinary clinic OR animal hospital' },
  { id: 'agri_consultants', translationKey: 'fcCategoryAgriConsultants', defaultText: 'Agri Consultants', textQuery: 'agricultural consultant OR farm advisor' },
  { id: 'soil_testing', translationKey: 'fcCategorySoilTesting', defaultText: 'Soil Testing Labs', textQuery: 'soil testing laboratory OR soil analysis service' },
  { id: 'warehousing', translationKey: 'fcCategoryWarehousing', defaultText: 'Warehousing', textQuery: 'warehouse OR storage facility for agricultural produce' },
];

const MAP_DEFAULT_ZOOM = 12;
const SEARCH_RADIUS_METERS = 10000; // 10km
const MAP_DEFAULT_LOCATION = { lat: 13.3506, lng: 77.7256 }; // Nagarjuna College of Engineering

// Add emoji icons for categories
const categoryIcons: Record<string, string> = {
  markets: '🛒',
  fertilizers: '🧪',
  nurseries: '🌱',
  equipment: '🚜',
  cold_storage: '❄️',
  veterinary: '🐄',
  agri_consultants: '👨‍🌾',
  soil_testing: '🧬',
  warehousing: '🏬',
};

// Add map styles
const MAP_STYLES = {
  default: undefined,
  dark: [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    // ... (add more dark style rules as needed)
  ],
  satellite: 'satellite',
};

const FarmerConnectPage: React.FC = () => {
  const { translate } = useLanguage();
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const placeMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const autocompleteInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral>(MAP_DEFAULT_LOCATION);
  const [isMapApiLoaded, setIsMapApiLoaded] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MapSearchCategory | null>(null);
  const [customSearchQuery, setCustomSearchQuery] = useState('');
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [activeMarkerIndex, setActiveMarkerIndex] = useState<number | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [distanceMatrixResults, setDistanceMatrixResults] = useState<Record<string, { distance: string, duration: string }> | {}>({});
  const [mapStyle, setMapStyle] = useState<'default' | 'dark' | 'satellite'>('default');
  const [favorites, setFavorites] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('fcFavorites') || '[]');
    } catch {
      return [];
    }
  });
  const [showStreetView, setShowStreetView] = useState(false);
  const [streetViewPosition, setStreetViewPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [geofence, setGeofence] = useState<{ center: google.maps.LatLngLiteral, radius: number } | null>(null);
  const [isInsideGeofence, setIsInsideGeofence] = useState<boolean | null>(null);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);

  const clearMarkers = useCallback(() => {
    placeMarkersRef.current.forEach(marker => {
        marker.map = null;
    });
    placeMarkersRef.current = [];
  }, []);

  const clearDirections = useCallback(() => {
    directionsRendererRef.current?.setMap(null);
    setRouteInfo(null);
  }, []);

  const initMap = useCallback((location: google.maps.LatLngLiteral) => {
    if (mapDivRef.current && window.google?.maps?.Map && window.google?.maps?.marker?.AdvancedMarkerElement) {
      const commonMapOptions: google.maps.MapOptions = {
        center: location,
        zoom: MAP_DEFAULT_ZOOM,
        mapId: 'PLANTCARE_AI_MAP_ID',
        mapTypeControl: false,
        streetViewControl: false,
      };
      // Only create the map if it doesn't exist
      if (!mapInstanceRef.current) {
        const map = new window.google.maps.Map(mapDivRef.current, commonMapOptions);
        mapInstanceRef.current = map;
      }
      // Always update center
      mapInstanceRef.current.setCenter(location);
      // Add or update user marker
      if (userMarkerRef.current) {
        userMarkerRef.current.position = location;
        userMarkerRef.current.map = mapInstanceRef.current;
      } else {
        const userPinElement = document.createElement('div');
        userPinElement.className = 'w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center';
        userPinElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-4 h-4"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';
        userMarkerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
          position: location,
          map: mapInstanceRef.current,
          title: translate('yourLocation', { default: 'Your Location' }),
          content: userPinElement,
        });
      }
      // Directions services
      if (window.google.maps.DirectionsService && window.google.maps.DirectionsRenderer) {
        if (!directionsServiceRef.current) directionsServiceRef.current = new window.google.maps.DirectionsService();
        if (!directionsRendererRef.current) {
          directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
            polylineOptions: {
              strokeColor: '#1a73e8',
              strokeOpacity: 0.9,
              strokeWeight: 6,
            },
            suppressMarkers: false,
          });
        }
        directionsRendererRef.current.setMap(mapInstanceRef.current);
      }
      if (mapInstanceRef.current) {
        if (mapStyle === 'satellite') {
          mapInstanceRef.current.setMapTypeId('satellite');
        } else {
          mapInstanceRef.current.setMapTypeId('roadmap');
          mapInstanceRef.current.setOptions({ styles: mapStyle === 'dark' ? MAP_STYLES.dark : undefined });
        }
      }
      setLoadingLocation(false);
    } else {
      setError(translate('fcErrorNoGoogleMaps'));
      setLoadingLocation(false);
    }
  }, [translate, mapStyle]);

  useEffect(() => {
    const handleMapsApiLoaded = () => {
      setIsMapApiLoaded(true);
    };
    if (window.google && window.google.maps) {
      handleMapsApiLoaded();
    } else {
      window.addEventListener('google-maps-loaded', handleMapsApiLoaded);
    }
    return () => {
      window.removeEventListener('google-maps-loaded', handleMapsApiLoaded);
    };
  }, []);

  // Always initialize map with default location as soon as API is loaded
  useEffect(() => {
    if (isMapApiLoaded) {
      initMap(currentLocation);
    }
  }, [isMapApiLoaded, initMap, currentLocation]);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (isMapApiLoaded && autocompleteInputRef.current && window.google?.maps?.places?.Autocomplete) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(autocompleteInputRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'in' },
      });
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current!.getPlace();
        if (place.geometry && place.geometry.location) {
          const loc = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          setCurrentLocation(loc);
          initMap(loc);
        }
      });
    }
  }, [isMapApiLoaded, initMap]);

  const fetchDirections = (destination: google.maps.LatLng | google.maps.LatLngLiteral) => {
    if (!currentLocation) {
        setError(translate('fcErrorLocation'));
        return;
    }
    if(!directionsServiceRef.current || !directionsRendererRef.current) {
        setError(translate('fcErrorDirectionsNotAvailable'));
        return;
    }

    setLoadingServices(true);
    setLoadingRoute(true);
    directionsServiceRef.current.route({
        origin: currentLocation,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: showAlternatives,
    }, (response, status) => {
        setLoadingServices(false);
        setLoadingRoute(false);
        if (status === window.google.maps.DirectionsStatus.OK && response) {
            directionsRendererRef.current!.setDirections(response);
            // Pan/zoom to fit route
            if (mapInstanceRef.current && response.routes[0].bounds) {
                mapInstanceRef.current.fitBounds(response.routes[0].bounds);
            }
            const route = response.routes[0];
            if (route && route.legs && route.legs[0]) {
                setRouteInfo({
                    distance: route.legs[0].distance?.text || 'N/A',
                    duration: route.legs[0].duration?.text || 'N/A',
                });
            }
        } else {
            setError(translate('fcErrorRouteNotFound') + ` (${status})`);
            setRouteInfo(null);
        }
    });
  };

  const performSearch = useCallback(async (query: string, categoryDefaultText: string) => {
    if (!currentLocation || !mapInstanceRef.current || !window.google?.maps?.places?.PlacesService) {
      setError(currentLocation ? translate('fcErrorNoGoogleMaps') : translate('fcErrorLocation'));
      setLoadingServices(false);
      return;
    }
    setLoadingServices(true);
    setError(null);
    clearMarkers();
    clearDirections();
    setResults([]);
    setActiveMarkerIndex(null);
    setDistanceMatrixResults({});

    const placesService = new window.google.maps.places.PlacesService(mapInstanceRef.current);
    const request: google.maps.places.TextSearchRequest = {
        query: query,
        location: currentLocation,
        radius: SEARCH_RADIUS_METERS,
        language: translate('languageCodeForAPI', {default: 'en'}),
        region: translate('regionCodeForAPI', {default: 'IN'}), 
    };

    try {
        placesService.textSearch(request, (results, status) => {
            setLoadingServices(false);
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                setResults(results);
                if (results.length > 0) {
                    const newDistanceMatrixResults: Record<string, { distance: string, duration: string }> = {};
                    // Fetch distance matrix for results
                    const distanceMatrixService = new window.google.maps.DistanceMatrixService();
                    // Filter out results without location geometry before creating destinations array
                    const validResults = results.filter(p => p.geometry?.location !== undefined);
                    const origins = [currentLocation];
                    const destinations = validResults.map(p => p.geometry!.location!) as google.maps.LatLng[];

                    if (destinations.length > 0) {
                        distanceMatrixService.getDistanceMatrix({
                            origins: origins,
                            destinations: destinations,
                            travelMode: google.maps.TravelMode.DRIVING,
                            unitSystem: google.maps.UnitSystem.METRIC, // Or IMPERIAL, depending on preference
                        }, (matrixResponse, matrixStatus) => {
                            if (matrixStatus === google.maps.DistanceMatrixStatus.OK && matrixResponse?.rows[0]?.elements) {
                                matrixResponse.rows[0].elements.forEach((element, index) => {
                                    const correspondingResult = validResults[index];
                                    if (element.status === 'OK' && correspondingResult?.place_id) {
                                        newDistanceMatrixResults[correspondingResult.place_id] = {
                                            distance: element.distance?.text || 'N/A',
                                            duration: element.duration?.text || 'N/A',
                                        };
                                    } else if (correspondingResult?.place_id) {
                                         newDistanceMatrixResults[correspondingResult.place_id] = { distance: 'N/A', duration: 'N/A' };
                                        console.error(`Distance Matrix Error for ${correspondingResult.name || 'a result'}: `, element.status);
                                    }
                                });
                                setDistanceMatrixResults(newDistanceMatrixResults);
                            } else {
                                console.error('Distance Matrix Error:', matrixStatus);
                                // Only set error if it's not a ZERO_RESULTS status, which is handled by performSearch
                                if (matrixStatus && (matrixStatus as string) !== 'ZERO_RESULTS') {
                                  setError(translate('fcErrorDistanceMatrix') + `: ${matrixStatus}`);
                                }
                            }
                        });
                    } else {
                        // No valid destinations to calculate distance matrix
                         setDistanceMatrixResults({});
                    }

                    results.forEach((p, idx) => {
                        if (p.geometry?.location) {
                            const marker = new window.google.maps.marker.AdvancedMarkerElement({
                                map: mapInstanceRef.current,
                                position: p.geometry.location,
                                title: p.name, 
                            });
                            placeMarkersRef.current.push(marker);
                            marker.addListener('click', () => {
                                setActiveMarkerIndex(idx);
                                if(infoWindowRef.current) infoWindowRef.current.close();
                                const infoWindowContent = document.createElement('div');
                                infoWindowContent.className = 'p-2 max-w-xs';

                                // Fetch place details including photos
                                const placesService = new window.google.maps.places.PlacesService(mapInstanceRef.current!);
                                placesService.getDetails({
                                    placeId: p.place_id!,
                                    fields: ['name', 'formatted_address', 'rating', 'user_ratings_total', 'business_status', 'international_phone_number', 'website', 'opening_hours', 'photos', 'geometry']
                                }, (placeDetails, detailsStatus) => {
                                    if (detailsStatus === window.google.maps.places.PlacesServiceStatus.OK && placeDetails) {
                                        infoWindowContent.innerHTML = `
                                            <h3 class="font-semibold text-md text-green-700">${placeDetails.name || 'N/A'}</h3>
                                            ${placeDetails.photos && placeDetails.photos.length > 0 ?
                                                `<div class="mt-2 mb-2 overflow-x-auto flex space-x-2 pb-2">
                                                    ${placeDetails.photos.slice(0, 5).map(photo =>
                                                        `<img src="${photo.getUrl({ maxWidth: 100, maxHeight: 100 })}" class="h-20 w-20 object-cover rounded-md shadow-md" alt="Place photo"/>`
                                                    ).join('')}
                                                </div>` : ''}
                                            <p class="text-sm text-gray-600">${placeDetails.formatted_address || translate('addressNotAvailable')}</p>
                                            ${placeDetails.rating ? `<p class="text-sm text-gray-600">${translate('rating')}: ${placeDetails.rating} (${placeDetails.user_ratings_total || 0} ${translate('reviews')})</p>` : ''}
                                            ${placeDetails.business_status ? `<p class="text-sm text-gray-600">${translate('status')}: ${placeDetails.business_status}</p>` : ''}
                                            ${placeDetails.international_phone_number ? `<p class="text-sm text-gray-600">${translate('fcPhone', {default: 'Phone'})}: <a href="tel:${placeDetails.international_phone_number}" class="text-blue-600 hover:underline">${placeDetails.international_phone_number}</a></p>` : ''}
                                            ${placeDetails.website ? `<p class="text-sm text-gray-600">${translate('fcWebsite', {default: 'Website'})}: <a href="${placeDetails.website}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline truncate">${placeDetails.website}</a></p>` : ''}
                                            ${placeDetails.opening_hours?.weekday_text ? `<div class="text-sm text-gray-600 mt-1">${translate('fcOpeningHours', {default: 'Opening Hours'})}:<ul class="list-disc list-inside pl-2">${placeDetails.opening_hours.weekday_text.map(hour => `<li>${hour}</li>`).join('')}</ul></div>` : ''}
                                        `;
                                        if (directionsServiceRef.current && directionsRendererRef.current && placeDetails.geometry?.location) {
                                            const directionsButton = document.createElement('button');
                                            directionsButton.className = "mt-2 px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600";
                                            directionsButton.textContent = translate('fcShowRoute');
                                            directionsButton.onclick = () => fetchDirections(placeDetails.geometry!.location!);
                                            infoWindowContent.appendChild(directionsButton);
                                        }

                                        infoWindowRef.current = new window.google.maps.InfoWindow({ content: infoWindowContent });
                                        infoWindowRef.current.open(mapInstanceRef.current!, marker);

                                    } else {
                                        // Fallback to basic info if details fetching fails
                                         infoWindowContent.innerHTML = `
                                            <h3 class="font-semibold text-md text-green-700">${p.name || 'N/A'}</h3>
                                            <p class="text-sm text-gray-600">${p.formatted_address || translate('addressNotAvailable')}</p>
                                         `;
                                         if (directionsServiceRef.current && directionsRendererRef.current && p.geometry?.location) {
                                            const directionsButton = document.createElement('button');
                                            directionsButton.className = "mt-2 px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600";
                                            directionsButton.textContent = translate('fcShowRoute');
                                            directionsButton.onclick = () => fetchDirections(p.geometry!.location!);
                                            infoWindowContent.appendChild(directionsButton);
                                        }
                                        infoWindowRef.current = new window.google.maps.InfoWindow({ content: infoWindowContent });
                                        infoWindowRef.current.open(mapInstanceRef.current!, marker);
                                        console.error('Fetching place details failed:', detailsStatus);
                                    }
                                });
                            });
                        }
                    });
                } else {
                    setError(translate('fcNoResults', { serviceName: categoryDefaultText }));
                }
            } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                 setError(translate('fcNoResults', { serviceName: categoryDefaultText }));
            } 
            else {
                console.error("Places API textSearch error status:", status);
                setError(`Places API Error: ${status}`);
            }
        });
    } catch (e) { 
        console.error("Places API textSearch initiation error:", e);
        setError(`Places API Error: ${e instanceof Error ? e.message : String(e)}`);
        setLoadingServices(false);
    }
  }, [currentLocation, clearMarkers, clearDirections, translate, fetchDirections]);

  const handleSearchCategory = (category: MapSearchCategory) => {
    setSelectedCategory(category);
    const categoryName = translate(category.translationKey, { default: category.defaultText });
    performSearch(category.textQuery, categoryName);
  };

  const handleCustomSearch = () => {
    if (!customSearchQuery.trim()) {
        setError(translate('fcErrorCustomSearchEmpty'));
        return;
    }
    const customCategory: MapSearchCategory = {
        id: 'custom',
        translationKey: 'fcCustomSearch', 
        defaultText: customSearchQuery,
        textQuery: customSearchQuery,
    };
    setSelectedCategory(customCategory);
    performSearch(customSearchQuery, customSearchQuery);
  };

  // Add a function to retry geolocation
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError(translate('fcErrorLocation'));
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
        setCurrentLocation(loc);
        initMap(loc);
        setLoadingLocation(false);
      },
      (err) => {
        setError(translate('fcErrorLocation') + ` (${err.message}) ` + translate('fcEnableHighAccuracy'));
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Add a function to handle clicking a result in the list
  const handleResultClick = (idx: number) => {
    setActiveMarkerIndex(idx);
    setSelectedPlace(results[idx]);
    const marker = placeMarkersRef.current[idx];
    if (marker && marker.position && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(marker.position as google.maps.LatLng | google.maps.LatLngLiteral);
      google.maps.event.trigger(marker, 'click');
    }
  };

  const handleNavigate = (place: any) => {
    if (place.geometry?.location) {
      // Call fetchDirections to show route on the map
      fetchDirections(place.geometry.location);
      // Optionally, center the map on the destination
      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo(place.geometry.location);
      }
    } else {
      setError(translate('fcErrorNoLocationForRoute'));
    }
  };

  // Street View rendering
  useEffect(() => {
    if (showStreetView && streetViewPosition && window.google?.maps?.StreetViewPanorama) {
      const panorama = new window.google.maps.StreetViewPanorama(
        document.getElementById('street-view')!,
        {
          position: streetViewPosition,
          pov: { heading: 165, pitch: 0 },
          zoom: 1,
        }
      );
    }
  }, [showStreetView, streetViewPosition]);

  // Geofencing monitoring
  useEffect(() => {
    if (geofence && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(pos => {
        const dLat = geofence.center.lat - pos.coords.latitude;
        const dLng = geofence.center.lng - pos.coords.longitude;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng) * 111139; // rough meters
        setIsInsideGeofence(dist <= geofence.radius);
      });
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [geofence]);

  useEffect(() => {
    if (isInsideGeofence !== null) {
      alert(isInsideGeofence ? 'You are inside the geofence!' : 'You are outside the geofence!');
    }
  }, [isInsideGeofence]);

  if (loadingLocation && !currentLocation && !isMapApiLoaded) { // Show initial loading only if map API and location are pending
    return <div className="flex justify-center items-center h-full"><LoadingSpinner text={translate('fcMapInitializing')} size="lg"/></div>;
  }
   if (loadingLocation && !currentLocation && isMapApiLoaded) { // Map API loaded, but location is still pending
    return <div className="flex justify-center items-center h-full"><LoadingSpinner text={translate('fcFetchingLocation')} size="lg"/></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col h-full">
      <h2 className="text-3xl font-bold text-green-700 mb-2 text-center capitalize">
        {translate('farmerConnectTitle')}
      </h2>
      <p className="text-gray-600 mb-6 text-center max-w-2xl mx-auto">
        {translate('farmerConnectDescription')}
      </p>
      {/* Location Search Box and Use My Location Button */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-4">
        <input
          ref={autocompleteInputRef}
          type="text"
          placeholder="Search or select your location..."
          className="w-full max-w-md p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
        />
        <button
          onClick={handleUseMyLocation}
          className="px-4 py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition-colors"
        >
          📍 Use My Location
        </button>
      </div>
      {/* Category Filters with Icons */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {initialSearchCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleSearchCategory(cat)}
            disabled={loadingLocation || loadingServices || !currentLocation}
            className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-all truncate shadow-sm
              ${selectedCategory?.id === cat.id && selectedCategory.id !== 'custom' ?
                'bg-green-600 text-white ring-2 ring-green-700 ring-offset-2 scale-105' :
                'bg-green-100 text-green-700 hover:bg-green-200'}
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="text-xl">{categoryIcons[cat.id]}</span>
            {translate(cat.translationKey, { default: cat.defaultText })}
          </button>
        ))}
      </div>
      <Card className="mb-6">
        <h3 className="text-xl font-semibold text-green-700 mb-3 capitalize">
          {translate('searchFor')}:
        </h3>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={customSearchQuery}
            onChange={(e) => setCustomSearchQuery(e.target.value)}
            placeholder={translate('fcCustomSearchPlaceholder')}
            className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            onKeyDown={(e) => e.key === 'Enter' && handleCustomSearch()}
          />
          <button
            onClick={handleCustomSearch}
            disabled={loadingLocation || loadingServices || !customSearchQuery.trim() || !currentLocation}
            className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-md shadow-md hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {translate('fcCustomSearchButton')}
          </button>
        </div>
        {selectedCategory && (
          <p className="text-sm text-gray-500 italic">
            {translate('fcShowingResultsFor', {serviceName: translate(selectedCategory.translationKey, {default: selectedCategory.defaultText})})} - {translate('fcRadiusInfo', {radius: (SEARCH_RADIUS_METERS/1000).toString()})}
          </p>
        )}
      </Card>
      {loadingServices && <div className="my-2"><LoadingSpinner text={translate('fcSearchingServices', {serviceName: selectedCategory ? translate(selectedCategory.translationKey, {default:selectedCategory.defaultText}) : 'services'})} /></div>}
      {error && <div className="my-2"><Alert type="error" message={error} onClose={() => setError(null)} /></div>}
      {/* Map */}
      <div ref={mapDivRef} style={{ height: '50vh', minHeight: '400px', width: '100%' }} className="rounded-lg shadow-md bg-gray-200 mb-4 transition-all duration-500">
        {(!isMapApiLoaded || (loadingLocation && !currentLocation)) && (
          <div className="flex items-center justify-center h-full text-gray-500 p-4 animate-pulse">
            {translate('fcMapInitializing')} {translate('fcEnableHighAccuracy')}
          </div>
        )}
      </div>
      {/* Map Style Switcher */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <select
          value={mapStyle}
          onChange={e => setMapStyle(e.target.value as 'default' | 'dark' | 'satellite')}
          className="p-2 rounded border border-gray-300 shadow-sm"
        >
          <option value="default">Default</option>
          <option value="dark">Dark</option>
          <option value="satellite">Satellite</option>
        </select>
        {/* Street View Button */}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
          onClick={() => {
            setStreetViewPosition(currentLocation);
            setShowStreetView(true);
          }}
        >
          Street View
        </button>
        {/* Geofence Button */}
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded shadow hover:bg-purple-600"
          onClick={() => {
            setGeofence({ center: currentLocation, radius: 300 });
          }}
        >
          Set Geofence
        </button>
        {/* Show Alternatives Button */}
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-600"
          onClick={() => setShowAlternatives(v => !v)}
        >
          {showAlternatives ? 'Hide' : 'Show'} Alternative Routes
        </button>
        {/* Favorites Button */}
        <button
          className="px-4 py-2 bg-green-700 text-white rounded shadow hover:bg-green-800"
          onClick={() => setShowFavoritesModal(true)}
        >
          Show Favorites
        </button>
      </div>
      {/* Results List */}
      {results.length > 0 && (
        <Card className="mb-4 animate-fade-in">
          <h4 className="text-lg font-semibold text-green-700 mb-2">Nearby Results</h4>
          <ul className="divide-y divide-green-100 max-h-80 overflow-y-auto">
            {results.map((result, idx) => (
              <li
                key={result.place_id}
                className={`p-3 cursor-pointer transition-all rounded hover:bg-green-50 ${activeMarkerIndex === idx ? 'bg-green-100 scale-105' : ''}`}
                onClick={() => handleResultClick(idx)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{categoryIcons[selectedCategory?.id || 'markets']}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-green-800">{result.name}</div>
                    <div className="text-sm text-gray-600">{result.formatted_address}</div>
                    {result.rating && (
                      <div className="text-xs text-yellow-600">⭐ {result.rating} ({result.user_ratings_total || 0} reviews)</div>
                    )}
                    {result.place_id && distanceMatrixResults && (distanceMatrixResults as Record<string, { distance: string, duration: string }>)[result.place_id] && (
                      <div className="text-sm text-gray-700 mt-1">
                        {translate('fcDistance', { default: 'Distance' })}: {(distanceMatrixResults as Record<string, { distance: string, duration: string }>)[result.place_id].distance} | {translate('fcDuration', { default: 'Duration' })}: {(distanceMatrixResults as Record<string, { distance: string, duration: string }>)[result.place_id].duration}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); handleNavigate(result); }}
                    className="ml-auto px-4 py-2 bg-blue-600 text-white text-base rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold"
                    style={{ minWidth: 120 }}
                  >
                    Navigate
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      const favs = JSON.parse(localStorage.getItem('fcFavorites') || '[]');
                      if (!favs.find((f: any) => f.place_id === result.place_id)) {
                        favs.push(result);
                        localStorage.setItem('fcFavorites', JSON.stringify(favs));
                        setFavorites(favs);
                      }
                    }}
                    className="ml-2 px-2 py-1 bg-yellow-400 text-white rounded text-xs hover:bg-yellow-500"
                  >
                    Save
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
      {routeInfo && (
        <Card className="mb-4">
          <div className="flex justify-between items-center">
            <p className="text-md font-semibold text-green-700">
              {translate('fcRouteInfo', {distance: routeInfo.distance, duration: routeInfo.duration})}
            </p>
            <button
              onClick={clearDirections}
              className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              {translate('fcClearRoute')}
            </button>
          </div>
        </Card>
      )}
      {/* Sticky mobile navigation button */}
      {selectedPlace && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex justify-center items-center bg-white/95 border-t border-green-200 py-3 shadow-lg">
          <button
            onClick={() => handleNavigate(selectedPlace)}
            className="w-11/12 max-w-md mx-auto py-4 bg-blue-600 text-white text-xl font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
            style={{ fontSize: 22 }}
          >
            <svg className="w-7 h-7 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-9.456 3.181a1 1 0 00-.362 1.686l7.07 7.07a1 1 0 001.686-.362l3.181-9.456a1 1 0 00-1.119-1.119z" /></svg>
            Navigate with Google Maps
          </button>
        </div>
      )}
      {showStreetView && streetViewPosition && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col items-center justify-center">
          <div className="w-full max-w-3xl h-[60vh] bg-white rounded shadow-lg relative">
            <button
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => setShowStreetView(false)}
            >
              Close
            </button>
            <div id="street-view" className="w-full h-full rounded" />
          </div>
        </div>
      )}
      {showFavoritesModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => setShowFavoritesModal(false)}
            >
              Close
            </button>
            <h3 className="text-xl font-bold mb-4 text-green-700">Favorites</h3>
            {favorites.length === 0 ? (
              <div className="text-gray-500">No favorites saved.</div>
            ) : (
              <ul className="divide-y divide-green-100 max-h-80 overflow-y-auto">
                {favorites.map((fav, idx) => (
                  <li key={fav.place_id} className="p-3 flex items-center justify-between">
                    <div className="flex-1 cursor-pointer" onClick={() => {
                      setShowFavoritesModal(false);
                      setCurrentLocation({ lat: fav.geometry.location.lat, lng: fav.geometry.location.lng });
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.panTo({ lat: fav.geometry.location.lat, lng: fav.geometry.location.lng });
                        mapInstanceRef.current.setZoom(16);
                      }
                    }}>
                      <div className="font-semibold text-green-800">{fav.name}</div>
                      <div className="text-sm text-gray-600">{fav.formatted_address}</div>
                    </div>
                    <button
                      className="ml-2 px-2 py-1 bg-red-400 text-white rounded text-xs hover:bg-red-500"
                      onClick={e => {
                        e.stopPropagation();
                        const newFavs = favorites.filter(f => f.place_id !== fav.place_id);
                        setFavorites(newFavs);
                        localStorage.setItem('fcFavorites', JSON.stringify(newFavs));
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {loadingRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white px-6 py-4 rounded shadow text-green-700 font-bold text-lg">Loading route...</div>
        </div>
      )}
    </div>
  );
};

export default FarmerConnectPage;
