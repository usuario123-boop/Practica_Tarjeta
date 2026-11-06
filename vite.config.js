import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // base './' permite publicar en GitHub Pages con cualquier nombre de repositorio
  base: './',
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  build: { chunkSizeWarningLimit: 1200 },
  test: { environment: 'node' }
})
