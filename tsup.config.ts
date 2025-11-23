import { defineConfig } from 'tsup';

export default defineConfig({
  // Entry point
  entry: ['src/index.ts'],
  
  // Output formats
  format: ['esm', 'cjs', 'iife'],
  
  // Output directory
  outDir: 'dist',
  
  // TypeScript declarations
  dts: true, // Generate .d.ts files
  
  // Source maps
  sourcemap: true,
  
  // Minification
  minify: true,
  
  // Clean output directory before build
  clean: true,
  
  // Split chunks for better tree-shaking (ESM only)
  splitting: false,
  
  // Global name for IIFE build
  globalName: 'MinigameCore', // Change per package (e.g., MinigameSnake, MinigamePong)
  
  // Target
  target: 'es2020',
  
  // esbuild options
  esbuildOptions(options) {
    options.charset = 'utf8';
  },
});
