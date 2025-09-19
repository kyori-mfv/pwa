/// <reference types="vite-plugin-pwa/client" />

import path from "node:path";
import { URL, fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Build mode configuration
const buildAppId = process.env.VITE_BUILD_APP_ID;

// App-specific configurations
const appConfigs: Record<
  string,
  { name: string; shortName: string; description: string; themeColor: string }
> = {
  "json-formatter": {
    name: "JSON Formatter",
    shortName: "JSON",
    description: "Format and validate JSON data",
    themeColor: "#10b981",
  },
  "text-compare": {
    name: "Text Compare",
    shortName: "TextDiff",
    description: "Compare texts with multiple algorithms",
    themeColor: "#3b82f6",
  },
  "indexeddb-crud": {
    name: "IndexedDB Manager",
    shortName: "IndexedDB",
    description: "Manage browser IndexedDB databases",
    themeColor: "#8b5cf6",
  },
  "jwt-decoder": {
    name: "JWT Decoder",
    shortName: "JWT",
    description: "Decode and validate JSON Web Tokens",
    themeColor: "#f59e0b",
  },
  "expense-manager": {
    name: "Expense Manager",
    shortName: "Expenses",
    description: "AI-powered expense tracking",
    themeColor: "#ef4444",
  },
};

const currentAppConfig = buildAppId ? appConfigs[buildAppId] : null;

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        cleanupOutdatedCaches: true,
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: currentAppConfig?.name || "Developer Tools PWA",
        short_name: currentAppConfig?.shortName || "DevTools",
        description:
          currentAppConfig?.description || "Essential developer utilities in a Progressive Web App",
        theme_color: currentAppConfig?.themeColor || "#1c1c1c",
        background_color: "#611c69",
        display: "standalone",
        scope: "/",
        start_url: buildAppId ? `/?app=${buildAppId}&build=true` : "/",
        icons: [
          {
            src: "maskable-icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    __BUILD_APP_ID__: JSON.stringify(buildAppId),
    __BUILD_MODE__: JSON.stringify(!!buildAppId),
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
});
