import { h } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { platform } from '@vuesax-alpha/hooks/use-floating/dom'
import Popper from '../src/popper.vue'
import Tooltip from '../../tooltip/src/tooltip.vue'
import type { Rect } from '@vuesax-alpha/hooks/use-floating/utils'

let reference: Rect
let floating: Rect
let viewport: Rect
const wrappers: ReturnType<typeof mount>[] = []

beforeEach(() => {
  reference = { x: 240, y: 180, width: 40, height: 20 }
  floating = { x: 0, y: 0, width: 100, height: 80 }
  viewport = { x: 0, y: 0, width: 600, height: 400 }
  vi.spyOn(platform, 'getElementRects').mockImplementation(async () => ({
    reference,
    floating,
  }))
  vi.spyOn(platform, 'getClippingRect').mockImplementation(async () => viewport)
  vi.spyOn(platform, 'getDimensions').mockImplementation(async () => floating)
  vi.spyOn(platform, 'getOffsetParent').mockResolvedValue(window)
  vi.spyOn(
    platform,
    'convertOffsetParentRelativeRectToViewportRelativeRect',
  ).mockImplementation(async ({ rect }) => rect)
})

afterEach(() => {
  wrappers.forEach((wrapper) => wrapper.unmount())
  wrappers.length = 0
  vi.restoreAllMocks()
})

const open = async (props: Record<string, unknown> = {}, tooltip = false) => {
  const wrapper = mount(tooltip ? Tooltip : Popper, {
    attachTo: document.body,
    props: {
      visible: true,
      teleported: false,
      showArrow: false,
      showAfter: 0,
      ...props,
    },
    slots: {
      default: () => h('button', 'Anchor'),
      content: () => h('div', 'Floating content'),
    },
  })
  wrappers.push(wrapper)
  if (tooltip) await wrapper.get('button').trigger('mouseenter')
  await flushPromises()
  if (tooltip) {
    await vi.waitFor(() =>
      expect(wrapper.get('.s-popper').isVisible()).toBe(true),
    )
    await flushPromises()
  }
  return wrapper
}

const placement = (wrapper: ReturnType<typeof mount>) =>
  wrapper.get('.s-popper').attributes('data-popper-placement')

describe('Popper viewport placement', () => {
  it.each([false, true])(
    'prefers top without placement (tooltip: %s)',
    async (tooltip) => {
      expect(placement(await open({}, tooltip))).toBe('top')
    },
  )

  it.each([false, true])(
    'falls below a trigger at the top edge (tooltip: %s)',
    async (tooltip) => {
      reference.y = 5
      expect(placement(await open({}, tooltip))).toBe('bottom')
    },
  )

  it.each([
    [40, 'right'],
    [520, 'left'],
  ])(
    'uses horizontal room when neither vertical side fits at x=%s',
    async (x, expected) => {
      viewport.height = 140
      reference.x = x as number
      reference.y = 60
      expect(placement(await open())).toBe(expected)
    },
  )

  it('chooses the least overflow when no side can contain the panel', async () => {
    floating.width = 700
    floating.height = 500
    reference.y = 10
    expect(placement(await open())).toBe('bottom')
  })

  it('starts with an explicit preference and flips to its opposite if needed', async () => {
    expect(placement(await open({ placement: 'bottom' }))).toBe('bottom')
    reference.y = 370
    expect(placement(await open({ placement: 'bottom' }))).toBe('top')
  })

  it('allows disabling automatic direction changes', async () => {
    reference.y = 5
    expect(placement(await open({ flip: false }))).toBe('top')
  })

  it('honors custom fallback placements', async () => {
    reference.y = 5
    expect(
      placement(await open({ flip: { fallbackPlacements: ['left'] } })),
    ).toBe('left')
  })

  it('repositions on scrolling and reactive placement/flip changes', async () => {
    const wrapper = await open()
    expect(placement(wrapper)).toBe('top')
    reference.y = 5
    window.dispatchEvent(new Event('scroll'))
    await flushPromises()
    expect(placement(wrapper)).toBe('bottom')
    await wrapper.setProps({ flip: false })
    await flushPromises()
    expect(placement(wrapper)).toBe('top')
    await wrapper.setProps({ placement: 'left' })
    await flushPromises()
    expect(placement(wrapper)).toBe('left')
    await wrapper.setProps({ placement: undefined, flip: true })
    await flushPromises()
    expect(placement(wrapper)).toBe('bottom')
    reference.y = 60
    viewport.height = 140
    window.dispatchEvent(new Event('resize'))
    await flushPromises()
    expect(placement(wrapper)).toBe('right')
  })

  it('shifts along the preferred side to keep content inside the viewport', async () => {
    reference.x = 0
    expect(placement(await open())).toBe('top')
    const wrapper = await open({ placement: 'top', flip: false })
    expect(wrapper.get('.s-popper').attributes('style')).toContain('left: 0px')
  })
})
