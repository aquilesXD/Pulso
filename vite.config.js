import path from 'path'
import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const base44Plugin = process.env.VITE_BASE44_APP_BASE_URL ? base44({
  legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
  hmrNotifier: true,
  navigationNotifier: true,
  analyticsTracker: true,
  visualEditAgent: true
}) : null;

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: process.env.VITE_BASE44_APP_BASE_URL ? '/' : './',
  logLevel: 'error',
  plugins: [
    base44Plugin,
    react(),
  ].filter(Boolean),
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});