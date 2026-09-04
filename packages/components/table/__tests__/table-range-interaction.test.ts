import { defineComponent, h, nextTick, shallowRef } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useTableCellRange } from '../src/composables/use-table-cell-range'
import { useTableRangeInteraction } from '../src/composables/use-table-range-interaction'
import type { TableCellCoordinate } from '../src/composables/use-table-keyboard'
import type { TableCellRange, TableRangeConfig } from '../src/table-cell-range'

const settle = async () => {
  await nextTick()
  await flushPromises()
  await nextTick()
}
const wrappers: { unmount(): void }[] = []
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

function setup(
  controlled = false,
  slow = false,
  hintsOnly = false,
  merged = false,
) {
  const model = shallowRef<TableCellRange | null | undefined>(
    controlled ? null : undefined,
  )
  const accept = shallowRef(false)
  const blocked = shallowRef(false)
  const config = shallowRef<boolean | TableRangeConfig>(true)
  const rows = shallowRef([0, 1, 2, 3])
  const current = shallowRef<TableCellCoordinate>()
  const root = shallowRef<HTMLElement>()
  const frames = new Map<number, FrameRequestCallback>()
  let frameId = 0
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((fn) => {
    frames.set(++frameId, fn)
    return frameId
  })
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
    frames.delete(id)
  })
  const at = (row: number, col: number): TableCellCoordinate | undefined =>
    row < 0 || row >= rows.value.length || col < 0 || col > 3
      ? undefined
      : {
          row: merged ? 0 : row,
          position: merged ? 0 : col,
          column: merged ? 0 : col,
          ...(merged ? { viewRow: row, viewColumn: col } : {}),
          address: {
            rowKey: rows.value[merged ? 0 : row],
            columnKey: String(merged ? 0 : col),
          },
        }
  const focus = vi.fn((point: TableCellCoordinate) => {
    current.value = point
    return true
  })
  const scrollBy = vi.fn()
  const onUpdate = vi.fn((value: TableCellRange | null) => {
    if (accept.value) model.value = value
  })
  let state!: ReturnType<typeof useTableCellRange>
  let interaction!: ReturnType<typeof useTableRangeInteraction>
  const wrapper = mount(
    defineComponent({
      setup() {
        state = useTableCellRange({
          config: () => config.value,
          value: () => model.value,
          disabled: () => false,
          limits: () => ({ rows: rows.value.length, columns: 4 }),
          resolve: (address, hint) => {
            if (
              hintsOnly &&
              (!hint ||
                hint.address.rowKey !== address.rowKey ||
                hint.address.columnKey !== address.columnKey)
            )
              return
            return at(
              hintsOnly
                ? hint!.row
                : rows.value.indexOf(Number(address.rowKey)),
              Number(address.columnKey),
            )
          },
          merges: () =>
            merged ? [{ rowStart: 0, rowEnd: 4, colStart: 0, colEnd: 4 }] : [],
          context: [rows],
          onUpdate,
          onChange: vi.fn(),
          onError: vi.fn(),
          ...(slow
            ? { batchSize: 1, yieldControl: () => new Promise<void>(() => {}) }
            : {}),
        })
        interaction = useTableRangeInteraction(state, {
          root: () => root.value,
          viewport: () => ({ left: 0, top: 0, right: 400, bottom: 160 }),
          fromElement: (el) =>
            at(
              Number(el.parentElement!.dataset.tableRowIndex),
              Number(el.dataset.columnIndex),
            ),
          current: () => current.value,
          at,
          count: () => ({ rows: rows.value.length, columns: 4 }),
          move: (point, key) =>
            at(
              point.row +
                (key === 'ArrowDown' ? 1 : key === 'ArrowUp' ? -1 : 0),
              point.position +
                (key === 'ArrowRight' ? 1 : key === 'ArrowLeft' ? -1 : 0),
            ),
          focus,
          scrollBy,
          blocked: () => blocked.value,
          context: [rows],
        })
        return () =>
          h(
            'div',
            {
              ref: root,
              tabindex: 0,
              onPointerdown: interaction.onPointerdown,
              onKeydown: interaction.onKeydown,
              onClickCapture: interaction.onClickCapture,
            },
            [
              h(
                'div',
                { role: 'table' },
                rows.value.map((_, r) =>
                  h(
                    'div',
                    {
                      role: 'row',
                      'data-table-row-index': r,
                    },
                    Array.from({ length: 4 }, (_, c) =>
                      h(
                        'div',
                        {
                          role: 'cell',
                          'data-column-index': c,
                          tabindex: -1,
                        },
                        `${r}:${c}`,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          )
      },
    }),
    { attachTo: document.body },
  )
  wrappers.push(wrapper)
  const cell = (r = 0, c = 0) =>
    root.value!.querySelector<HTMLElement>(
      `[data-table-row-index="${r}"] [data-column-index="${c}"]`,
    )!
  Object.defineProperty(document, 'elementFromPoint', {
    configurable: true,
    value: vi.fn((x: number, y: number) =>
      cell(Math.min(3, Math.floor(y / 40)), Math.min(3, Math.floor(x / 100))),
    ),
  })
  const pointer = (
    type: string,
    target: Element | Document = cell(),
    x = 50,
    y = 20,
    init: Record<string, unknown> = {},
  ) => {
    const event = new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      ...init,
    })
    Object.defineProperties(event, {
      pointerId: { value: init.pointerId ?? 1 },
      pointerType: { value: init.pointerType ?? 'mouse' },
      isPrimary: { value: true },
    })
    target.dispatchEvent(event)
    return event
  }
  const key = (
    key: string,
    init: KeyboardEventInit = {},
    target: HTMLElement = root.value!,
  ) => {
    const event = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key,
      ...init,
    })
    target.dispatchEvent(event)
    return event
  }
  const frame = (time = 16) => {
    const entries = [...frames.values()]
    frames.clear()
    entries.forEach((fn) => fn(time))
  }
  return {
    state,
    interaction,
    rows,
    model,
    accept,
    config,
    blocked,
    current,
    root,
    frames,
    focus,
    scrollBy,
    onUpdate,
    wrapper,
    cell,
    pointer,
    key,
    frame,
  }
}

describe('table range gestures', () => {
  it('restores sparse-source endpoint hints when a replacement drag is cancelled', async () => {
    const t = setup(false, false, true)
    await settle()
    t.key('ArrowRight')
    await settle()
    const previous = t.state.getRange()
    t.pointer('pointerdown', t.cell(2, 2), 250, 100)
    await settle()
    expect(t.state.getRange()?.anchor.rowKey).toBe(2)
    t.pointer('pointercancel', document)
    await settle()
    expect(t.state.getRange()).toEqual(previous)
  })
  it('focuses the latest merged continuation without returning to the original virtual window', async () => {
    const t = setup(false, false, false, true)
    await settle()
    t.pointer('pointerdown')
    await settle()
    t.pointer('pointermove', document, 350, 140)
    t.frame()
    t.pointer('pointerup', document, 350, 140)
    await settle()
    expect(t.onUpdate).toHaveBeenCalledTimes(1)
    expect(t.focus.mock.calls[0][0]).toMatchObject({
      viewRow: 3,
      viewColumn: 3,
      address: { rowKey: 0, columnKey: '0' },
    })
  })
  it('preserves sparse-source endpoint hints through drag and rapid keyboard extension', async () => {
    const t = setup(false, false, true)
    await settle()
    t.pointer('pointerdown')
    // The first model has not been published when the next pointer frame arrives.
    t.pointer('pointermove', document, 250, 100)
    t.frame()
    t.pointer('pointerup', document, 350, 140)
    await settle()
    expect(t.state.getBounds()).toEqual({
      rowStart: 0,
      rowEnd: 4,
      colStart: 0,
      colEnd: 4,
    })
    t.key('Home', { ctrlKey: true })
    await settle()
    t.key('ArrowRight', { shiftKey: true })
    t.key('ArrowDown', { shiftKey: true })
    t.key('ArrowRight', { shiftKey: true })
    await settle()
    expect(t.state.getBounds()).toEqual({
      rowStart: 0,
      rowEnd: 2,
      colStart: 0,
      colEnd: 3,
    })
    t.key('a', { ctrlKey: true })
    await settle()
    expect(t.state.getBounds()).toEqual({
      rowStart: 0,
      rowEnd: 4,
      colStart: 0,
      colEnd: 4,
    })
    t.pointer('pointerdown', t.cell(1, 1), 150, 60, { shiftKey: true })
    t.pointer('pointerup', document, 150, 60)
    await settle()
    expect(t.state.getBounds()).toEqual({
      rowStart: 0,
      rowEnd: 2,
      colStart: 0,
      colEnd: 2,
    })
  })
  it('coalesces pointer movement, selects the final endpoint and suppresses only the drag click', async () => {
    const t = setup()
    await settle()
    expect(t.pointer('pointerdown').defaultPrevented).toBe(true)
    await settle()
    t.pointer('pointermove', document, 150, 65)
    t.pointer('pointermove', document, 250, 105)
    expect(t.state.getBounds()?.rowEnd).toBe(1)
    t.frame()
    await settle()
    expect(t.state.getBounds()).toEqual({
      rowStart: 0,
      rowEnd: 3,
      colStart: 0,
      colEnd: 3,
    })
    t.pointer('pointerup', document, 350, 140)
    await settle()
    expect(t.state.getRange()?.focus).toEqual({ rowKey: 3, columnKey: '3' })
    expect(t.focus).toHaveBeenCalledTimes(1)
    expect(t.frames.size).toBe(0)
    expect(t.root.value!.style.userSelect).toBe('')
    expect(
      t.pointer('click', t.cell(), 50, 20, { detail: 1 }).defaultPrevented,
    ).toBe(true)
    expect(
      t.pointer('click', t.cell(), 50, 20, { detail: 1 }).defaultPrevented,
    ).toBe(false)
  })

  it('keeps the original anchor across rapid Shift navigation before promises settle', async () => {
    const t = setup()
    await settle()
    t.current.value = {
      row: 1,
      column: 1,
      position: 1,
      address: { rowKey: 1, columnKey: '1' },
    }
    t.key('ArrowRight', { shiftKey: true })
    t.key('ArrowDown', { shiftKey: true })
    t.key('ArrowRight', { shiftKey: true })
    await settle()
    expect(t.state.getRange()).toEqual({
      anchor: { rowKey: 1, columnKey: '1' },
      focus: { rowKey: 2, columnKey: '3' },
    })
    expect(t.focus).toHaveBeenCalledTimes(1)
    t.key('ArrowLeft')
    await settle()
    expect(t.state.getBounds()).toEqual({
      rowStart: 2,
      rowEnd: 3,
      colStart: 2,
      colEnd: 3,
    })
  })

  it('supports Shift click, select-all, Home/End and clear without resetting focus', async () => {
    const t = setup()
    await settle()
    t.key('ArrowRight')
    await settle()
    t.pointer('pointerdown', t.cell(2, 2), 250, 100, { shiftKey: true })
    t.pointer('pointerup', document, 250, 100)
    await settle()
    expect(t.state.getBounds()).toEqual({
      rowStart: 0,
      rowEnd: 3,
      colStart: 1,
      colEnd: 3,
    })
    t.key('a', { ctrlKey: true })
    await settle()
    expect(t.state.getBounds()).toEqual({
      rowStart: 0,
      rowEnd: 4,
      colStart: 0,
      colEnd: 4,
    })
    t.key('Home')
    await settle()
    expect(t.state.getRange()?.focus).toEqual({ rowKey: 3, columnKey: '0' })
    t.key('End', { ctrlKey: true, shiftKey: true })
    await settle()
    expect(t.state.getBounds()).toEqual({
      rowStart: 3,
      rowEnd: 4,
      colStart: 0,
      colEnd: 4,
    })
    const calls = t.focus.mock.calls.length
    t.key('Escape')
    await settle()
    expect(t.state.getRange()).toBeNull()
    expect(t.focus).toHaveBeenCalledTimes(calls)
  })

  it.each(['pointercancel', 'escape', 'blur'])(
    'restores the previous range on %s and removes the active frame',
    async (event) => {
      const t = setup()
      await settle()
      t.key('ArrowDown')
      await settle()
      const before = t.state.getRange()
      t.pointer('pointerdown')
      t.pointer('pointermove', document, 350, 150)
      t.frame()
      await settle()
      if (event === 'escape') t.key('Escape')
      else if (event === 'blur') window.dispatchEvent(new Event('blur'))
      else t.pointer(event, document)
      await settle()
      expect(t.state.getRange()).toEqual(before)
      expect(t.interaction.dragging.value).toBe(false)
      expect(t.frames.size).toBe(0)
      expect(t.root.value!.style.cursor).toBe('')
    },
  )

  it('scrolls logical pixels at both viewport edges and ignores a different pointer', async () => {
    const t = setup()
    await settle()
    t.pointer('pointerdown')
    t.pointer('pointermove', document, 800, 300, { pointerId: 9 })
    t.frame()
    expect(t.scrollBy).not.toHaveBeenCalled()
    t.pointer('pointermove', document, 800, 300)
    t.frame(32)
    expect(t.scrollBy.mock.calls[0][0]).toBeGreaterThan(0)
    expect(t.scrollBy.mock.calls[0][1]).toBeGreaterThan(0)
    expect(t.scrollBy.mock.calls[0][0]).toBeLessThanOrEqual(32)
    t.config.value = { autoScroll: false }
    t.frame(48)
    expect(t.scrollBy).toHaveBeenCalledTimes(1)
    t.blocked.value = true
    expect(t.frames.size).toBe(0)
  })

  it('does not steal keys from controls, IME, modified arrows or touch gestures', async () => {
    const t = setup()
    await settle()
    const input = document.createElement('input')
    t.cell().append(input)
    expect(t.key('ArrowRight', {}, input).defaultPrevented).toBe(false)
    expect(t.key('ArrowRight', { isComposing: true }).defaultPrevented).toBe(
      false,
    )
    expect(t.key('ArrowRight', { ctrlKey: true }).defaultPrevented).toBe(false)
    expect(
      t.pointer('pointerdown', t.cell(), 20, 20, { pointerType: 'touch' })
        .defaultPrevented,
    ).toBe(false)
    expect(t.pointer('pointerdown', input).defaultPrevented).toBe(false)
    expect(t.frames.size).toBe(0)
    expect(t.onUpdate).not.toHaveBeenCalled()
  })

  it('does not focus a rejected controlled range', async () => {
    const t = setup(true)
    await settle()
    t.key('ArrowRight')
    await settle()
    expect(t.state.getBounds()).toBeNull()
    expect(t.focus).not.toHaveBeenCalled()
    t.accept.value = true
    t.key('ArrowDown')
    await settle()
    expect(t.state.getRange()?.focus).toEqual({ rowKey: 1, columnKey: '0' })
    expect(t.focus).toHaveBeenCalledTimes(1)
  })

  it('allows context reconciliation to finish after cancelling an active gesture', async () => {
    const t = setup()
    await settle()
    t.pointer('pointerdown', t.cell(1, 1), 150, 60)
    await settle()
    t.rows.value = [3, 2, 1, 0]
    await settle()
    expect(t.interaction.dragging.value).toBe(false)
    expect(t.state.getRange()?.anchor.rowKey).toBe(1)
    expect(t.state.getBounds()?.rowStart).toBe(2)
    expect(t.state.pending.value).toBe(false)
  })

  it.each(['outside', 'control', 'tab', 'escape', 'unmount'])(
    'cancels pending keyboard work on %s',
    async (action) => {
      const t = setup(false, true)
      await settle()
      t.key('ArrowRight')
      await nextTick()
      expect(t.state.pending.value).toBe(true)
      if (action === 'unmount') t.wrapper.unmount()
      else if (action === 'tab')
        expect(t.key('Tab').defaultPrevented).toBe(false)
      else if (action === 'escape') t.key('Escape')
      else {
        const input = document.createElement('input')
        if (action === 'control') t.cell().append(input)
        else document.body.append(input)
        input.focus()
      }
      await settle()
      expect(t.state.pending.value).toBe(false)
      expect(t.focus).not.toHaveBeenCalled()
      expect(t.state.getRange()).toBeNull()
    },
  )
})
