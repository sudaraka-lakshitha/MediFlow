import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { appShellCache } from './build/appShellCache.mjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), appShellCache()],
  build: {
    rollupOptions: {
      output: {
        // Split vendor code into stable long-lived cache chunks.
        // React/router/axios rarely change → users keep cached versions across deploys.
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-http': ['axios'],
          'vendor-bootstrap': ['bootstrap', 'bootstrap-icons'],
        },
      },
    },
  },
})
