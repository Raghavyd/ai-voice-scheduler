import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // ✅ Required for Vercel root deployment
  base: "/",

  build: {
    outDir: "dist",
    sourcemap: false,
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // avoid warning spam
  },

  server: {
    port: 5173,
    open: true,
  },

  preview: {
    port: 5173,
  },
});