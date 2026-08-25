import { rolldown } from 'rolldown'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros/rolldown'
import glob from 'fast-glob'
import { excludeFiles, pkgRoot, vsRoot } from '@vuesax-alpha/build-utils'
import { generateExternal, writeBundles } from '../utils'
import { VuesaxAlphaAlias } from '../plugins/vuesax-alpha-alias'
import { buildConfigEntries, target } from '../build-info'
import { saxIcons } from '../../../../packages/iconify/src/vite'
import saxIconConfig from '../../../../sax-icons.config'

import type { OutputOptions } from 'rolldown'

export const buildModules = async () => {
  const input = excludeFiles(
    await glob('**/*.{js,ts,vue}', {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
      ignore: ['iconify/**'],
    }),
  )
  const bundle = await rolldown({
    input,
    plugins: [
      VuesaxAlphaAlias(),
      saxIcons(saxIconConfig),
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vue: vue({
            isProduction: false,
          }),
          vueJsx: vueJsx(),
        },
      }),
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.json', '.ts'],
    },
    transform: { target },
    external: await generateExternal({ full: false }),
    treeshake: false,
  })
  await writeBundles(
    bundle,
    buildConfigEntries.map(([module, config]): OutputOptions => {
      return {
        format: config.format,
        dir: config.output.path,
        exports: module === 'cjs' ? 'named' : undefined,
        preserveModules: true,
        preserveModulesRoot: vsRoot,
        sourcemap: true,
        entryFileNames: `[name].${config.ext}`,
      }
    }),
  )
}
