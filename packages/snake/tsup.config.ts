import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  outDir: 'dist',
  dts: true,
  sourcemap: true,
  minify: true,
  clean: true,
  splitting: false,
  globalName: 'MinigameSnake',
  target: 'es2020',
  external: ['@minigame/core'],
  esbuildOptions(options) {
    options.charset = 'utf8';
  },
});
