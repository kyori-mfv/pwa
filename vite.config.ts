import { resolve } from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
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
      "@": resolve(__dirname, "./src"),
      "@/components": resolve(__dirname, "./src/shared/components"),
      "@/ui": resolve(__dirname, "./src/shared/components/ui"),
      "@/utils": resolve(__dirname, "./src/shared/utils"),
      "@/hooks": resolve(__dirname, "./src/shared/hooks"),
      "@/types": resolve(__dirname, "./src/shared/types"),
      "@/services": resolve(__dirname, "./src/shared/services"),
      "@/tools": resolve(__dirname, "./src/tools"),
      "@/core": resolve(__dirname, "./src/core"),
      "@/app": resolve(__dirname, "./src/app"),
    },
  },
});
