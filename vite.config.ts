import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Served from https://sito8943.github.io/the-countdown/ on GitHub Pages,
// so the production build needs that subpath as its base. Dev stays at '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/the-countdown/' : '/',
  plugins: [react()],
}))
