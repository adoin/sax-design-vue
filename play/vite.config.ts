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
import baseConfig from '../vite.config'

import './vite.init'

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
    resolve: {
      alias: [
        {
          find: /^vuesax-alpha(\/(es|lib))?$/,
          replacement: path.resolve(vsRoot, 'index.ts'),
        },
        {
          find: /^vuesax-alpha\/(es|lib)\/(.*)$/,
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
        include: `${__dirname}/**`,
        resolvers: VuesaxAlphaResolver({ importStyle: 'sass' }),
        dts: false,
      }),
      mkcert(),
      Inspect(),
    ],
    optimizeDeps: {
      include: ['vue', '@vue/shared', ...dependencies, ...optimizeDeps],
    },
  })
})
