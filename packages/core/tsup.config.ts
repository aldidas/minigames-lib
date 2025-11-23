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
  globalName: 'MinigameCore',
  target: 'es2020',
  esbuildOptions(options) {
    options.charset = 'utf8';
  },
});
