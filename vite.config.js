/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// homepage is served from /react-riverflow on gh-pages
export default defineConfig({
    base: '/react-riverflow/',
    plugins: [react()],
    // allow JSX inside .js files (legacy CRA convention)
    esbuild: {
        loader: 'jsx',
        include: /src\/.*\.jsx?$/,
        exclude: [],
    },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  css: {
    preprocessorOptions: {
      sass: { quietDeps: true, silenceDeprecations: ['legacy-js-api'] },
      scss: { quietDeps: true, silenceDeprecations: ['legacy-js-api'] },
    },
  },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.js',
    },
});
