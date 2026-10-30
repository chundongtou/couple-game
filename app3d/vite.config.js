import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: '../3d',
    emptyOutDir: true,
    assetsDir: 'assets',
    target: 'es2020',
    sourcemap: false
  }
});
