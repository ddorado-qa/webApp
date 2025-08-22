import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: false,
    allowedHosts: [
      'frontend',           // nombre del servicio Docker
      'localhost',          // para acceder desde host
    ],
  }
})
