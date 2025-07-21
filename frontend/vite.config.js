// frontend/vite.config.js - Mis à jour avec headers de sécurité
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    headers: {
      // CSP - Content Security Policy
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https: http:; connect-src 'self' http://localhost:3000 https:; frame-ancestors 'none';",

      // Anti-clickjacking
      'X-Frame-Options': 'DENY',

      // Protection contre les attaques Spectre
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-site',

      // Permissions Policy
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=(), ambient-light-sensor=(), autoplay=(), encrypted-media=(), fullscreen=(self), picture-in-picture=()',

      // X-Content-Type-Options
      'X-Content-Type-Options': 'nosniff',

      // Autres headers de sécurité
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-XSS-Protection': '1; mode=block'
    }
  },
  preview: {
    headers: {
      // Mêmes headers pour la preview (production)
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https: http:; connect-src 'self' http://localhost:3000 https:; frame-ancestors 'none';",
      'X-Frame-Options': 'DENY',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-site',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=(), ambient-light-sensor=(), autoplay=(), encrypted-media=(), fullscreen=(self), picture-in-picture=()',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-XSS-Protection': '1; mode=block'
    }
  },
  build: {
    // Optimisation pour réduire les "suspicious comments"
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      format: {
        comments: false // Supprimer tous les commentaires
      }
    }
  }
})