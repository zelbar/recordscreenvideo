import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Treat legacy `.js` files that contain JSX as JSX.
  // This repo predates the convention of using `.jsx` extensions.
  esbuild: {
    jsx: 'automatic',
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
      jsx: 'automatic',
    },
  },
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.json'],
  },
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
    strictPort: true,
  },
});

