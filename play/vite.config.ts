import path from 'path'
import { defineConfig, loadEnv, mergeConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import Inspect from 'vite-plugin-inspect'
import mkcert from 'vite-plugin-mkcert'
import glob from 'fast-glob'
import {
  vsPackage,
  vsRoot,
  getPackageDependencies,
  pkgRoot,
  projRoot,
} from '@vuesax-alpha/build-utils'
import { VuesaxAlphaResolver } from '@vuesax-alpha/auto-import-resolver'
import baseConfig from '../vite.config.ts'

import './vite.init.ts'

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  let { dependencies } = getPackageDependencies(vsPackage)
  dependencies = dependencies.filter((dep) => !dep.startsWith('@types/'))
  const optimizeDeps = (
    await glob(['dayjs/(locale|plugin)/*.js'], {
      cwd: path.resolve(projRoot, 'node_modules'),
    })
  ).map((dep) => dep.replace(/\.js$/, ''))

  return mergeConfig(baseConfig, {
    base: process.env.PLAY_BASE || '/',
    resolve: {
      alias: [
        {
          find: /^sax-design-vue(\/(es|lib))?$/,
          replacement: path.resolve(vsRoot, 'index.ts'),
        },
        {
          find: /^sax-design-vue\/(es|lib)\/(.*)$/,
          replacement: `${pkgRoot}/$2`,
        },
      ],
    },
    server: {
      host: true,
      https: !!env.HTTPS,
    },
    plugins: [
      Components({
        include: `${import.meta.dirname}/**`,
        resolvers: VuesaxAlphaResolver({ importStyle: 'sass' }),
        dts: false,
      }),
      mkcert(),
      Inspect(),
    ],
    optimizeDeps: {
      include: ['vue', '@vue/shared', ...dependencies, ...optimizeDeps],
    },
    build: {
      // The browser SFC compiler is an intentional, lazy-only editor chunk.
      // Keep warnings focused on unexpected initial or component-library growth.
      chunkSizeWarningLimit: 1024,
    },
  })
})
