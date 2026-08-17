// @vitest-environment node

import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_API_ENDPOINTS } from '../src'
import { saxIcons } from '../src/vite'

const config = {
  collections: { cb: 'carbon' },
  safelist: ['cb:notification'],
}

function hook<T extends (...args: any[]) => any>(value: unknown): T {
  if (typeof value !== 'function') throw new TypeError('Expected Vite hook')
  return value as T
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('saxIcons', () => {
  it('exports the three selectable default API endpoints', () => {
    expect(DEFAULT_API_ENDPOINTS).toEqual([
      'https://api.iconify.design',
      'https://api.simplesvg.com',
      'https://api.unisvg.com',
    ])
  })

  it.each(DEFAULT_API_ENDPOINTS)(
    'uses the selected default API endpoint: %s',
    async (baseUrl) => {
      const fetchIcon = vi.fn(async (input: string | URL | Request) => {
        expect(String(input)).toBe(`${baseUrl}/carbon.json?icons=add`)
        return new Response(
          JSON.stringify({
            prefix: 'carbon',
            width: 32,
            height: 32,
            icons: {
              add: { body: '<path d="M1 1h30v30H1z" />' },
            },
          }),
          { status: 200, headers: { 'content-type': 'application/json' } },
        )
      })
      vi.stubGlobal('fetch', fetchIcon)

      const plugin = saxIcons({
        collections: { cb: 'carbon' },
        mode: 'api',
        api: { baseUrl, cacheDir: false },
      })
      const resolveId = hook<(id: string) => any>(plugin.resolveId)
      const load = hook<(id: string) => any>(plugin.load)
      const id = await resolveId('virtual:sax-icon/cb%3Aadd')

      expect(await load(id)).toContain('M1 1h30v30H1z')
      expect(fetchIcon).toHaveBeenCalledTimes(1)
    },
  )

  it('injects SVG data imports for static icon names', async () => {
    const plugin = saxIcons(config)
    const transform = hook<(code: string, id: string) => any>(plugin.transform)
    const result = await transform(
      '<template><s-icon name="cb:add" /></template>',
      'StaticIcon.vue',
    )

    expect(result.code).toContain('virtual:sax-icon/cb%3Aadd')
    expect(result.code).toContain(':icon-data="__sax_icon_0"')
    expect(result.code).not.toContain('addIconDataRecord')
    expect(result.code).not.toContain('name="cb:add"')
  })

  it('loads one SVG record for a static virtual icon', async () => {
    const plugin = saxIcons(config)
    const resolveId = hook<(id: string) => any>(plugin.resolveId)
    const load = hook<(id: string) => any>(plugin.load)
    const id = await resolveId('virtual:sax-icon/cb%3Aadd')
    const moduleCode = await load(id)

    expect(moduleCode).toContain('export default')
    expect(moduleCode).toContain('<path')
    expect(moduleCode).not.toContain('notification')
  })

  it('registers icon names found in props and expressions per module', async () => {
    const plugin = saxIcons(config)
    const transform = hook<(code: string, id: string) => any>(plugin.transform)
    const result = await transform(
      "export const props = { icon: { default: 'cb:help' } }",
      'props.ts',
    )

    expect(result.code).toContain('virtual:sax-icon/cb%3Ahelp')
    expect(result.code).toContain('addIconDataRecord')
    expect(result.code).toContain('cb:help')
  })

  it('does not treat a dynamic name binding as a static icon name', async () => {
    const plugin = saxIcons(config)
    const transform = hook<(code: string, id: string) => any>(plugin.transform)
    const result = await transform(
      '<template><SIcon v-if="pane.icon" :name="pane.icon" /></template>',
      'DynamicIcon.vue',
    )

    expect(result).toBeUndefined()
  })

  it('registers only safelisted dynamic names', async () => {
    const plugin = saxIcons(config)
    const resolveId = hook<(id: string) => any>(plugin.resolveId)
    const load = hook<(id: string) => any>(plugin.load)
    const id = await resolveId('virtual:sax-icons/register')
    const moduleCode = await load(id)

    expect(moduleCode).toContain('cb:notification')
    expect(moduleCode).not.toContain('cb:add')
    expect(moduleCode).toContain('addIconDataRecord')
  })

  it('automatically injects the dynamic registry into Vite HTML entries', () => {
    const plugin = saxIcons(config)
    const tags = plugin.transformIndexHtml.handler()

    expect(tags).toEqual([
      {
        tag: 'script',
        attrs: {
          type: 'module',
          src: 'virtual:sax-icons/register',
        },
        injectTo: 'head-prepend',
      },
    ])
    expect(plugin.transformIndexHtml.order).toBe('pre')
  })

  it('allows automatic registry injection to be disabled', () => {
    const plugin = saxIcons({ ...config, autoRegister: false })

    expect(plugin.transformIndexHtml.handler()).toBeUndefined()
  })

  it('fetches used icons in API mode and reuses the disk cache', async () => {
    const cacheDir = await mkdtemp(path.join(tmpdir(), 'sax-icon-api-cache-'))
    const apiConfig = {
      collections: { cb: 'carbon' },
      mode: 'api' as const,
      api: {
        baseUrl: 'https://icons.example.test',
        cacheDir,
      },
    }
    const fetchIcon = vi.fn(async (input: string | URL | Request) => {
      expect(String(input)).toBe(
        'https://icons.example.test/carbon.json?icons=add',
      )
      return new Response(
        JSON.stringify({
          prefix: 'carbon',
          width: 32,
          height: 32,
          icons: {
            add: { body: '<path d="M1 1h30v30H1z" />' },
          },
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      )
    })
    vi.stubGlobal('fetch', fetchIcon)

    try {
      const plugin = saxIcons(apiConfig)
      const resolveId = hook<(id: string) => any>(plugin.resolveId)
      const load = hook<(id: string) => any>(plugin.load)
      const id = await resolveId('virtual:sax-icon/cb%3Aadd')
      const moduleCode = await load(id)

      expect(moduleCode).toContain('M1 1h30v30H1z')
      expect(fetchIcon).toHaveBeenCalledTimes(1)

      const cacheFile = path.join(
        cacheDir,
        'https-icons.example.test',
        'carbon',
        'add.json',
      )
      expect(
        JSON.parse(await readFile(cacheFile, 'utf8')).icons.add,
      ).toBeTruthy()

      const cachedFetch = vi.fn(() => {
        throw new Error('Disk cache should prevent a second request')
      })
      vi.stubGlobal('fetch', cachedFetch)
      const cachedPlugin = saxIcons(apiConfig)
      const cachedResolveId = hook<(id: string) => any>(cachedPlugin.resolveId)
      const cachedLoad = hook<(id: string) => any>(cachedPlugin.load)
      const cachedId = await cachedResolveId('virtual:sax-icon/cb%3Aadd')

      expect(await cachedLoad(cachedId)).toContain('M1 1h30v30H1z')
      expect(cachedFetch).not.toHaveBeenCalled()
    } finally {
      await rm(cacheDir, { recursive: true, force: true })
    }
  })
})
