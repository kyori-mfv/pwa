/// <reference types="vite-plugin-pwa/client" />

import { registerSW } from "virtual:pwa-register";
import { App } from "@/app";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

// Register tools
import "@/tools/json-formatter";
import "@/tools/indexeddb-crud";
import "@/tools/jwt-decoder";
import "@/tools/text-compare";
import "@/tools/expense-manager";

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
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
}
