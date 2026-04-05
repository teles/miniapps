import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  root: 'src',
  build: {
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL('./src/index.html', import.meta.url)),
        dailyPomodoro: fileURLToPath(new URL('./src/miniapps/daily-pomodoro/index.html', import.meta.url)),
        emojiRemover: fileURLToPath(new URL('./src/miniapps/emoji-remover/index.html', import.meta.url))
      }
    },
    outDir: '../dist',
    emptyOutDir: true
  }
})
