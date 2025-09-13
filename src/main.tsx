/// <reference types="vite-plugin-pwa/client" />

import { registerSW } from "virtual:pwa-register";
import { AppShell } from "@/shared/components/layout/app-shell";
import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

// Register tools
import "@/tools/json-formatter";

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
      <AppShell />
    </React.StrictMode>
  );
}
