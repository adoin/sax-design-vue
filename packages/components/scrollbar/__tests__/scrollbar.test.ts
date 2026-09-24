import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Scrollbar from '../src/scrollbar.vue'

describe('Scrollbar', () => {
  async function createScrollbar(always = true) {
    const wrapper = mount(Scrollbar, {
      props: { placement: 'outside', height: 200, always },
      slots: { default: '<div>Scrollable content</div>' },
    })
    const viewport = wrapper.vm.wrapRef!
    const dimensions = {
      offsetHeight: 200,
      offsetWidth: 300,
      scrollHeight: 800,
      scrollWidth: 900,
    }
    for (const key of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
      Object.defineProperty(viewport, key, {
        configurable: true,
        get: () => dimensions[key],
      })
    }
    wrapper.vm.update()
    await nextTick()
    return { wrapper, viewport, dimensions }
  }

  it('updates both thumbs after scrolling and removes tracks when content fits', async () => {
    const { wrapper, viewport, dimensions } = await createScrollbar()
    expect(wrapper.findAll('.s-scrollbar__bar')).toHaveLength(2)
    wrapper.vm.setScrollTop(120)
    wrapper.vm.setScrollLeft(90)
    await wrapper.find('.s-scrollbar__wrap').trigger('scroll')
    expect(wrapper.emitted('scroll')?.at(-1)).toEqual([
      { scrollTop: 120, scrollLeft: 90 },
    ])
    const thumb = () =>
      wrapper.get('.is-vertical .s-scrollbar__thumb').attributes('style')
    expect(thumb()).not.toContain('translateY(0%)')
    viewport.scrollTop = 0
    wrapper.vm.update()
    await nextTick()
    expect(thumb()).toContain('translateY(0%)')
    dimensions.scrollHeight = dimensions.offsetHeight
    dimensions.scrollWidth = dimensions.offsetWidth
    wrapper.vm.update()
    await nextTick()
    expect(wrapper.findAll('.s-scrollbar__bar')).toHaveLength(0)
    wrapper.unmount()
  })

  it('keeps outside track space while hidden and shows tracks on pointer entry', async () => {
    const { wrapper } = await createScrollbar(false)
    const track = wrapper.get('.is-vertical')
    expect((track.element as HTMLElement).style.display).not.toBe('none')
    expect(track.attributes('style')).toContain('opacity: 0')
    await wrapper.trigger('mousemove')
    expect(track.attributes('style')).not.toContain('opacity: 0')
    await wrapper.trigger('mouseleave')
    expect((track.element as HTMLElement).style.display).not.toBe('none')
    expect(track.attributes('style')).toContain('opacity: 0')
    wrapper.unmount()
  })

  it('cleans up a thumb drag if its overflowing content is removed', async () => {
    const { wrapper, dimensions } = await createScrollbar()
    const original = document.onselectstart
    const removeListener = vi.spyOn(document, 'removeEventListener')
    await wrapper
      .get('.is-vertical .s-scrollbar__thumb')
      .trigger('mousedown', { button: 0 })
    expect(document.onselectstart).not.toBe(original)
    dimensions.scrollHeight = dimensions.offsetHeight
    wrapper.vm.update()
    await nextTick()
    expect(document.onselectstart).toBe(original)
    expect(removeListener).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
    )
    expect(removeListener).toHaveBeenCalledWith('mouseup', expect.any(Function))
    removeListener.mockRestore()
    wrapper.unmount()
  })

  it('preserves the default inside placement and native mode', async () => {
    const wrapper = mount(Scrollbar)
    expect(wrapper.classes()).not.toContain('is-outside')
    await wrapper.setProps({ placement: 'outside', native: true })
    expect(wrapper.classes()).not.toContain('is-outside')
    expect(wrapper.findAll('.s-scrollbar__bar')).toHaveLength(0)
    expect(
      wrapper.get('.s-scrollbar__wrap').attributes('tabindex'),
    ).toBeUndefined()
    wrapper.unmount()
  })

  it('reveals vertical fades from the current scroll position and removes them when content fits', async () => {
    const wrapper = mount(Scrollbar, {
      props: { height: 200, fade: true },
      slots: { default: '<div>Scrollable content</div>' },
    })
    const viewport = wrapper.vm.wrapRef!
    const dimensions = {
      offsetHeight: 200,
      offsetWidth: 300,
      clientHeight: 200,
      clientWidth: 300,
      scrollHeight: 800,
      scrollWidth: 300,
    }
    for (const key of Object.keys(dimensions) as (keyof typeof dimensions)[])
      Object.defineProperty(viewport, key, {
        configurable: true,
        get: () => dimensions[key],
      })

    wrapper.vm.update()
    await nextTick()
    expect(wrapper.get('.s-scrollbar__wrap').classes()).toContain('is-fade-y')
    expect(viewport.style.getPropertyValue('--s-scrollbar-fade-top')).toContain(
      '* 0)',
    )
    expect(
      viewport.style.getPropertyValue('--s-scrollbar-fade-bottom'),
    ).toContain('* 1)')

    viewport.scrollTop = 48
    await wrapper.get('.s-scrollbar__wrap').trigger('scroll')
    expect(viewport.style.getPropertyValue('--s-scrollbar-fade-top')).toContain(
      '* 0.5)',
    )

    viewport.scrollTop = 600
    await wrapper.get('.s-scrollbar__wrap').trigger('scroll')
    expect(
      viewport.style.getPropertyValue('--s-scrollbar-fade-bottom'),
    ).toContain('* 0)')

    dimensions.scrollHeight = dimensions.clientHeight
    viewport.scrollTop = 0
    wrapper.vm.update()
    await nextTick()
    expect(viewport.style.getPropertyValue('--s-scrollbar-fade-top')).toContain(
      '* 0)',
    )
    expect(
      viewport.style.getPropertyValue('--s-scrollbar-fade-bottom'),
    ).toContain('* 0)')
    wrapper.unmount()
  })

  it('supports horizontal, sized and RTL logical-edge fades', async () => {
    const wrapper = mount(Scrollbar, {
      props: {
        height: 120,
        fade: { direction: 'x', size: '15%' },
      },
      slots: { default: '<div>Wide content</div>' },
    })
    const viewport = wrapper.vm.wrapRef!
    const dimensions = {
      offsetHeight: 120,
      offsetWidth: 300,
      clientHeight: 120,
      clientWidth: 300,
      scrollHeight: 120,
      scrollWidth: 900,
    }
    for (const key of Object.keys(dimensions) as (keyof typeof dimensions)[])
      Object.defineProperty(viewport, key, {
        configurable: true,
        get: () => dimensions[key],
      })

    wrapper.vm.update()
    await nextTick()
    expect(viewport.classList).toContain('is-fade-x')
    expect(viewport.classList).not.toContain('is-fade-y')
    expect(viewport.style.getPropertyValue('--s-scrollbar-fade-size')).toBe(
      '15%',
    )
    expect(
      viewport.style.getPropertyValue('--s-scrollbar-fade-left'),
    ).toContain('* 0)')
    expect(
      viewport.style.getPropertyValue('--s-scrollbar-fade-right'),
    ).toContain('* 1)')

    await wrapper.setProps({
      fade: { direction: 'start', size: 24 },
    })
    wrapper.element.setAttribute('dir', 'rtl')
    await nextTick()
    wrapper.vm.update()
    expect(viewport.style.getPropertyValue('--s-scrollbar-fade-size')).toBe(
      '24px',
    )
    expect(viewport.style.getPropertyValue('--s-scrollbar-fade-left')).toBe(
      '0px',
    )
    expect(
      viewport.style.getPropertyValue('--s-scrollbar-fade-right'),
    ).toContain('* 0)')
    viewport.scrollLeft = -48
    await wrapper.get('.s-scrollbar__wrap').trigger('scroll')
    expect(
      viewport.style.getPropertyValue('--s-scrollbar-fade-right'),
    ).toContain('* 0.5)')

    await wrapper.setProps({ fade: 't' })
    await nextTick()
    wrapper.vm.update()
    expect(viewport.classList).toContain('is-fade-y')
    expect(viewport.classList).not.toContain('is-fade-x')
    expect(viewport.style.getPropertyValue('--s-scrollbar-fade-bottom')).toBe(
      '0px',
    )
    wrapper.unmount()
  })
})
