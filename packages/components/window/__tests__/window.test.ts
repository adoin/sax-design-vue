import { h, nextTick, reactive } from 'vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SConfigProvider } from '@vuesax-alpha/components/config-provider'
import Window from '../src/window.vue'
import { constrainWindowRect, resizeWindowRect } from '../src/window'

enableAutoUnmount(afterEach)
const rect = { x: 20, y: 30, width: 400, height: 300 }
describe('Window', () => {
  it('focuses pointer handles for arrows and Escape without taking input editing keys', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Window, {
      props: { rect },
      attachTo: document.body,
      slots: { default: '<input />' },
    })
    const pointer = async (element: Element, type: string, x = 0, y = 0) => {
      const event = new MouseEvent(type, {
        button: 0,
        clientX: x,
        clientY: y,
        bubbles: true,
        cancelable: true,
      })
      Object.defineProperty(event, 'pointerId', { value: 1 })
      element.dispatchEvent(event)
      await nextTick()
    }
    const title = wrapper.get('.s-window__title')
    await pointer(title.element, 'pointerdown', 20, 30)
    expect(document.activeElement).toBe(title.element)
    await pointer(wrapper.element, 'pointermove', 70, 80)
    await vi.advanceTimersByTimeAsync(20)
    expect(wrapper.emitted('update:rect')!.at(-1)).toEqual([
      { ...rect, x: 70, y: 80 },
    ])
    await title.trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('update:rect')!.at(-1)).toEqual([rect])
    await pointer(wrapper.element, 'pointerup', 70, 80)
    await title.trigger('keydown', { key: 'ArrowRight', shiftKey: true })
    expect(wrapper.emitted('update:rect')!.at(-1)).toEqual([{ ...rect, x: 70 }])
    const handle = wrapper.get('.s-window__resize--se')
    await pointer(handle.element, 'pointerdown')
    expect(document.activeElement).toBe(handle.element)
    await pointer(wrapper.element, 'pointerup')
    await handle.trigger('keydown', { key: 'ArrowDown', shiftKey: true })
    expect(wrapper.emitted('update:rect')!.at(-1)).toEqual([
      { ...rect, x: 70, height: 350 },
    ])
    const count = wrapper.emitted('update:rect')!.length
    const input = wrapper.get('input')
    ;(input.element as HTMLInputElement).focus()
    await input.trigger('keydown', { key: 'ArrowLeft' })
    await input.trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('update:rect')).toHaveLength(count)
    wrapper.unmount()
    vi.useRealTimers()
  })
  it('enforces minimum dimensions and bounds, including opposite-edge resizing', () => {
    expect(
      constrainWindowRect({ x: 999, y: -5, width: 900, height: 1 }, 280, 180, {
        width: 800,
        height: 600,
      }),
    ).toEqual({ x: 0, y: 0, width: 800, height: 180 })
    expect(resizeWindowRect(rect, 'nw', 999, 999, 280, 180)).toEqual({
      x: 140,
      y: 150,
      width: 280,
      height: 180,
    })
    expect(resizeWindowRect(rect, 'se', -999, -999, 280, 180)).toEqual({
      x: 20,
      y: 30,
      width: 280,
      height: 180,
    })
    expect(
      constrainWindowRect(rect, 500, 400, { width: 200, height: 100 }),
    ).toEqual({ x: 0, y: 0, width: 500, height: 400 })
  })
  it('moves and resizes with keyboard and responds to changed control props', async () => {
    const wrapper = mount(Window, { props: { rect } })
    await wrapper
      .get('.s-window__title')
      .trigger('keydown', { key: 'ArrowRight', shiftKey: true })
    expect(wrapper.emitted('update:rect')!.at(-1)).toEqual([{ ...rect, x: 70 }])
    await wrapper
      .get('.s-window__resize--se')
      .trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:rect')!.at(-1)).toEqual([
      { ...rect, x: 70, height: 310 },
    ])
    await wrapper.setProps({
      draggable: false,
      resizable: false,
      rect: { ...rect, x: 100 },
    })
    expect(wrapper.find('.s-window__resize').exists()).toBe(false)
    const count = wrapper.emitted('update:rect')!.length
    await wrapper
      .get('.s-window__title')
      .trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:rect')!.length).toBe(count)
    expect(wrapper.attributes('style')).toContain('left: 100px')
  })
  it('renames without changing content identity and cancels editing', async () => {
    const wrapper = mount(Window, {
      props: { title: 'Original', titleEditable: true },
      slots: { default: () => h('input', { value: 'unsaved' }) },
    })
    const input = wrapper.get('.s-window__body input').element
    await wrapper.get('[aria-label="Rename window"]').trigger('click')
    const editor = wrapper.get('.s-window__editor input')
    await editor.setValue('New title')
    await editor.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:title')).toEqual([['New title']])
    expect(wrapper.get('.s-window__body input').element).toBe(input)
    await wrapper.get('[aria-label="Rename window"]').trigger('click')
    await wrapper.get('.s-window__editor input').setValue('Cancelled')
    await wrapper
      .get('.s-window__editor input')
      .trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('update:title')).toHaveLength(1)
  })
  it('routes reactive attributes to the outer surface and resolves shared shape', async () => {
    const attrs = reactive({
      class: 'consumer',
      style: { margin: '2px' },
      'aria-label': 'Notes',
    })
    const host = mount({ setup: () => () => h(Window, attrs) })
    const wrapper = host.getComponent(Window)
    Object.assign(attrs, {
      class: 'updated',
      style: { margin: '4px' },
      'aria-label': 'Updated notes',
    })
    await nextTick()
    expect(wrapper.classes()).toContain('updated')
    expect(wrapper.attributes('style')).toContain('margin: 4px')
    expect(wrapper.attributes('aria-label')).toBe('Updated notes')
    const provider = mount(SConfigProvider, {
      props: { shape: 'square' },
      slots: { default: () => h(Window) },
    })
    expect(provider.get('.s-window').classes()).toContain('s-window--square')
  })
  it('coalesces pointer movement and cancels a gesture without losing its starting geometry', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Window, { props: { rect } })
    const dispatch = async (element: Element, type: string, x = 0, y = 0) => {
      const event = new MouseEvent(type, {
        button: 0,
        clientX: x,
        clientY: y,
        bubbles: true,
      })
      Object.defineProperty(event, 'pointerId', { value: 1 })
      element.dispatchEvent(event)
      await nextTick()
    }
    await dispatch(
      wrapper.get('.s-window__title').element,
      'pointerdown',
      30,
      40,
    )
    await dispatch(wrapper.element, 'pointermove', 70, 90)
    await vi.advanceTimersByTimeAsync(20)
    expect(wrapper.emitted('update:rect')!.at(-1)).toEqual([
      { ...rect, x: 60, y: 80 },
    ])
    await dispatch(wrapper.element, 'pointercancel')
    expect(wrapper.emitted('update:rect')!.at(-1)).toEqual([rect])
    vi.useRealTimers()
  })
})
