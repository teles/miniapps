import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  root: 'src',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      // Include the SVG icon so Workbox pre-caches it
      includeAssets: ['pwa-icon.svg'],
      manifest: {
        name: 'Minitools',
        short_name: 'Minitools',
        description: 'A collection of mini productivity tools',
        theme_color: '#6366f1',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Pre-cache all JS, CSS, HTML and SVG assets emitted by the build
        globPatterns: ['**/*.{js,css,html,svg}'],
        // For an MPA, navigate to the launcher when a route has no cached match
        navigateFallback: '/index.html',
        // Only apply the fallback to top-level navigation, not to assets
        navigateFallbackDenylist: [/^\/microapps\/.+\/.*\.\w+$/]
      }
    })
  ],
  build: {
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL('./src/index.html', import.meta.url)),
        dailyPomodoro: fileURLToPath(new URL('./src/microapps/daily-pomodoro/index.html', import.meta.url)),
        emojiRemover: fileURLToPath(new URL('./src/microapps/emoji-remover/index.html', import.meta.url))
      }
    },
    outDir: '../dist',
    emptyOutDir: true
  }
})
