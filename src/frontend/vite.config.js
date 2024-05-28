import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5500',
    }
  },
  build: {
    outDir: path.resolve(__dirname, '../frontend-build')
  }
})
