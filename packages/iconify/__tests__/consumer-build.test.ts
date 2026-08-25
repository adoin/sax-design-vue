import { createRequire } from 'node:module'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { getIconData, iconToSVG } from '@iconify/utils'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { build } from 'vite'
import { saxIcons } from '../src/vite'

import type { IconifyJSON } from '@iconify/types'
import type { RolldownOutput } from 'rolldown'

const require = createRequire(import.meta.url)
let fixtureRoot = ''

async function iconPath(name: string) {
  const filename = require.resolve('@iconify-json/carbon/icons.json')
  const collection = JSON.parse(await readFile(filename, 'utf8')) as IconifyJSON
  const data = getIconData(collection, name)
  if (!data) throw new Error(`Missing Carbon test icon: ${name}`)
  const body = iconToSVG(data, { width: '1em', height: '1em' }).body
  const match = body.match(/d="([^"]+)/)
  if (!match) throw new Error(`Missing path data for Carbon test icon: ${name}`)
  return match[1].slice(0, 48)
}

beforeAll(async () => {
  fixtureRoot = await mkdtemp(path.join(tmpdir(), 'sax-icon-consumer-'))
  await writeFile(
    path.join(fixtureRoot, 'App.vue'),
    `<template>
  <SIcon name="cb:add" />
  <SIcon :name="backendIcon" />
</template>

<script setup lang="ts">
import { SIcon } from 'sax-design-vue'
declare const backendIcon: string
</script>
`,
    'utf8',
  )
  await writeFile(
    path.join(fixtureRoot, 'main.ts'),
    `import 'virtual:sax-icons/register'
export { default } from './App.vue'
`,
    'utf8',
  )
})

afterAll(async () => {
  if (fixtureRoot) await rm(fixtureRoot, { recursive: true, force: true })
})

describe('consumer production build', () => {
  it('emits static and safelisted SVGs without bundling unused collection data', async () => {
    const result = (await build({
      configFile: false,
      root: fixtureRoot,
      logLevel: 'silent',
      plugins: [
        saxIcons({
          collections: { cb: 'carbon' },
          safelist: ['cb:notification'],
        }),
        vue(),
      ],
      build: {
        minify: false,
        write: false,
        lib: {
          entry: path.join(fixtureRoot, 'main.ts'),
          formats: ['es'],
        },
        rolldownOptions: {
          external: ['vue', 'sax-design-vue'],
        },
      },
    })) as RolldownOutput | RolldownOutput[]

    const outputs = Array.isArray(result) ? result : [result]
    const code = outputs
      .flatMap((output) => output.output)
      .filter((item) => item.type === 'chunk')
      .map((item) => item.code)
      .join('\n')

    expect(code).toContain(await iconPath('add'))
    expect(code).toContain(await iconPath('notification'))
    expect(code).not.toContain(await iconPath('accessibility'))
    expect(code).not.toContain('"prefix":"carbon"')
  })
})
