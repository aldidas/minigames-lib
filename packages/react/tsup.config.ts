import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  globalName: 'MinigameReact',
  external: ['react'],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
