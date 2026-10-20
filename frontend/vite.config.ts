import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { appShellCache } from './build/appShellCache.mjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), appShellCache()],
})
