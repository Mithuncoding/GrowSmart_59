import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';//hi

// The Gemini API key check is more robustly handled within geminiService.ts,
// where it prevents API calls if the key is missing.
// MapTiler is now used instead of Google Maps

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to. Make sure an element with id='root' exists in your HTML.");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
