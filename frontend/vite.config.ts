import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { appShellCache } from './build/appShellCache.mjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), appShellCache()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split vendor code into stable long-lived cache chunks.
        // React/router/axios rarely change → users keep cached versions across deploys.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react'
            }
            if (id.includes('axios')) {
              return 'vendor-http'
            }
            if (id.includes('bootstrap')) {
              return 'vendor-bootstrap'
            }
          }
        },
      },
    },
  },
})
