import { defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { renderToString } from 'vue/server-renderer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SNotification } from '@vuesax-alpha/components/notification'
import { SConfigProvider } from '@vuesax-alpha/components/config-provider'
import zhCn from '@vuesax-alpha/locale/lang/zh-cn'
import Drawer from '../src/drawer.vue'
import type { DrawerSlotScope } from '../src/drawer'

vi.mock('@vuesax-alpha/components/notification', () => ({
  SNotification: vi.fn(),
}))
enableAutoUnmount(afterEach)
beforeEach(() => {
  vi.useFakeTimers({
    toFake: [
      'setTimeout',
      'clearTimeout',
      'requestAnimationFrame',
      'cancelAnimationFrame',
    ],
  })
  vi.stubGlobal('matchMedia', () => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
  vi.clearAllMocks()
})
afterEach(async () => {
  await vi.runOnlyPendingTimersAsync()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
const settle = async (time = 100) => {
  await nextTick()
  await flushPromises()
  await vi.advanceTimersByTimeAsync(time)
  await flushPromises()
  await nextTick()
}
const host = (
  initial: Record<string, unknown> = {},
  open = true,
  slots: Record<string, unknown> = {},
  alias = false,
) => {
  const value = ref(open)
  const options = shallowRef(initial)
  const Host = defineComponent({
    setup: () => () =>
      h(
        Drawer,
        {
          teleported: false,
          ...options.value,
          [alias ? 'open' : 'modelValue']: value.value,
          [alias ? 'onUpdate:open' : 'onUpdate:modelValue']: (
            next: boolean,
          ) => {
            value.value = next
          },
        },
        { default: () => h('input', { 'aria-label': 'Editor' }), ...slots },
      ),
  })
  const wrapper = mount(Host, {
    attachTo: document.body,
    global: { stubs: { transition: false } },
  })
  return { wrapper, value, options, drawer: () => wrapper.getComponent(Drawer) }
}

describe('Drawer parity', () => {
  it('teleports to body by default inside a locale provider', async () => {
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(SConfigProvider, { locale: zhCn }, () =>
            h('section', { class: 'drawer-owner' }, [
              h(Drawer, { modelValue: true }),
            ]),
          ),
      }),
      { attachTo: document.body, global: { stubs: { transition: false } } },
    )
    await settle()
    const drawer = wrapper.getComponent(Drawer)
    const root = document.body.querySelector('.s-drawer__root')!
    expect(root.parentElement).toBe(document.body)
    expect(root.classList.contains('is-inline')).toBe(false)
    expect(drawer.props('getContainer')).toBeUndefined()
  })
  it('keeps a controlled resize gesture alive across v-model echoes', async () => {
    const size = ref(300)
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Drawer, {
            teleported: false,
            modelValue: true,
            resizable: true,
            size: size.value,
            'onUpdate:size': (value: number) => {
              size.value = value
            },
          }),
      }),
      {
        attachTo: document.body,
        global: { stubs: { transition: false } },
      },
    )
    await settle()
    const drawer = wrapper.getComponent(Drawer)
    const handle = drawer.get('button[role="separator"]').element
    const pointer = (type: string, x: number) => {
      const event = new MouseEvent(type, {
        button: 0,
        clientX: x,
        bubbles: true,
        cancelable: true,
      })
      Object.defineProperty(event, 'pointerId', { value: 9 })
      return event
    }
    handle.dispatchEvent(pointer('pointerdown', 500))
    document.dispatchEvent(pointer('pointermove', 450))
    await settle(20)
    expect(size.value).toBe(350)
    expect(drawer.vm.resizing).toBe(true)
    document.dispatchEvent(pointer('pointermove', 400))
    await settle(20)
    expect(size.value).toBe(400)
    expect(drawer.vm.resizing).toBe(true)
    document.dispatchEvent(pointer('pointerup', 390))
    await settle(20)
    expect(size.value).toBe(410)
    expect(drawer.vm.resizing).toBe(false)
  })
  it('does not repeat approval while an accepted close delay is pending', async () => {
    const beforeClose = vi.fn(() => Promise.resolve())
    const owner = host({ beforeClose, closeDelay: 200 })
    await settle()
    await owner.drawer().vm.close()
    await settle(10)
    await owner.drawer().vm.close()
    await settle(300)
    expect(beforeClose).toHaveBeenCalledTimes(1)
    expect(owner.drawer().vm.visible).toBe(false)
  })
  it('lazy mounts, retains content by default, and destroys only after leave', async () => {
    let mounts = 0
    const Counter = defineComponent({
      setup() {
        mounts++
        return () => h('span', 'Owned content')
      },
    })
    const owner = host({}, false, { default: () => h(Counter) })
    await settle()
    expect(mounts).toBe(0)
    owner.value.value = true
    await settle()
    expect(mounts).toBe(1)
    await owner.drawer().vm.close()
    await settle()
    expect(owner.drawer().find('aside').exists()).toBe(true)
    expect(owner.drawer().find('aside').isVisible()).toBe(false)
    owner.options.value = { destroyOnClose: true }
    owner.value.value = true
    await settle()
    await owner.drawer().vm.close()
    await settle()
    expect(owner.drawer().find('aside').exists()).toBe(false)
    owner.value.value = true
    await settle()
    expect(mounts).toBe(2)
  })
  it('force renders before opening and uses v-model:open', async () => {
    const owner = host(
      { forceRender: true },
      false,
      { default: () => h('span', 'Prerendered') },
      true,
    )
    await settle()
    expect(owner.drawer().text()).toContain('Prerendered')
    owner.value.value = true
    await settle()
    await owner.drawer().vm.handleClose()
    await settle()
    expect(owner.value.value).toBe(false)
    expect(owner.drawer().emitted('update:open')?.at(-1)).toEqual([false])
    expect(owner.drawer().emitted('opened')).toHaveLength(1)
    expect(owner.drawer().emitted('closed')).toHaveLength(1)
  })
  it.each([
    ['ltr', 'left'],
    ['rtl', 'right'],
    ['ttb', 'top'],
    ['btt', 'bottom'],
  ])('maps %s to %s with axis sizing', async (direction, placement) => {
    const owner = host({ direction, width: 420, height: '45%' })
    await settle()
    const wrapper = owner.drawer().get('.s-drawer__wrapper')
    expect(wrapper.classes()).toContain(`s-drawer--${placement}`)
    expect(wrapper.attributes('style')).toContain(
      placement === 'left' || placement === 'right'
        ? 'width: 420px'
        : 'height: 45%',
    )
  })
  it('renders scoped header/title/extra/footer and an independent custom close icon', async () => {
    const owner = host(
      {
        title: 'Accessible drawer',
        headerStyle: { color: 'red' },
        bodyClass: 'custom-body',
      },
      true,
      {
        header: (scope: DrawerSlotScope) =>
          h(
            'h3',
            { id: scope.titleId, class: scope.titleClass },
            'Scoped heading',
          ),
        extra: () => h('button', 'Extra'),
        footer: (scope: DrawerSlotScope) =>
          h('button', { onClick: () => scope.close() }, 'Scoped close'),
        closeIcon: () => h('span', { class: 'custom-close' }, 'X'),
      },
    )
    await settle()
    expect(owner.drawer().find('.custom-close').exists()).toBe(true)
    expect(
      owner.drawer().get('.s-drawer__header').attributes('style'),
    ).toContain('color: red')
    expect(owner.drawer().get('.s-drawer__body').classes()).toContain(
      'custom-body',
    )
    const panel = owner.drawer().get('aside')
    expect(panel.attributes('aria-labelledby')).toBe(
      owner.drawer().get('h3').attributes('id'),
    )
    await owner.drawer().get('.s-drawer__footer button').trigger('click')
    await settle()
    expect(owner.value.value).toBe(false)
  })
  it('retains a close control and accessible name without a header', async () => {
    const owner = host({
      withHeader: false,
      title: 'Settings',
      closeIcon: h('span', { class: 'node-close' }, 'Close node'),
    })
    await settle()
    expect(owner.drawer().find('header').exists()).toBe(false)
    expect(owner.drawer().find('.s-drawer__close--floating').exists()).toBe(
      true,
    )
    expect(owner.drawer().find('.node-close').exists()).toBe(true)
    expect(owner.drawer().get('aside').attributes('aria-label')).toBe(
      'Settings',
    )
  })
  it('deduplicates guards, rejects controlled closing, and requires local mask opt-in', async () => {
    const guard = vi.fn(() => Promise.reject(new Error('Unsaved input')))
    const owner = host({ beforeClose: guard })
    await settle()
    await owner.drawer().get('.s-drawer__mask').trigger('click')
    await settle()
    expect(guard).not.toHaveBeenCalled()
    owner.value.value = false
    await settle()
    expect(guard).toHaveBeenCalledTimes(1)
    expect(owner.value.value).toBe(true)
    expect(SNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'Unsaved input',
        dangerousHtmlString: false,
      }),
    )
    let resolve: () => void = () => {}
    const pending = vi.fn(
      () =>
        new Promise<void>((done) => {
          resolve = done
        }),
    )
    owner.options.value = { beforeClose: pending, maskClosable: true }
    await settle()
    const first = owner.drawer().vm.close()
    const second = owner.drawer().vm.close()
    expect(first).toBe(second)
    await flushPromises()
    expect(pending).toHaveBeenCalledTimes(1)
    expect(
      owner.drawer().get('.s-drawer__close').attributes('disabled'),
    ).toBeDefined()
    resolve()
    await first
    await settle()
    expect(owner.value.value).toBe(false)
  })
  it('supports callback approval and cancels pending approvals on owner disposal', async () => {
    let done: (cancel?: boolean) => void = () => {}
    const owner = host({
      beforeClose: (approve: typeof done) => {
        done = approve
      },
    })
    await settle()
    const cancelled = owner.drawer().vm.close()
    await flushPromises()
    done(true)
    expect(await cancelled).toBe(false)
    expect(owner.value.value).toBe(true)
    const closing = owner.drawer().vm.close()
    await flushPromises()
    owner.wrapper.unmount()
    expect(await closing).toBe(false)
    done()
    await settle()
    expect(SNotification).not.toHaveBeenCalled()
  })
  it('uses only the top Escape layer, pushes its parent, and shares scroll locking', async () => {
    const outer = ref(true)
    const inner = ref(false)
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(
            Drawer,
            {
              teleported: false,
              modelValue: outer.value,
              title: 'Outer',
              push: { distance: 96 },
              'onUpdate:modelValue': (value: boolean) => {
                outer.value = value
              },
            },
            {
              default: () =>
                h(
                  Drawer,
                  {
                    modelValue: inner.value,
                    title: 'Inner',
                    'onUpdate:modelValue': (value: boolean) => {
                      inner.value = value
                    },
                  },
                  { default: () => 'Nested' },
                ),
            },
          ),
      }),
      {
        attachTo: document.body,
        global: { stubs: { transition: false } },
      },
    )
    await settle()
    inner.value = true
    await settle()
    const drawers = wrapper.findAllComponents(Drawer)
    expect(drawers[0].get('aside').attributes('style')).toContain('96px')
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        bubbles: true,
      }),
    )
    await settle()
    expect(inner.value).toBe(false)
    expect(outer.value).toBe(true)
    expect(document.body.classList.contains('s-popup-parent--hidden')).toBe(
      true,
    )
    expect(drawers[0].get('aside').attributes('style') || '').not.toContain(
      '96px',
    )
    outer.value = false
    await settle(400)
    expect(document.body.classList.contains('s-popup-parent--hidden')).toBe(
      false,
    )
  })
  it('traps Tab and restores the opener after animation completion', async () => {
    const opener = document.createElement('button')
    document.body.append(opener)
    opener.focus()
    const owner = host({ title: 'Focus' }, false, {
      footer: () => h('button', { class: 'last' }, 'Last action'),
    })
    owner.value.value = true
    await settle()
    const close = owner
      .drawer()
      .get<HTMLButtonElement>('.s-drawer__close').element
    const last = owner.drawer().get<HTMLButtonElement>('.last').element
    last.focus()
    last.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(document.activeElement).toBe(close)
    await owner.drawer().vm.close()
    await settle()
    expect(document.activeElement).toBe(opener)
    opener.remove()
  })
  it('mounts in a selected container and supports a penetrable inline panel', async () => {
    const target = document.createElement('section')
    target.id = 'drawer-mount-test'
    document.body.append(target)
    const owner = host({
      teleported: true,
      getContainer: () => target,
      modal: false,
      modalPenetrable: true,
      lockScroll: false,
      autoFocus: false,
    })
    await settle()
    expect(target.querySelector('.s-drawer')).not.toBeNull()
    expect(owner.drawer().find('.s-drawer__mask').exists()).toBe(false)
    expect(
      target
        .querySelector('.s-drawer__root')
        ?.classList.contains('is-penetrable'),
    ).toBe(true)
    expect(target.querySelector('aside')?.hasAttribute('aria-modal')).toBe(
      false,
    )
    expect(document.body.classList.contains('s-popup-parent--hidden')).toBe(
      false,
    )
    owner.wrapper.unmount()
    target.remove()
  })
  it('cancels delayed openings and is safe to render on the server', async () => {
    const owner = host({ openDelay: 200 }, false)
    owner.value.value = true
    await settle(60)
    expect(owner.drawer().find('aside').exists()).toBe(false)
    owner.value.value = false
    await settle(300)
    expect(owner.drawer().find('aside').exists()).toBe(false)
    expect(
      await renderToString(h(Drawer, { modelValue: true, title: 'SSR' })),
    ).not.toContain('role="dialog"')
  })
  it('resizes with bounds using keyboard and pointer, then cleans pending gesture work', async () => {
    const owner = host({
      size: 300,
      minSize: 180,
      maxSize: 450,
      resizable: true,
    })
    await settle()
    const handle = owner.drawer().get('button[role="separator"]')
    await handle.trigger('keydown', { key: 'ArrowLeft' })
    expect(owner.drawer().emitted('update:size')?.at(-1)).toEqual([310])
    await handle.trigger('keydown', { key: 'End' })
    expect(owner.drawer().emitted('update:size')?.at(-1)).toEqual([450])
    const down1 = new MouseEvent('pointerdown', {
      button: 0,
      clientX: 500,
      bubbles: true,
      cancelable: true,
    })
    Object.defineProperty(down1, 'pointerId', { value: 1 })
    handle.element.dispatchEvent(down1)
    const up = new Event('pointerup')
    Object.assign(up, { pointerId: 1, clientX: 900, clientY: 0 })
    document.dispatchEvent(up)
    await nextTick()
    expect(owner.drawer().emitted('update:size')?.at(-1)).toEqual([180])
    expect(document.body.style.cursor).toBe('')
    const down2 = new MouseEvent('pointerdown', {
      button: 0,
      clientX: 500,
      bubbles: true,
      cancelable: true,
    })
    Object.defineProperty(down2, 'pointerId', { value: 2 })
    handle.element.dispatchEvent(down2)
    const move = new Event('pointermove')
    Object.assign(move, { pointerId: 2, clientX: 300, clientY: 0 })
    document.dispatchEvent(move)
    const drawer = owner.drawer()
    const count = drawer.emitted('update:size')?.length
    owner.wrapper.unmount()
    await settle()
    expect(drawer.emitted('update:size')?.length).toBe(count)
    expect(document.body.style.cursor).toBe('')
  })
})
