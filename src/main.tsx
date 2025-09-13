/// <reference types="vite-plugin-pwa/client" />

import { registerSW } from "virtual:pwa-register";
import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

// Register service worker
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New content available. Reload?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("App ready to work offline");
  },
});

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <div className="min-h-screen bg-background text-foreground">
        <h1 className="text-2xl font-bold p-8">Developer Tools PWA</h1>
        <p className="px-8">Project initialized successfully!</p>
      </div>
    </React.StrictMode>
  );
}
