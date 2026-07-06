import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros/vite'

/**
 * Shared Vite 8 base config for the vuesax-alpha monorepo.
 * Workspace packages extend this config in their own vite.config.ts files.
 */
export default defineConfig({
  plugins: [
    VueMacros({
      setupComponent: false,
      setupSFC: false,
      plugins: {
        vue: vue(),
        vueJsx: vueJsx(),
      },
    }),
  ],
  esbuild: {
    target: 'chrome64',
  },
})
