import { h, nextTick, shallowRef } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import { SContextMenu } from '../../context-menu'
import { SPopper } from '../../popper'
import type {
  TableContextMenuContext,
  TableContextMenuSelectParams,
  TableRowKey,
} from '../src/table'

const data = [
  { id: 1, name: 'Alpha' },
  { id: 2, name: 'Beta' },
]
const columns = [
  { field: 'name', title: 'Name', editor: true },
  { field: 'id', title: 'ID', fixed: 'right' as const },
]
const menus = {
  header: [{ label: 'Header', value: 'head' }],
  body: [{ label: 'Inspect', value: 'inspect' }],
  footer: [{ label: 'Summary', value: 'summary' }],
}
const wrappers: { unmount(): void }[] = []
const scrollToDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollTo',
)
const intoView = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView',
)
const setup = (extra = {}, slots = {}) => {
  const wrapper = mount(Table, {
    attachTo: document.body,
    props: {
      data,
      columns,
      rowKey: 'id',
      footerData: [{ name: 'Total', id: 3 }],
      contextMenuConfig: menus,
      ...extra,
    },
    slots,
  })
  wrappers.push(wrapper)
  return wrapper
}
const settle = async () => {
  await nextTick()
  await flushPromises()
  await nextTick()
}
const invoke = async (element: Element, keyboard = false) => {
  const event = keyboard
    ? new KeyboardEvent('keydown', {
        key: 'F10',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      })
    : new MouseEvent('contextmenu', {
        clientX: 100,
        clientY: 130,
        bubbles: true,
        cancelable: true,
      })
  element.dispatchEvent(event)
  await settle()
  return event
}
beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  })
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
  for (const key of ['clientWidth', 'offsetWidth'] as const)
    vi.spyOn(HTMLElement.prototype, key, 'get').mockReturnValue(600)
  for (const key of ['clientHeight', 'offsetHeight'] as const)
    vi.spyOn(HTMLElement.prototype, key, 'get').mockReturnValue(200)
  vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(
    function (this: HTMLElement) {
      return (
        Number.parseFloat(
          this.querySelector<HTMLElement>('.s-vl__content')?.style.height ?? '',
        ) || 200
      )
    },
  )
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    configurable: true,
    value(this: HTMLElement, options: ScrollToOptions) {
      if (options.top != null) this.scrollTop = options.top
      if (options.left != null) this.scrollLeft = options.left
      this.dispatchEvent(new Event('scroll'))
    },
  })
})
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  if (scrollToDescriptor)
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', scrollToDescriptor)
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollTo')
  if (intoView)
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', intoView)
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
})

