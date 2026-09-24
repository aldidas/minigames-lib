import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';

// Three pages, one artifact:
//   /          vanilla page  -> @minigame/core + the three game packages
//   /react/    React page    -> @minigame/react
//   /vue/      Vue page      -> @minigame/vue
//
// `base` stays '/' because Cloudflare Pages serves the project at the domain
// root. Set PUBLIC_BASE=/sub/path/ if the site is ever hosted under a subpath.
export default defineConfig({
  base: process.env.PUBLIC_BASE ?? '/',
  plugins: [react(), vue()],
  resolve: {
    // @minigame/react declares peerDependencies.react ^18, so pnpm installs a
    // React 18 copy inside packages/react. Without dedupe that copy is bundled
    // alongside this app's React 19 and hooks throw. Same idea for vue.
    dedupe: ['react', 'react-dom', 'vue'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: 'index.html',
        react: 'react/index.html',
        vue: 'vue/index.html',
      },
    },
  },
});
