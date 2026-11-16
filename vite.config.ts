/// <reference types="vitest/config" />
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), !process.env.VITEST && reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    rollupOptions: {
      external: ['tslib'],
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./setupTests.ts'],
    include: ['app/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      include: ['app/**'],
    },
  },
})
