import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This polyfills process.env so the code doesn't crash in the browser
    'process.env': {} 
  },
  server: {
    port: 3000,
    open: true
  }
})