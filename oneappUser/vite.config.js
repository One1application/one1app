import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss()
  ],
  base: '/user/',
  server: {
    host: true,
    port: 5174,
    watch: {
      usePolling: true,
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase limit for larger chunks
  }
})
