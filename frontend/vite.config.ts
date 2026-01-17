import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Cuando React diga "fetch('/api')", Vite lo mandará a XAMPP
      '/api': {
        target: 'http://localhost/sistema_pos/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})