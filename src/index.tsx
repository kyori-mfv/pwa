/// <reference types="vite-plugin-pwa/client" />

import { registerSW } from "virtual:pwa-register";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

// Check build mode
declare const __BUILD_APP_ID__: string | undefined;
const buildAppId = typeof __BUILD_APP_ID__ !== "undefined" ? __BUILD_APP_ID__ : undefined;
const isBuildMode = Boolean(buildAppId);

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

// Bootstrap the application
async function bootstrapApp() {
  // Conditional tool registration based on mode
  if (isBuildMode && buildAppId) {
    // Individual mode - only load the specific tool
    switch (buildAppId) {
      case "json-formatter":
        await import("@/tools/json-formatter");
        break;
      case "indexeddb-crud":
        await import("@/tools/indexeddb-crud");
        break;
      case "jwt-decoder":
        await import("@/tools/jwt-decoder");
        break;
      case "text-compare":
        await import("@/tools/text-compare");
        break;
      case "expense-manager":
        await import("@/tools/expense-manager");
        break;
      default:
        console.warn(`Unknown build app ID: ${buildAppId}`);
    }
  } else {
    // Multi-app mode - load all tools
    await import("@/tools/json-formatter");
    await import("@/tools/indexeddb-crud");
    await import("@/tools/jwt-decoder");
    await import("@/tools/text-compare");
    await import("@/tools/expense-manager");
  }

  // Dynamically import the appropriate app component
  const AppComponent = isBuildMode
    ? (await import("@/app/individual")).IndividualApp
    : (await import("@/app/multi")).MultiApp;

  // Render the app
  const rootElement = document.getElementById("root");
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ThemeProvider>
          <AppComponent />
        </ThemeProvider>
      </React.StrictMode>
    );
  }
}

// Start the app
bootstrapApp().catch(console.error);
