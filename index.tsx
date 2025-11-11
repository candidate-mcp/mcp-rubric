// The iOS/WebKit fetch patch has been removed as it was causing fatal errors
// on platforms where `window.fetch` is immutable.
// The service worker has also been removed as it was causing registration
// errors in sandboxed environments. The app now calls the proxy directly.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
