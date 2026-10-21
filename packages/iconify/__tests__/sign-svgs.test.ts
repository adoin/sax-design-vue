// @vitest-environment node
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { EventEmitter } from 'node:events'
import { tmpdir } from 'node:os'
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { saxIcons, signSvgs } from '../src/vite'
import { getIconData } from '../src'

const directories: string[] = []
const tempBase = process.platform === 'win32' ? 'D:/tmp' : tmpdir()
let testRoot = ''
const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 24" fill="none"><defs><linearGradient id="paint"><stop stop-color="red"/><stop offset="1" stop-color="blue"/></linearGradient></defs><path fill="url(#paint)" d="M1 1h20v20z"/></svg>'
const runtime = fileURLToPath(new URL('../src/index.ts', import.meta.url))

beforeAll(async () => {
  await mkdir(tempBase, { recursive: true })
  testRoot = await mkdtemp(path.join(tempBase, 'sax-svg-tests-'))
})

afterAll(async () => {
  if (
    path.dirname(path.resolve(testRoot)) !== path.resolve(tempBase) ||
    !path.basename(testRoot).startsWith('sax-svg-tests-')
  )
    throw new Error('Invalid test root')
  await rm(testRoot, { recursive: true, force: true })
})

async function fixture() {
  await mkdir(testRoot, { recursive: true })
  const root = await mkdtemp(path.join(testRoot, 'case-'))
  directories.push(root)
  await mkdir(path.join(root, 'src/assets/svgs'), { recursive: true })
  await writeFile(path.join(root, 'src/assets/svgs/home.svg'), svg)
  await writeFile(
    path.join(root, 'src/assets/svgs/unused.svg'),
    '<svg viewBox="0 0 24 24"><path id="unused-never-shipped" d="M2 2h12"/></svg>',
  )
  await writeFile(
    path.join(root, 'index.html'),
    '<script type="module" src="/main.ts"></script>',
  )
  await writeFile(
    path.join(root, 'main.ts'),
    "import 'virtual:sax-svgs/register'; export const icon = 'lo-home'",
  )
  return root
}

afterEach(async () => {
  for (const directory of directories.splice(0)) {
    if (!path.resolve(directory).startsWith(path.resolve(testRoot) + path.sep))
      throw new Error('Invalid test cleanup path')
    await rm(directory, { recursive: true, force: true })
  }
})

describe('signSvgs', () => {
  it('registers dynamic local names in the shared SSR/runtime registry', async () => {
    const { createServer } = await import('vite')
    const server = await createServer({
      configFile: false,
      root: await fixture(),
      logLevel: 'silent',
      server: { middlewareMode: true, watch: null },
      resolve: { alias: { 'sax-design-vue-iconify': runtime } },
      plugins: [
        signSvgs([{ preset: 'lo', url: 'src/assets/svgs/*.svg' }], {
          safelist: ['lo-home'],
        }),
      ],
    })
    try {
      await server.ssrLoadModule('virtual:sax-svgs/register')
      expect(getIconData('lo-home')?.attributes.viewBox).toBe('0 0 32 24')
      expect(getIconData('lo-home')?.body).toContain('linearGradient')
    } finally {
      await server.close()
    }
  })
  it.each(['vite4', 'vite5', 'vite'])(
    'builds local SVGs without browser XML parsing on %s',
    async (version) => {
      const { build } = await import(version)
      const result = await build({
        configFile: false,
        root: await fixture(),
        logLevel: 'silent',
        resolve: { alias: { 'sax-design-vue-iconify': runtime } },
        plugins: [signSvgs([{ preset: 'lo', url: 'src/assets/svgs/*.svg' }])],
        build: { write: false, minify: false },
      })
      const code = result.output
        .filter((output: any) => output.type === 'chunk')
        .map((output: any) => output.code)
        .join('\n')
      expect(code).toContain('lo-home')
      expect(code).toContain('0 0 32 24')
      expect(code).toContain('linearGradient')
      expect(code).toContain('stop-color')
      expect(code).not.toContain('DOMParser')
      expect(code).not.toContain('fast-glob')
      expect(code).not.toContain('unused-never-shipped')
    },
  )

  it('loads selected files, derives a viewBox, and rejects duplicate names', async () => {
    const root = await fixture()
    const plugin = signSvgs([
      { preset: 'lo', url: 'src/assets/svgs/**/*.svg' },
    ]) as any
    plugin.configResolved({ root, plugins: [plugin] })
    const context = { addWatchFile: vi.fn() }
    const reset = () => plugin.configResolved({ root, plugins: [plugin] })
    const load = async (name: string) => {
      const registration = await plugin.load.call(
        context,
        `\0sax-svg/register/${name}`,
      )
      const hash = registration.code.match(
        /virtual:sax-svg\/data\/([a-f0-9]+)/,
      )[1]
      return plugin.load.call(context, `\0sax-svg/data/${hash}`)
    }
    expect((await load('lo-home')).code).toContain('linearGradient')
    await writeFile(
      path.join(root, 'src/assets/svgs/add.svg'),
      '<svg width="16px" height="20"><path d="M0 0h10"/></svg>',
    )
    reset()
    expect((await load('lo-add')).code).toContain('0 0 16 20')
    await rm(path.join(root, 'src/assets/svgs/home.svg'))
    reset()
    await expect(load('lo-home')).rejects.toThrow('Unknown local icon')
    await mkdir(path.join(root, 'src/assets/svgs/nested'))
    await writeFile(path.join(root, 'src/assets/svgs/nested/add.svg'), svg)
    reset()
    await expect(load('lo-add')).rejects.toThrow('Duplicate icon "lo-add"')
  })

  it('coexists with strict Iconify transforms in either plugin order', () => {
    const local = signSvgs([{ preset: 'lo', url: 'src/assets/svgs/*.svg' }])
    for (const plugins of [
      [local, saxIcons({ collections: { cb: 'carbon' } })],
      [saxIcons({ collections: { cb: 'carbon' } }), local],
    ]) {
      const iconify = plugins.find(
        (plugin) => plugin.name === 'sax-design-iconify',
      ) as any
      iconify.configResolved({ root: process.cwd(), plugins })
      expect(
        iconify.transform(
          '<template><s-icon name="lo-home"/></template>',
          'Page.vue',
        ),
      ).toBeUndefined()
      expect(() =>
        iconify.transform(
          '<template><s-icon name="missing:home"/></template>',
          'Page.vue',
        ),
      ).toThrow()
    }
  })

  it('invalidates registration on file add/change/delete and removes watcher listeners', async () => {
    const root = await fixture()
    const plugin = signSvgs([
      { preset: 'lo', url: 'src/assets/svgs/*.svg' },
    ]) as any
    plugin.configResolved({ root, plugins: [plugin] })
    const watcher = Object.assign(new EventEmitter(), { add: vi.fn() })
    const httpServer = new EventEmitter()
    const server = {
      watcher,
      httpServer,
      moduleGraph: { invalidateAll: vi.fn() },
      ws: { send: vi.fn() },
    }
    plugin.configureServer(server)
    for (const event of ['add', 'change', 'unlink'])
      watcher.emit(event, path.join(root, 'src/assets/svgs/home.svg'))
    expect(server.moduleGraph.invalidateAll).toHaveBeenCalledTimes(3)
    expect(server.ws.send).toHaveBeenCalledWith({ type: 'full-reload' })
    watcher.emit('change', path.join(root, 'other.svg'))
    expect(server.ws.send).toHaveBeenCalledTimes(3)
    httpServer.emit('close')
    expect(watcher.listenerCount('change')).toBe(0)
  })

  it('rejects invalid presets and malformed SVGs with useful file errors', async () => {
    expect(() => signSvgs([{ preset: 'Bad', url: '*.svg' }])).toThrow('preset')
    const root = await fixture()
    const plugin = signSvgs([
      { preset: 'lo', url: 'src/assets/svgs/*.svg' },
    ]) as any
    plugin.configResolved({ root, plugins: [plugin] })
    await writeFile(
      path.join(root, 'src/assets/svgs/home.svg'),
      '<svg viewBox="0 0 24 24"><path></svg>',
    )
    await expect(
      plugin.load.call({ addWatchFile() {} }, '\0sax-svg/register/lo-home'),
    ).rejects.toThrow('home.svg')
  })

  it('shares one SVG data module across files and presets with identical content', async () => {
    const { build } = await import('vite')
    const root = await fixture()
    await writeFile(path.join(root, 'src/assets/svgs/copy.svg'), svg)
    await writeFile(
      path.join(root, 'main.ts'),
      "export const icons = ['lo-home', 'lo-copy', 'brand-home']",
    )
    const result: any = await build({
      configFile: false,
      root,
      logLevel: 'silent',
      resolve: { alias: { 'sax-design-vue-iconify': runtime } },
      plugins: [
        signSvgs([
          { preset: 'lo', url: 'src/assets/svgs/*.svg' },
          { preset: 'brand', url: 'src/assets/svgs/home.svg' },
        ]),
      ],
      build: { write: false, minify: false },
    })
    const code = result.output
      .filter((entry: any) => entry.type === 'chunk')
      .map((entry: any) => entry.code)
      .join('\n')
    expect(code.match(/M1 1h20v20z/g)).toHaveLength(1)
    expect(code).toContain('brand-home')
    expect(code).toContain('lo-copy')
    expect(code).not.toContain('unused-never-shipped')
  })

  it('registers only safelisted dynamic names and supports the shared Iconify safelist', async () => {
    const { build } = await import('vite')
    const root = await fixture()
    await writeFile(
      path.join(root, 'main.ts'),
      'export const icon = globalThis.selectedIcon',
    )
    const result: any = await build({
      configFile: false,
      root,
      logLevel: 'silent',
      resolve: { alias: { 'sax-design-vue-iconify': runtime } },
      plugins: [
        signSvgs([{ preset: 'lo', url: 'src/assets/svgs/*.svg' }]),
        saxIcons({ collections: {}, safelist: ['lo-home'] }),
      ],
      build: { write: false, minify: false },
    })
    const code = result.output
      .filter((entry: any) => entry.type === 'chunk')
      .map((entry: any) => entry.code)
      .join('\n')
    expect(code).toContain('M1 1h20v20z')
    expect(code).not.toContain('unused-never-shipped')
  })
})
