import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Scrollbar from '../src/scrollbar.vue'

async function create(props: Record<string, unknown> = {}) {
  const wrapper = mount(Scrollbar, {
    attachTo: document.body,
    props: { height: 200, ...props },
  })
  const viewport = wrapper.vm.wrapRef!
  const dimensions = {
    clientWidth: 300,
    clientHeight: 200,
    scrollWidth: 900,
    scrollHeight: 800,
    offsetWidth: 300,
    offsetHeight: 200,
  }
  for (const key of Object.keys(dimensions) as (keyof typeof dimensions)[])
    Object.defineProperty(viewport, key, {
      configurable: true,
      get: () => dimensions[key],
    })
  wrapper.vm.update()
  await nextTick()
  return { wrapper, viewport, dimensions }
}

describe('Scrollbar progress models', () => {
  it.each([false, true])(
    'initializes and writes both axes in native=%s',
    async (native) => {
      const { wrapper, viewport } = await create({ x: 25, y: 50, native })
      expect(viewport.scrollLeft).toBe(150)
      expect(viewport.scrollTop).toBe(300)
      await wrapper.setProps({ x: 100, y: 25 })
      expect(viewport.scrollLeft).toBe(600)
      expect(viewport.scrollTop).toBe(150)
      wrapper.unmount()
    },
  )

  it('reports actual fractional offsets and leaves the existing scroll payload unchanged', async () => {
    const { wrapper, viewport } = await create()
    viewport.scrollLeft = 120
    viewport.scrollTop = 200
    await wrapper.get('.s-scrollbar__wrap').trigger('scroll')
    expect(wrapper.emitted('update:x')?.at(-1)).toEqual([20])
    expect(wrapper.emitted('update:y')?.at(-1)?.[0]).toBeCloseTo(100 / 3)
    expect(wrapper.emitted('scroll')?.at(-1)).toEqual([
      { scrollLeft: 120, scrollTop: 200 },
    ])
    const count = wrapper.emitted('update:y')!.length
    await wrapper.get('.s-scrollbar__wrap').trigger('scroll')
    expect(wrapper.emitted('update:y')).toHaveLength(count)
    wrapper.unmount()
  })

  it('does not write model echoes back into the native scrolling position', async () => {
    const { wrapper, viewport } = await create({ y: 0 })
    let offset = 200
    const write = vi.fn((value: number) => {
      offset = value
    })
    Object.defineProperty(viewport, 'scrollTop', {
      configurable: true,
      get: () => offset,
      set: write,
    })
    await wrapper.get('.s-scrollbar__wrap').trigger('scroll')
    await wrapper.setProps({
      y: wrapper.emitted<[number]>('update:y')!.at(-1)![0],
    })
    expect(write).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('recalculates progress after resizing without forcing the old percentage', async () => {
    const { wrapper, viewport, dimensions } = await create({ y: 50 })
    dimensions.scrollHeight = 1400
    wrapper.vm.update()
    expect(viewport.scrollTop).toBe(300)
    expect(wrapper.emitted('update:y')?.at(-1)).toEqual([25])
    dimensions.scrollHeight = dimensions.clientHeight
    wrapper.vm.update()
    expect(wrapper.emitted('update:y')?.at(-1)).toEqual([0])
    wrapper.unmount()
  })

  it('keeps requested values while hidden and applies them when measurable again', async () => {
    const { wrapper, viewport, dimensions } = await create({ y: 50 })
    dimensions.clientHeight = 0
    viewport.scrollTop = 0
    const count = wrapper.emitted('update:y')!.length
    wrapper.vm.update()
    expect(wrapper.emitted('update:y')).toHaveLength(count)
    dimensions.clientHeight = 200
    wrapper.vm.update()
    expect(viewport.scrollTop).toBe(300)
    dimensions.clientHeight = 0
    viewport.scrollTop = 0
    wrapper.vm.update()
    await wrapper.setProps({ y: 75 })
    dimensions.clientHeight = 200
    wrapper.vm.update()
    expect(viewport.scrollTop).toBe(450)
    wrapper.unmount()
  })

  it('clamps inputs and overscroll, ignores non-finite values, and returns zero without overflow', async () => {
    const { wrapper, viewport, dimensions } = await create({ x: -20, y: 200 })
    expect(viewport.scrollLeft).toBe(0)
    expect(viewport.scrollTop).toBe(600)
    await wrapper.setProps({ y: Number.NaN })
    expect(viewport.scrollTop).toBe(600)
    viewport.scrollTop = -20
    await wrapper.get('.s-scrollbar__wrap').trigger('scroll')
    expect(wrapper.emitted('update:y')?.at(-1)).toEqual([0])
    dimensions.scrollWidth = 300
    const count = wrapper.emitted('update:x')!.length
    await wrapper.setProps({ x: 50 })
    expect(viewport.scrollLeft).toBe(0)
    expect(wrapper.emitted('update:x')).toHaveLength(count + 1)
    expect(wrapper.emitted('update:x')?.at(-1)).toEqual([0])
    wrapper.unmount()
  })

  it('measures horizontal RTL progress from inline start', async () => {
    const { wrapper, viewport } = await create()
    viewport.style.direction = 'rtl'
    await wrapper.setProps({ x: 50 })
    expect(viewport.scrollLeft).toBe(-300)
    viewport.scrollLeft = -600
    await wrapper.get('.s-scrollbar__wrap').trigger('scroll')
    expect(wrapper.emitted('update:x')?.at(-1)).toEqual([100])
    wrapper.unmount()
  })
})
