/// <reference types="vite-plugin-pwa/client" />

import { URL, fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

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
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "Developer Tools PWA",
        short_name: "DevTools",
        description: "Essential developer utilities in a Progressive Web App",
        theme_color: "#000000",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@/components": fileURLToPath(new URL("./src/shared/components", import.meta.url)),
      "@/ui": fileURLToPath(new URL("./src/shared/components/ui", import.meta.url)),
      "@/utils": fileURLToPath(new URL("./src/shared/utils", import.meta.url)),
      "@/hooks": fileURLToPath(new URL("./src/shared/hooks", import.meta.url)),
      "@/types": fileURLToPath(new URL("./src/shared/types", import.meta.url)),
      "@/services": fileURLToPath(new URL("./src/shared/services", import.meta.url)),
      "@/tools": fileURLToPath(new URL("./src/tools", import.meta.url)),
      "@/core": fileURLToPath(new URL("./src/core", import.meta.url)),
      "@/app": fileURLToPath(new URL("./src/app", import.meta.url)),
    },
  },
});
