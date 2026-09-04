import { defineComponent, h, nextTick, shallowRef } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { SContextMenu } from '..'
import { SFocusTrap } from '../../focus-trap'
import { SPopper } from '../../popper'

const settle = async () => {
  await nextTick()
  await flushPromises()
}
const wrappers: { unmount(): void }[] = []
afterEach(() => wrappers.splice(0).forEach((wrapper) => wrapper.unmount()))

describe('shared context menu', () => {
  it('preserves native menus when disabled and exposes keyboard focus through the menu key', async () => {
    const wrapper = mount(SContextMenu, {
      attachTo: document.body,
      props: {
        disabled: true,
        items: [{ label: 'Inspect', value: 'inspect' }],
      },
      slots: { default: () => h('button', 'Origin') },
    })
    wrappers.push(wrapper)
    const origin = wrapper.get('button').element
    const native = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    })
    origin.dispatchEvent(native)
    expect(native.defaultPrevented).toBe(false)
    await wrapper.setProps({ disabled: false })
    origin.focus()
    await wrapper.get('button').trigger('keydown', { key: 'ContextMenu' })
    await settle()
    expect(document.activeElement?.getAttribute('role')).toBe('menuitem')
    expect(wrapper.getComponent(SPopper).props('virtualTriggering')).toBe(true)
    const tab = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    })
    document.activeElement?.dispatchEvent(tab)
    await settle()
    expect(tab.defaultPrevented).toBe(false)
    expect(document.activeElement).toBe(origin)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
  it('does not steal outside focus when the shared popper closes', async () => {
    const wrapper = mount(SContextMenu, {
      attachTo: document.body,
      props: { items: [{ label: 'Inspect' }] },
      slots: { default: () => h('button', 'Origin') },
    })
    wrappers.push(wrapper)
    await wrapper.get('button').trigger('contextmenu')
    await settle()
    const outside = document.createElement('button')
    document.body.append(outside)
    outside.focus()
    wrapper.getComponent(SPopper).vm.$emit('update:visible', false)
    await settle()
    expect(document.activeElement).toBe(outside)
    expect(wrapper.emitted('close')).toHaveLength(1)
    outside.remove()
  })
  it('joins an enclosing focus layer and Escape releases only the menu', async () => {
    const container = shallowRef<HTMLElement>()
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(
            SFocusTrap,
            { trapped: true, focusTrapEl: container.value },
            {
              default: () =>
                h('div', { ref: container, tabindex: -1 }, [
                  h(
                    SContextMenu,
                    { items: [{ label: 'Inspect' }] },
                    { default: () => h('button', 'Origin') },
                  ),
                ]),
            },
          ),
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await settle()
    const origin = wrapper.get('button').element
    await wrapper.get('button').trigger('contextmenu')
    await settle()
    expect(document.activeElement?.getAttribute('role')).toBe('menuitem')
    document.activeElement?.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
    )
    await settle()
    expect(document.activeElement).toBe(origin)
    expect(wrapper.getComponent(SFocusTrap).props('trapped')).toBe(true)
  })
})
