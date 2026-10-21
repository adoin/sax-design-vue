// @vitest-environment node
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { saxIcons } from 'sax-design-vue-iconify/vite'
import { documentationIconsPlugin } from '../../docs/.vuepress/node/devIcons'

describe('documentation icon transport', () => {
  it('batches exactly the original data and keeps new icons working during HMR', async () => {
    const options = {
      collections: { bx: 'bx', cb: 'carbon' },
      safelist: ['bx:home', 'cb:checkmark'],
    }
    const original = saxIcons(options)
    const plugin = documentationIconsPlugin(options)
    const config = { root: resolve(__dirname, '../..'), command: 'serve' }
    original.configResolved(config)
    plugin.configResolved(config)
    const id = plugin.resolveId('virtual:sax-icons/register')!
    const registry = (await plugin.load(id))!
    expect(registry).not.toContain("from 'virtual:sax-icon/")
    for (const [index, name] of options.safelist.entries()) {
      const iconId = original.resolveId(
        `virtual:sax-icon/${encodeURIComponent(name)}`,
      )!
      const data = (await original.load(iconId))!.slice(
        'export default '.length,
      )
      expect(registry).toContain(`const __sax_safe_icon_${index} = ${data};`)
    }
    const known = '<template><s-icon name="bx:home" /></template>'
    expect(plugin.transform(known, '/app.vue')).toBeUndefined()
    const fresh = '<template><s-icon name="bx:user" /></template>'
    expect(plugin.transform(fresh, '/app.vue')).toEqual(
      original.transform(fresh, '/app.vue'),
    )
    plugin.configResolved({ ...config, command: 'build' })
    expect(await plugin.load(id)).toBe(await original.load(id))
    expect(plugin.transform(known, '/app.vue')).toEqual(
      original.transform(known, '/app.vue'),
    )
  })
})
