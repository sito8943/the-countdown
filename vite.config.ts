import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
// Served from https://sito8943.github.io/the-countdown/ on GitHub Pages,
// so the production build needs that subpath as its base. Dev stays at '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/the-countdown/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: {
        name: 'The Countdown',
        short_name: 'Countdown',
        description: 'Un countdown compartido para dos.',
        theme_color: '#863bff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
}))
