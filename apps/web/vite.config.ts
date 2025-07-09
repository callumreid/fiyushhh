import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@lunchtime-smash/game-core': resolve(__dirname, '../../packages/game-core/src'),
      '@lunchtime-smash/fighters': resolve(__dirname, '../../packages/fighters/src'),
      '@lunchtime-smash/stages': resolve(__dirname, '../../packages/stages/src'),
      '@lunchtime-smash/systems': resolve(__dirname, '../../packages/systems/src'),
      '@lunchtime-smash/ui': resolve(__dirname, '../../packages/ui/src'),
    }
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['@babylonjs/core', '@babylonjs/loaders', '@babylonjs/materials']
  }
})