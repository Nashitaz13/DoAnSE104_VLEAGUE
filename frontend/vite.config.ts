import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      // Proxy API requests to backend running on localhost:8000
      // Adjust paths as needed by the frontend (e.g. /api, /auth)
      "/api": {
        target: "http://localhost:8001",
        changeOrigin: true,
        secure: false,
      },
      "/auth": {
        target: "http://localhost:8001",
        changeOrigin: true,
        secure: false,
      },
      "/openapi.json": {
        target: "http://localhost:8001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
