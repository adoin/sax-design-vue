import { createSSRApp, h, nextTick } from 'vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { renderToString } from 'vue/server-renderer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ID_INJECTION_KEY, useGlobalConfig } from '@vuesax-alpha/hooks'
import Result from '../src/result.vue'
import ConfigProvider from '../../config-provider/src/config-provider'
import { resultTypes } from '../src/result'

enableAutoUnmount(afterEach)
const originalConfig = useGlobalConfig().value
beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', undefined)
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
})
afterEach(() => {
  useGlobalConfig().value = originalConfig
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('Result', () => {
  it.each(resultTypes)(
    'renders a semantic %s SVG result with an accessible heading',
    async (status) => {
      const wrapper = mount(Result, {
        props: {
          status,
          title: 'Outcome',
          description: 'Details',
          animated: false,
        },
      })
      await nextTick()
      expect(wrapper.classes()).toContain(`s-result--${status}`)
      expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
      expect(wrapper.get('section').attributes('aria-labelledby')).toBe(
        wrapper.get('h3').attributes('id'),
      )
      expect(wrapper.find('filter').exists()).toBe(false)
      expect(wrapper.text()).toContain('Outcome')
    },
  )
  it('preserves text fallback and supports rich, scoped slots without invalid paragraph nesting', () => {
    const wrapper = mount(Result, {
      props: {
        title: 'Fallback',
        description: 'Description',
        content: 'Alias',
        animated: false,
      },
      slots: {
        icon: '<span>Custom icon</span>',
        title:
          '<template #title="{status}"><strong>{{status}}</strong></template>',
        default: '<div><p>Rich description</p></div>',
        details: '<dl><dt>Reference</dt><dd>S-1</dd></dl>',
        extra: '<button>Continue</button>',
      },
    })
    expect(wrapper.find('.s-result__illustration').exists()).toBe(false)
    expect(wrapper.get('h3').text()).toBe('info')
    expect(wrapper.get('.s-result__description').element.tagName).toBe('DIV')
    expect(wrapper.get('.s-result__details').text()).toContain('S-1')
    expect(wrapper.get('.s-result__extra button').text()).toBe('Continue')
    expect(wrapper.text()).not.toContain('Fallback')
    const alias = mount(Result, {
      props: { content: 'Legacy content', animated: false },
    })
    expect(alias.get('.s-result__description').text()).toBe('Legacy content')
  })
  it('inherits size while allowing local size and horizontal layout', () => {
    const host = mount(ConfigProvider, {
      props: { size: 'large' },
      slots: {
        default: () =>
          h(Result, {
            title: 'Ready',
            size: 'small',
            layout: 'horizontal',
            animated: false,
          }),
      },
    })
    const result = host.findComponent(Result)
    expect(result.classes()).toContain('s-result--small')
    expect(result.classes()).toContain('is-horizontal')
    expect(result.find('.s-result__body').exists()).toBe(true)
  })
  it('plays once when visible, releases observers on completion and replays after opt-in', async () => {
    let visible: (
      entries: Array<{ isIntersecting: boolean }>,
    ) => void = () => {}
    const disconnect = vi.fn()
    const preference = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    vi.stubGlobal('matchMedia', () => preference)
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: typeof visible) {
          visible = callback
        }
        observe = vi.fn()
        disconnect = disconnect
      },
    )
    const wrapper = mount(Result, {
      props: { status: 'success', title: 'Done' },
    })
    await nextTick()
    expect(wrapper.get('svg').classes()).toContain('is-pending')
    visible([{ isIntersecting: true }])
    await nextTick()
    expect(wrapper.get('svg').classes()).toContain('is-revealing')
    const event = new Event('animationend', { bubbles: true })
    Object.defineProperty(event, 'animationName', {
      value: 'sax-result-seal-in',
    })
    wrapper.get('svg').element.dispatchEvent(event)
    await nextTick()
    expect(wrapper.get('svg').classes()).not.toContain('is-revealing')
    expect(disconnect).toHaveBeenCalled()
    expect(preference.removeEventListener).toHaveBeenCalled()
    await wrapper.setProps({ animated: false })
    await wrapper.setProps({ animated: true })
    visible([{ isIntersecting: true }])
    await nextTick()
    expect(wrapper.get('svg').classes()).toContain('is-revealing')
  })
  it('renders static artwork for animation opt-out and reduced motion', async () => {
    const wrapper = mount(Result, { props: { animated: false } })
    await nextTick()
    expect(wrapper.get('svg').classes()).not.toContain('is-revealing')
    vi.stubGlobal('matchMedia', () => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    const reduced = mount(Result)
    await nextTick()
    expect(reduced.get('svg').classes()).not.toContain('is-pending')
    expect(reduced.get('svg').classes()).not.toContain('is-revealing')
  })
  it('keeps SVG and heading references unique and supports seeded SSR', async () => {
    const first = mount(Result, { props: { title: 'First', animated: false } })
    const second = mount(Result, {
      props: { title: 'Second', animated: false },
    })
    expect(first.get('h3').attributes('id')).not.toBe(
      second.get('h3').attributes('id'),
    )
    expect(first.get('radialGradient').attributes('id')).not.toBe(
      second.get('radialGradient').attributes('id'),
    )
    const app = createSSRApp({
      render: () =>
        h(Result, { status: 'success', title: 'Ready', animated: false }),
    })
    app.provide(ID_INJECTION_KEY, { prefix: 10, current: 0 })
    const html = await renderToString(app)
    expect(html).toContain('Ready')
    expect(html).toContain('s-result--success')
    expect(html).not.toContain('<filter')
  })
})
