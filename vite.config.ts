import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  // Configurações específicas para deploy no Netlify
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        }
      }
    }
  },
  // Configuração para lidar com rotas no Netlify
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  // Configuração para permitir CORS se necessário
  preview: {
    port: 3000,
    host: '0.0.0.0',
  }
});
