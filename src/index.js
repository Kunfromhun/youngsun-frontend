import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// React DevTools WebSocket 비활성화
window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = { supportsFiber: true, inject: () => {} };
window.__REACT_DEVTOOLS_STRICT_MODE__ = false;

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);