import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros/vite'
import { saxIcons } from 'sax-design-vue-iconify/vite'
import saxIconConfig from './sax-icons.config.ts'

/**
 * Shared Vite 8 base config for the vuesax-alpha monorepo.
 * Workspace packages extend this config in their own vite.config.ts files.
 */
export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^sax-design-vue-iconify$/,
        replacement: fileURLToPath(
          new URL('./packages/iconify/src/index.ts', import.meta.url),
        ),
      },
    ],
  },
  plugins: [
    saxIcons(saxIconConfig),
    VueMacros({
      setupComponent: false,
      setupSFC: false,
      plugins: {
        vue: vue(),
        vueJsx: vueJsx(),
      },
    }),
  ],
  oxc: {
    target: 'chrome64',
  },
})
