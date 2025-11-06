// src/types/googlemaps.d.ts

// Extend the global google.maps namespace to add missing types
declare namespace google {//hi
  namespace maps {
    namespace visualization {
      // Declare WeatherLayer if it's missing
      class WeatherLayer extends google.maps.OverlayView {
        constructor(options?: google.maps.visualization.WeatherLayerOptions);
        setMap(map: google.maps.Map | null): void;
      }

      // Declare CloudLayer if it's missing
      class CloudLayer extends google.maps.OverlayView {
        constructor();
        setMap(map: google.maps.Map | null): void;
      }

      // Declare missing units if they are not in the current types
      enum TemperatureUnit {
        CELSIUS = 0,
        FAHRENHEIT = 1,
      }

      enum WindSpeedUnit {
        KILOMETERS_PER_HOUR = 0,
        METERS_PER_SECOND = 1,
        MPH = 2,
      }

      interface WeatherLayerOptions {
        clickable?: boolean;
        map?: google.maps.Map;
        temperatureUnit?: TemperatureUnit;
        windSpeedUnit?: WindSpeedUnit;
        windVelocityScale?: number;
        windVelocityUnits?: WindSpeedUnit; // Assuming it uses the same enum
      }
    }

    // Declare AdvancedMarkerElement and its missing methods if necessary
    namespace marker {
         class AdvancedMarkerElement extends google.maps.MVCObject {
             constructor(options?: google.maps.marker.AdvancedMarkerElementOptions);
             map: google.maps.Map | null; // Declare map property as it's commonly used
             position: google.maps.LatLng | google.maps.LatLngLiteral | null; // Declare position
             content: HTMLElement | null; // Declare content
             title: string | null; // Declare title
             // Add setMap if it's missing from the installed types
             setMap(map: google.maps.Map | null): void;
         }

         interface AdvancedMarkerElementOptions {
             map?: google.maps.Map | null;
             position?: google.maps.LatLng | google.maps.LatLngLiteral | null;
             content?: HTMLElement | null;
             title?: string | null;
         }
    }

  }
}

// Add other missing types or namespaces as needed based on further errors 
