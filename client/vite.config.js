import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Local dev: proxy API calls to the Express server
  server: {
    port: 5173,
    proxy: {
      '/api':     'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },

  build: {
    // Raise the warning threshold slightly (our bundle is naturally bigger with recharts)
    chunkSizeWarningLimit: 800,

    rollupOptions: {
      output: {
        // Manual code-splitting: vendor chunks load in parallel and cache independently
        manualChunks: {
          'vendor-react':    ['react', 'react-dom', 'react-router-dom'],
          'vendor-axios':    ['axios'],
          'vendor-charts':   ['recharts'],
        },
      },
    },
  },
});
