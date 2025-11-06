export interface PlantDiagnosis {//hi
  plantName?: string; // Most likely plant species or common name
  plantEmoji?: string; // Emoji for the plant
  plantConfidencePercent?: number; // Confidence in plant identification (0-100)
  condition: string;
  diseaseName: string;
  careSuggestions: string[] | string; // Can be an array for bullet points or a single string
  confidenceLevel: string;
  confidencePercent?: number; // Confidence in disease diagnosis (0-100)
  statusTag?: 'Healthy' | 'Diseased' | 'NeedsAttention' | 'Unknown'; // For UI styling
  error?: string; // Error message from Gemini or parsing
}

export interface ScanResult {
  id: string;
  timestamp: number;
  imagePreviewUrl: string;
  diagnosis: PlantDiagnosis;
  originalPrompt: string;
}

export interface EncyclopediaEntry {
  plantName?: string; // Might not be returned if plant not found by AI
  summary?: string;
  sunlight?: string;
  watering?: string;
  care?: string;
  commonDiseases?: string;
  error?: string; // Error message from Gemini or parsing
}

export interface CropInsight {
  district: string;
  month: string;
  suitableCrops: string[];
  tips: string;
  climatePatterns: string;
  allCrops?: string[];
  error?: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  rain?: number; // mm in the last hour
  iconUrl?: string;
  city: string;
  coordinates?: { // Added for Google Maps integration
    lat: number;
    lon: number;
  };
}

export interface FarmingAdvice {
  advice: string;
  error?: string;
}

export interface GreenGramPost {
  id: string;
  imageUrl: string;
  caption: string;
  timestamp: number;
}

// For Gemini API image parts
export interface ImagePart {
  inlineData: {
    mimeType: string;
    data: string; // base64 encoded string
  };
}

export type LanguageCode = 'en' | 'kn' | 'hi';

export interface Translations {
  [key: string]: string;
}

export interface LanguagePack {
  [langCode: string]: Translations;
}

export interface MapSearchCategory {
  id: string;
  translationKey: string;
  defaultText: string;
  // Keywords for text search, or a specific Place Type string
  // For searchByText, this will be the `textQuery`.
  // Can also include a more specific Google Place Type for filtering if applicable.
  textQuery: string; 
  placeType?: string; // Optional: e.g., 'supermarket', 'hardware_store' for more precise filtering.
  icon?: React.ReactNode; 
}

export interface RouteInfo {
  distance: string;
  duration: string;
}

export interface FertPestQuantityItem {
  name: string;
  per_acre: number; // quantity per acre (decimal)
  unit: string; // e.g., 'kg', 'L'
  total: number; // total for all acres (decimal)
}

export interface FertPestQuantitiesAIResponse {
  fertilizers: FertPestQuantityItem[];
  pesticides: FertPestQuantityItem[];
  error?: string;
}
