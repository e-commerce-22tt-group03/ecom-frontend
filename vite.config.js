import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1': {
        target: 'http://localhost:3001', // adjust if your BE runs elsewhere
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
