import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// The app manages scroll position itself - top of the page on navigation, or
// the element named by the hash. The browser's own restoration runs after the
// load event and would otherwise undo that on a deep link such as
// /guardrails#flaky.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container #root was not found in index.html');
}

createRoot(container).render(
  <StrictMode>
    {/* BASE_URL is '/' locally and the repository path on GitHub Pages. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
