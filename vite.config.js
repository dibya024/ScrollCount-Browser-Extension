import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  build: {
    rollupOptions: {
      input: {
        popup: resolve(import.meta.dirname, "index.html"),
        wellbeing: resolve(import.meta.dirname, "HomePage.html"),
      }
    }
  }
})
