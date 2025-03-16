import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase limit for larger chunks
    rollupOptions: {
      output: {
        manualChunks: {
          lottie: ["lottie-web", "@lottiefiles/react-lottie-player"], // Split Lottie into a separate chunk
        },
      },
    },
  },
});