describe('table context menus', () => {
  it('keeps native menus by default, for empty regions and for disabled predicates', async () => {
    const wrapper = setup({ contextMenuConfig: false })
    const cell = wrapper.get('.s-table__data-cell').element
    expect((await invoke(cell)).defaultPrevented).toBe(false)
    await wrapper.setProps({ contextMenuConfig: { header: menus.header } })
    expect((await invoke(cell)).defaultPrevented).toBe(false)
    await wrapper.setProps({
      contextMenuConfig: { ...menus, visibleMethod: () => false },
    })
    expect((await invoke(cell)).defaultPrevented).toBe(false)
    await wrapper.setProps({
      contextMenuConfig: {
        body: () => {
          throw new Error('not available')
        },
      },
    })
    expect((await invoke(cell)).defaultPrevented).toBe(false)
    expect(wrapper.emitted('contextMenuOpen')).toBeUndefined()
  })
  it('provides distinct header, body and footer contexts through the shared teleported menu', async () => {
    const wrapper = setup()
    for (const [selector, area] of [
      ['[role="columnheader"]', 'header'],
      ['.s-table__data-cell', 'body'],
      ['.s-table__footer-cell', 'footer'],
    ] as const) {
      const cell = wrapper.get(selector).element
      expect((await invoke(cell)).defaultPrevented).toBe(true)
      const context = wrapper
        .emitted('contextMenuOpen')
        ?.at(-1)?.[0] as TableContextMenuContext
      expect(context.area).toBe(area)
      expect(context.column.field).toBe('name')
      expect(document.activeElement?.getAttribute('role')).toBe('menuitem')
      expect(wrapper.element.contains(document.activeElement)).toBe(false)
      ;(document.activeElement as HTMLButtonElement).click()
      await settle()
      const result = wrapper
        .emitted('contextMenuSelect')
        ?.at(-1)?.[0] as TableContextMenuSelectParams
      expect(result.context).toBe(context)
      expect(document.activeElement).toBe(cell)
    }
    expect(wrapper.findComponent(SContextMenu).exists()).toBe(true)
    expect(
      wrapper
        .getComponent(SContextMenu)
        .getComponent(SPopper)
        .props('teleported'),
    ).toBe(true)
    expect(wrapper.emitted('update:highlight')).toBeUndefined()
  })
  it('supports Shift+F10, disabled items, wrapping navigation and Escape focus restoration', async () => {
    const wrapper = setup({
      contextMenuConfig: {
        body: [
          { label: 'Disabled', value: 0, disabled: true },
          { label: 'First', value: 1 },
          { label: 'Last', value: 2 },
        ],
      },
    })
    const cell = wrapper.get<HTMLElement>('.s-table__data-cell').element
    cell.focus()
    await invoke(cell, true)
    expect(document.activeElement?.textContent).toBe('First')
    document.activeElement?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }),
    )
    expect(document.activeElement?.textContent).toBe('Last')
    document.activeElement?.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
    )
    await settle()
    expect(document.activeElement).toBe(cell)
    expect(wrapper.emitted('contextMenuClose')).toHaveLength(1)
  })
  it('reactively updates dynamic disabled items and keeps keepOpen actions open', async () => {
    const disabled = shallowRef(false)
    const wrapper = setup({
      contextMenuConfig: {
        body: (context: TableContextMenuContext) => [
          {
            value: 'inspect',
            label: `${context.area}: ${context.column.field}`,
            disabled: disabled.value,
            keepOpen: true,
          },
        ],
      },
    })
    await invoke(wrapper.get('.s-table__data-cell').element)
    const button = document.activeElement as HTMLButtonElement
    button.click()
    await settle()
    expect(wrapper.emitted('contextMenuSelect')).toHaveLength(1)
    expect(wrapper.emitted('contextMenuClose')).toBeUndefined()
    disabled.value = true
    await settle()
    expect(button.disabled).toBe(true)
    button.click()
    expect(wrapper.emitted('contextMenuSelect')).toHaveLength(1)
    wrapper.vm.closeContextMenu()
    expect(wrapper.emitted('contextMenuClose')).toHaveLength(1)
  })
  it('closes stale contexts on scrolling and data replacement', async () => {
    const wrapper = setup()
    await invoke(wrapper.get('.s-table__data-cell').element)
    wrapper.get('.s-table').element.dispatchEvent(new Event('scroll'))
    await settle()
    expect(wrapper.emitted('contextMenuClose')).toHaveLength(1)
    await invoke(wrapper.get('.s-table__data-cell').element)
    await wrapper.setProps({ data: [...data] })
    expect(wrapper.emitted('contextMenuClose')).toHaveLength(2)
  })
  it('leaves editing controls and IME shortcuts alone', async () => {
    const wrapper = setup({ editConfig: true })
    await wrapper.get('.s-table__data-cell').trigger('dblclick')
    await settle()
    const input = wrapper.get('.s-table__cell-editor input').element
    expect((await invoke(input)).defaultPrevented).toBe(false)
    expect((await invoke(input, true)).defaultPrevented).toBe(false)
    const event = new KeyboardEvent('keydown', {
      key: 'F10',
      shiftKey: true,
      isComposing: true,
      bubbles: true,
      cancelable: true,
    })
    wrapper.get('.s-table__data-cell').element.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    expect(wrapper.emitted('contextMenuOpen')).toBeUndefined()
  })
  it('reports a grouped header rather than its first leaf', async () => {
    const wrapper = setup({ columns: [{ title: 'Group', children: columns }] })
    await invoke(wrapper.get('.is-group-header').element, true)
    const context = wrapper
      .emitted('contextMenuOpen')
      ?.at(-1)?.[0] as TableContextMenuContext
    expect(context).toMatchObject({
      area: 'header',
      group: true,
      column: { title: 'Group' },
    })
  })
  it('does not turn an inner table cell into an outer menu target', async () => {
    const wrapper = setup(
      {},
      {
        'cell-name': () =>
          h(Table, {
            data,
            columns,
            contextMenuConfig: { body: [{ label: 'Inner', value: 'inner' }] },
          }),
      },
    )
    const inner = wrapper.findAllComponents(Table)[0]
    await invoke(inner.get('.s-table__data-cell').element)
    expect(wrapper.emitted('contextMenuOpen')).toBeUndefined()
    expect(inner.emitted('contextMenuOpen')).toHaveLength(1)
  })
  it('resolves generated source and footer indices at the two-axis boundary', async () => {
    const row = vi.fn((index) => ({ id: index }))
    const wrapper = setup({
      keyboardConfig: { rowIndexOf: (key: TableRowKey) => Number(key) },
      virtualConfig: { height: 200, horizontal: true, dynamic: true },
      virtualSource: {
        rowCount: 1_000_000,
        columnCount: 100_000,
        fixedLeftCount: 1,
        fixedRightCount: 1,
        rowKey: (index: number) => index,
        row,
        columnWidth: () => 140,
        column: (index: number) => ({
          field: 'id',
          title: String(index),
          width: 140,
        }),
      },
    })
    await settle()
    expect(await wrapper.vm.setActiveCell(999999, 99998)).toBe(true)
    const cell = document.activeElement!
    await invoke(cell, true)
    expect(wrapper.emitted('contextMenuOpen')?.at(-1)?.[0]).toMatchObject({
      area: 'body',
      rowKey: 999999,
      rowIndex: 999999,
      columnIndex: 99998,
    })
    wrapper.vm.closeContextMenu()
    expect(document.activeElement).toBe(cell)
    await invoke(
      wrapper.get('.s-table__footer-cell[data-column-index="99999"]').element,
      true,
    )
    expect(wrapper.emitted('contextMenuOpen')?.at(-1)?.[0]).toMatchObject({
      area: 'footer',
      rowIndex: 0,
      columnIndex: 99999,
      value: 3,
    })
    expect(wrapper.findAll('.s-table__data-row').length).toBeLessThan(30)
    expect(row.mock.calls.length).toBeLessThan(2000)
  })
  it('cancels pending menu focus when unmounted', async () => {
    const wrapper = setup()
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    })
    wrapper.get('.s-table__data-cell').element.dispatchEvent(event)
    wrapper.unmount()
    wrappers.splice(wrappers.indexOf(wrapper), 1)
    await settle()
    expect(document.querySelector('.s-context-menu__panel')).toBeNull()
    expect(wrapper.emitted('contextMenuClose')).toHaveLength(1)
  })
})
