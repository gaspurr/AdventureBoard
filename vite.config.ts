import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// API is proxied so the browser never speaks to the third-party host directly,
// which sidesteps any CORS issues during local development.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://dragonsofmugloar.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
