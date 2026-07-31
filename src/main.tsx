import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { App } from './App';
import './styles.css';
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://1234567890abcdef1234567890abcdef@o1234567.ingest.us.sentry.io/1234567", // DUMMY DSN - KULLANICI BURAYA KENDI GERCEK SENTRY DSN'INI GIREBILIR
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Tracing
  tracesSampleRate: 1.0, 
  // Session Replay
  replaysSessionSampleRate: 0.1, 
  replaysOnErrorSampleRate: 1.0, 
});

const rootElement = document.getElementById('app-root') || document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>
  );
}
