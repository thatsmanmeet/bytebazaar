import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

const __dirname = path.resolve();
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8002',
        changeOrigin: true,
        secure: false,
        // Remove the rewrite if your backend expects the '/api' prefix
      },
      '/uploads': {
        target: 'http://localhost:8002',
        changeOrigin: true,
      },
    },
  },
});
