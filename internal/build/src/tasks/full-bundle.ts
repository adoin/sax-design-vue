import path from 'path'
import { rolldown } from 'rolldown'
import vue from '@vitejs/plugin-vue'
import VueMacros from 'unplugin-vue-macros/rolldown'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { parallel } from 'gulp'
import glob from 'fast-glob'
import { camelCase, upperFirst } from 'lodash-unified'
import {
  PKG_BRAND_NAME,
  PKG_CAMELCASE_LOCAL_NAME,
  PKG_CAMELCASE_NAME,
} from '@vuesax-alpha/build-constants'
import { localeRoot, vsOutput, vsRoot } from '@vuesax-alpha/build-utils'
import { version } from '../../../../packages/sax-design-vue/version'
import { VuesaxAlphaAlias } from '../plugins/vuesax-alpha-alias'
import {
  formatBundleFilename,
  generateExternal,
  withTaskName,
  writeBundles,
} from '../utils'
import { target } from '../build-info'
import { saxIcons } from '../../../../packages/iconify/src/vite'
import saxIconConfig from '../../../../sax-icons.config'
import type { TaskFunction } from 'gulp'

const banner = `/*! ${PKG_BRAND_NAME} v${version} */\n`

async function buildFullEntry(minify: boolean) {
  const plugins = [
    VuesaxAlphaAlias(),
    saxIcons(saxIconConfig),
    VueMacros({
      setupComponent: false,
      setupSFC: false,
      plugins: {
        vue: vue({
          isProduction: true,
        }),
        vueJsx: vueJsx(),
      },
    }),
  ]

  const bundle = await rolldown({
    input: path.resolve(vsRoot, 'index.ts'),
    plugins,
    resolve: {
      extensions: ['.mjs', '.js', '.json', '.ts'],
    },
    transform: {
      target,
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
    },
    external: await generateExternal({ full: true }),
    treeshake: true,
  })
  await writeBundles(bundle, [
    {
      format: 'umd',
      file: path.resolve(
        vsOutput,
        'dist',
        formatBundleFilename('index.full', minify, 'js'),
      ),
      exports: 'named',
      name: PKG_CAMELCASE_NAME,
      globals: {
        vue: 'Vue',
      },
      sourcemap: minify,
      minify,
      banner,
    },
    {
      format: 'esm',
      file: path.resolve(
        vsOutput,
        'dist',
        formatBundleFilename('index.full', minify, 'mjs'),
      ),
      sourcemap: minify,
      minify,
      banner,
    },
  ])
}

async function buildFullLocale(minify: boolean) {
  const files = await glob(`**/*.ts`, {
    cwd: path.resolve(localeRoot, 'lang'),
    absolute: true,
  })
  return Promise.all(
    files.map(async (file) => {
      const filename = path.basename(file, '.ts')
      const name = upperFirst(camelCase(filename))

      const bundle = await rolldown({
        input: file,
        transform: { target },
      })
      await writeBundles(bundle, [
        {
          format: 'umd',
          file: path.resolve(
            vsOutput,
            'dist/locale',
            formatBundleFilename(filename, minify, 'js'),
          ),
          exports: 'default',
          name: `${PKG_CAMELCASE_LOCAL_NAME}${name}`,
          sourcemap: minify,
          minify,
          banner,
        },
        {
          format: 'esm',
          file: path.resolve(
            vsOutput,
            'dist/locale',
            formatBundleFilename(filename, minify, 'mjs'),
          ),
          sourcemap: minify,
          minify,
          banner,
        },
      ])
    }),
  )
}

export const buildFull = (minify: boolean) => async () =>
  Promise.all([buildFullEntry(minify), buildFullLocale(minify)])

export const buildFullBundle: TaskFunction = parallel(
  withTaskName('buildFullMinified', buildFull(true)),
  withTaskName('buildFull', buildFull(false)),
)
