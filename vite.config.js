import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Production optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          analytics: ['@vercel/analytics'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
})
