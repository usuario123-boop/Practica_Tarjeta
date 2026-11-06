import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base './' permite publicar en GitHub Pages en cualquier nombre de repositorio
export default defineConfig({
  plugins: [vue()],
  base: './',
  build: { chunkSizeWarningLimit: 1500 }
})
