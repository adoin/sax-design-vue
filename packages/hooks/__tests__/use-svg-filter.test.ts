import { createSSRApp, defineComponent, h, nextTick, shallowRef } from 'vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { renderToString } from 'vue/server-renderer'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineSvgFilter, svgFilter } from '@vuesax-alpha/utils'
import { useSvgFilter } from '../use-svg-filter'

enableAutoUnmount(afterEach)
afterEach(() => {
  svgFilter.clearUnused()
  vi.restoreAllMocks()
})
const first = defineSvgFilter({
  key: 'hook-first',
  nodes: [{ tag: 'feGaussianBlur', attrs: { stdDeviation: 2 } }],
})
const second = defineSvgFilter({
  key: 'hook-second',
  nodes: [{ tag: 'feGaussianBlur', attrs: { stdDeviation: 3 } }],
})

describe('useSvgFilter', () => {
  it('shares consumers and cleans up after unmount', async () => {
    const Consumer = defineComponent({
      setup() {
        const { url } = useSvgFilter(first)
        return () => h('div', { style: { filter: url.value } })
      },
    })
    const one = mount(Consumer)
    const two = mount(Consumer)
    await nextTick()
    expect(one.attributes('style')).toBe(two.attributes('style'))
    expect(
      document.querySelectorAll('[data-sax-svg-filters] filter'),
    ).toHaveLength(1)
    one.unmount()
    expect(
      document.querySelectorAll('[data-sax-svg-filters] filter'),
    ).toHaveLength(1)
    two.unmount()
    expect(document.querySelector('[data-sax-svg-filters]')).toBeNull()
  })

  it('switches definitions without stale URLs or leaked old leases', async () => {
    const current = shallowRef(first)
    const Consumer = defineComponent({
      setup() {
        const { url } = useSvgFilter(current)
        return () => h('div', { style: { filter: url.value } })
      },
    })
    const wrapper = mount(Consumer)
    await nextTick()
    current.value = second
    await nextTick()
    await nextTick()
    expect(wrapper.attributes('style')).toContain(svgFilter.getId(second))
    expect(document.querySelector(`#${svgFilter.getId(first)}`)).toBeNull()
    wrapper.unmount()
    expect(document.querySelector('[data-sax-svg-filters]')).toBeNull()
  })

  it('keeps SSR DOM-free and hydrates without style mismatches', async () => {
    const Consumer = defineComponent({
      setup() {
        const { url } = useSvgFilter(first)
        return () => h('div', { style: { filter: url.value ?? 'none' } }, 'SSR')
      },
    })
    const server = createSSRApp(Consumer)
    const html = await renderToString(server)
    expect(document.querySelector('[data-sax-svg-filters]')).toBeNull()
    expect(html).toContain('filter:none')
    const container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const client = createSSRApp(Consumer)
    try {
      client.mount(container)
      await nextTick()
      expect(container.innerHTML).toContain(svgFilter.getId(first))
      expect(
        warn.mock.calls.map((args) => args.join(' ')).join(' '),
      ).not.toContain('Hydration')
    } finally {
      client.unmount()
      container.remove()
    }
    expect(document.querySelector('[data-sax-svg-filters]')).toBeNull()
  })
})
