import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon-v2.png', 'mask-icon.svg'],
      manifest: {
        name: 'WePlan – Household Planning Made Simple',
        short_name: 'WePlan',
        description: 'Coordinate your home life with Shared Expense Tracking, Unified Tasks, and a Synchronized Shopping List.',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icon-v2-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-v2-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icon-v2-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-v2-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
})
