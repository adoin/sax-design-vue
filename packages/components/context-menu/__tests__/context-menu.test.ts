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
  const nested = (innerDisabled = false) => {
    const layer = (
      name: string,
      children = () => h('button', { class: `${name}-origin` }, name),
    ) =>
      h(
        SContextMenu,
        {
          items: [{ label: name }],
          disabled: name === 'inner' && innerDisabled,
        },
        { default: children },
      )
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h('div', [
            layer('outer', () =>
              h('div', [
                h('button', { class: 'outer-origin' }, 'Outer'),
                layer('middle', () =>
                  h('div', [
                    h('button', { class: 'middle-origin' }, 'Middle'),
                    layer('inner'),
                  ]),
                ),
              ]),
            ),
          ]),
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    const menus = wrapper.findAllComponents(SContextMenu)
    const menu = (name: string) =>
      menus.find((item) => item.props('items')?.[0]?.label === name)!
    return { wrapper, menus, menu }
  }

  it.each([
    ['contextmenu', {}],
    ['keydown', { key: 'ContextMenu' }],
    ['keydown', { key: 'F10', shiftKey: true }],
  ])(
    'only opens the innermost of three nested menus for %s %j',
    async (event, options) => {
      const { wrapper, menus, menu } = nested()
      await wrapper.get('.inner-origin').trigger(event, options)
      await settle()
      expect(menu('inner').emitted('open')).toHaveLength(1)
      expect(menu('middle').emitted('open')).toBeUndefined()
      expect(menu('outer').emitted('open')).toBeUndefined()
      expect(
        menus.filter((item) => item.emitted('update:modelValue')?.[0]?.[0]),
      ).toHaveLength(1)
      expect(document.activeElement?.textContent).toBe('inner')
    },
  )

  it('lets each enclosing region handle right-clicks outside its nested trigger', async () => {
    const { wrapper, menu } = nested()
    await wrapper.get('.middle-origin').trigger('contextmenu')
    await settle()
    expect(menu('middle').emitted('open')).toHaveLength(1)
    expect(menu('inner').emitted('open')).toBeUndefined()
    expect(menu('outer').emitted('open')).toBeUndefined()
    menu('middle').vm.close(false)
    await settle()
    await wrapper.get('.outer-origin').trigger('contextmenu')
    await settle()
    expect(menu('outer').emitted('open')).toHaveLength(1)
    expect(menu('middle').emitted('open')).toHaveLength(1)
    expect(menu('inner').emitted('open')).toBeUndefined()
  })

  it.each([
    ['contextmenu', {}],
    ['keydown', { key: 'F10', shiftKey: true }],
  ])(
    'replaces previous menus across consecutive nested %s openings',
    async (event, options) => {
      const { wrapper, menu } = nested()
      for (const name of ['outer', 'middle', 'inner', 'outer']) {
        await wrapper.get(`.${name}-origin`).trigger(event, options)
        await settle()
        expect(
          wrapper
            .findAllComponents(SPopper)
            .filter(
              (popper) =>
                popper.props('virtualTriggering') && popper.props('visible'),
            ),
        ).toHaveLength(1)
        expect(document.activeElement?.textContent).toBe(name)
      }
      expect(menu('middle').emitted('close')).toHaveLength(1)
      expect(menu('inner').emitted('close')).toHaveLength(1)
      expect(menu('outer').emitted('close')).toHaveLength(1)
      wrapper
        .findAllComponents(SPopper)
        .filter(
          (popper) =>
            popper.props('virtualTriggering') && !popper.props('visible'),
        )
        .forEach((popper) =>
          expect(popper.props('popperStyle')).toEqual({ visibility: 'hidden' }),
        )
      // A late leave callback from the old menu must not restore its origin.
      wrapper
        .findAllComponents(SPopper)
        .forEach((popper) => popper.vm.$emit('hide'))
      await settle()
      expect(document.activeElement?.textContent).toBe('outer')
    },
  )

  it('replaces an imperative or model-opened menu in another component root and cleans up ownership', async () => {
    const first = mount(SContextMenu, {
      attachTo: document.body,
      props: { items: [{ label: 'First' }] },
      slots: { default: () => h('button', 'First origin') },
    })
    wrappers.push(first)
    const second = mount(SContextMenu, {
      attachTo: document.body,
      props: { items: [{ label: 'Second' }] },
      slots: { default: () => h('button', 'Second origin') },
    })
    wrappers.push(second)
    await first.vm.show(
      new MouseEvent('contextmenu', { cancelable: true }),
      first.get('button').element,
    )
    await settle()
    await second.setProps({ modelValue: true })
    await settle()
    expect(first.getComponent(SPopper).props('visible')).toBe(false)
    expect(first.emitted('update:modelValue')?.at(-1)).toEqual([false])
    expect(second.getComponent(SPopper).props('visible')).toBe(true)
    second.unmount()
    wrappers.pop()
    await first.get('button').trigger('contextmenu')
    await settle()
    expect(first.getComponent(SPopper).props('visible')).toBe(true)
    expect(second.emitted('close')).toBeUndefined()
  })

  it('falls back to the nearest enabled ancestor when the innermost menu is disabled', async () => {
    const { wrapper, menu } = nested(true)
    await wrapper.get('.inner-origin').trigger('contextmenu')
    await settle()
    expect(menu('inner').emitted('open')).toBeUndefined()
    expect(menu('middle').emitted('open')).toHaveLength(1)
    expect(menu('outer').emitted('open')).toBeUndefined()
  })

  it('claims document ownership for slotless imperative and controlled menus', async () => {
    const origin = document.createElement('button')
    document.body.append(origin)
    wrappers.push({ unmount: () => origin.remove() })
    const first = mount(SContextMenu, {
      attachTo: document.body,
      props: { items: [{ label: 'Imperative' }] },
    })
    const second = mount(SContextMenu, {
      attachTo: document.body,
      props: { items: [{ label: 'Controlled' }] },
    })
    wrappers.push(first, second)
    await first.vm.show(
      new MouseEvent('contextmenu', { cancelable: true }),
      origin,
    )
    await second.setProps({ modelValue: true })
    await settle()
    expect(first.getComponent(SPopper).props('visible')).toBe(false)
    expect(second.getComponent(SPopper).props('visible')).toBe(true)
    await first.vm.show(
      new MouseEvent('contextmenu', { cancelable: true }),
      origin,
    )
    await settle()
    expect(first.getComponent(SPopper).props('visible')).toBe(true)
    expect(second.getComponent(SPopper).props('visible')).toBe(false)
  })

  it('respects an event already prevented by the target without opening an ancestor', async () => {
    const { wrapper, menus } = nested()
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    })
    event.preventDefault()
    wrapper.get('.inner-origin').element.dispatchEvent(event)
    await settle()
    expect(menus.every((menu) => !menu.emitted('open'))).toBe(true)
  })

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
    wrapper.getComponent(SPopper).vm.$emit('hide')
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
    wrapper.getComponent(SPopper).vm.$emit('hide')
    await settle()
    expect(document.activeElement).toBe(origin)
    expect(wrapper.getComponent(SFocusTrap).props('trapped')).toBe(true)
  })
})
