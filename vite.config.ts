import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use `src` as the dev root so we don't clash with repo index.html used for Pages
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    port: 5173
  }
}))
