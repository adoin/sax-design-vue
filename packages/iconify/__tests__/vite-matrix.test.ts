// @vitest-environment node

import { createRequire } from 'node:module'
import { mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getIconData, iconToSVG } from '@iconify/utils'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { saxIcons } from '../src/vite'

import type { IconifyJSON } from '@iconify/types'

const require = createRequire(import.meta.url)
const iconifyEntry = fileURLToPath(new URL('../src/index.ts', import.meta.url))
let fixtureRoot = ''
let apiBaseUrl = ''
let closeApiServer: (() => Promise<void>) | undefined

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

function outputCode(result: any) {
  const outputs = Array.isArray(result) ? result : [result]
  return outputs
    .flatMap((output) => output.output || [])
    .filter((item) => item.type === 'chunk')
    .map((item) => item.code)
    .join('\n')
}

beforeAll(async () => {
  fixtureRoot = await realpath(
    await mkdtemp(path.join(tmpdir(), 'sax-icon-vite-matrix-')),
  )
  await writeFile(
    path.join(fixtureRoot, 'index.html'),
    '<div id="app"></div><script type="module" src="/main.ts"></script>',
    'utf8',
  )
  await writeFile(
    path.join(fixtureRoot, 'main.ts'),
    `export const staticIconName = 'cb:add'
document.querySelector('#app')!.textContent = staticIconName
`,
    'utf8',
  )

  const filename = require.resolve('@iconify-json/carbon/icons.json')
  const collection = JSON.parse(await readFile(filename, 'utf8')) as IconifyJSON
  const server = createServer((request, response) => {
    const url = new URL(request.url || '/', 'http://127.0.0.1')
    const prefix = url.pathname.replace(/^\/+|\.json$/g, '')
    const names = (url.searchParams.get('icons') || '').split(',').filter(Boolean)
    const icons: IconifyJSON['icons'] = {}

    names.forEach((name) => {
      const data = getIconData(collection, name)
      if (data) icons[name] = data
    })
    response.writeHead(200, { 'content-type': 'application/json' })
    response.end(
      JSON.stringify({
        prefix,
        width: collection.width,
        height: collection.height,
        icons,
      }),
    )
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address() as AddressInfo
  apiBaseUrl = `http://127.0.0.1:${address.port}`
  closeApiServer = () =>
    new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
})

afterAll(async () => {
  if (closeApiServer) await closeApiServer()
  if (fixtureRoot) await rm(fixtureRoot, { recursive: true, force: true })
})

describe.each([
  ['Vite 4', 'vite4'],
  ['Vite 5', 'vite5'],
  ['Vite 8', 'vite'],
])('%s compatibility', (_label, packageName) => {
  const buildFixture = async (mode: 'local' | 'api') => {
    const { build } = await import(packageName)
    const result = await build({
      configFile: false,
      root: fixtureRoot,
      logLevel: 'silent',
      resolve: {
        alias: {
          'sax-design-vue-iconify': iconifyEntry,
        },
      },
      plugins: [
        saxIcons({
          collections: { cb: 'carbon' },
          safelist: ['cb:notification'],
          mode,
          api:
            mode === 'api'
              ? { baseUrl: apiBaseUrl, cacheDir: false }
              : undefined,
        }),
      ],
      build: {
        minify: false,
        write: false,
      },
    })
    return outputCode(result)
  }

  const expectTreeShakenIcons = async (code: string) => {
    expect(code).toContain(await iconPath('add'))
    expect(code).toContain(await iconPath('notification'))
    expect(code).not.toContain(await iconPath('accessibility'))
    expect(code).not.toContain('"prefix":"carbon"')
  }

  it('builds tree-shaken icons from installed JSON', async () => {
    await expectTreeShakenIcons(await buildFixture('local'))
  })

  it('builds tree-shaken icons from the API', async () => {
    await expectTreeShakenIcons(await buildFixture('api'))
  })
})
