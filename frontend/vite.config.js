import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Required so assets work on Vercel
  base: "/",

  build: {
    outDir: "dist",
    sourcemap: false,
    emptyOutDir: true,
  },

  server: {
    port: 5173,
  },

  preview: {
    port: 5173,
  },
});