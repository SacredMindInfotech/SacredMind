import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    postcss: {
      plugins: [require('postcss-preset-env')]
    }
  },
  esbuild: {
    target: 'esnext',
    platform: 'node',
  },
  optimizeDeps: {
    exclude: ['js-big-decimal']
  }
})
