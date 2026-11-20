// Starts the website: loads the styles and shows the App.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles.css'
import './enhancements.css'
import './modern.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Registration happens after the initial page load and never blocks the UI.
// Keep API and clinical data online-only; the worker caches public build files.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  const registerUiCache = () => {
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
      .catch(() => { /* Browser caching still works if offline cache is unavailable. */ });
  };
  if (document.readyState === 'complete') registerUiCache();
  else window.addEventListener('load', registerUiCache, { once: true });
}
