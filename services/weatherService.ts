import { WeatherData } from '../types';//hi
import { OPENWEATHERMAP_API_URL } from '../constants';

const API_KEY = "0d6452c35f1a3e57803d84a2ead53b58"; // Use the API Key provided by the user

export const fetchWeather = async (city: string): Promise<WeatherData | { error: string }> => {
  if (!API_KEY) { // Should not happen with hardcoded key, but good practice
    console.error("CRITICAL: OpenWeatherMap API Key is not set internally. This is a bug.");
    return { error: "Weather API Key not configured (internal error)." };
  }

  try {
    const response = await fetch(`${OPENWEATHERMAP_API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    if (!response.ok) {
      const errorData = await response.json();
      // Try to provide a more user-friendly message for common errors
      if (response.status === 401) {
        return { error: "Invalid Weather API Key. Please contact support." };
      }
      if (response.status === 404) {
        return { error: `City "${city}" not found. Please check the spelling.` };
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      city: data.name,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      rain: data.rain ? data.rain['1h'] : undefined, // Rain in the last 1 hour
      iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      coordinates: data.coord ? { lat: data.coord.lat, lon: data.coord.lon } : undefined,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return { error: error instanceof Error ? error.message : "Failed to fetch weather data due to a network or unexpected issue." };
  }
};
