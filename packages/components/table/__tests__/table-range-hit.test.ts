import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  hitTableRangeCell,
  ownedTableRangeCell,
  tableRangeEdgeDelta,
} from '../src/composables/table-range-hit'

const viewport = { left: 0, top: 0, right: 300, bottom: 200 }
const setup = () => {
  const root = document.createElement('div')
  root.innerHTML = `<div role="table">
    <div data-table-row-index="0"><div role="cell" data-column-index="0" id="left"><span>Left</span></div><div role="cell" data-column-index="1" id="center"></div></div>
    <div data-table-group-band><div role="cell" data-column-index="0" id="group"></div></div>
    <div data-footer-row-index="0"><div role="cell" data-column-index="0" id="footer"></div></div>
    <div data-merge-region="1" id="merge"></div>
    <div data-merge-region="2" class="is-footer-merge" id="footer-merge"></div>
    <div role="table"><div data-table-row-index="0"><div role="cell" data-column-index="0" id="nested"></div></div></div>
  </div>`
  document.body.append(root)
  const get = (id: string) => root.querySelector<HTMLElement>(`#${id}`)!
  const rect = (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) =>
    vi.spyOn(get(id), 'getBoundingClientRect').mockReturnValue({
      x,
      y,
      width,
      height,
      left: x,
      top: y,
      right: x + width,
      bottom: y + height,
      toJSON: () => ({}),
    })
  const hit = vi.fn<(x: number, y: number) => Element | null>(() => null)
  Object.defineProperty(document, 'elementFromPoint', {
    configurable: true,
    value: hit,
  })
  return { root, get, rect, hit }
}
afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('table range DOM hit projection', () => {
  it('owns body cells and merge continuations, excluding groups, footer and nested tables', () => {
    const { root, get } = setup()
    expect(ownedTableRangeCell(root, get('left').firstElementChild)).toBe(
      get('left'),
    )
    expect(ownedTableRangeCell(root, get('merge'))).toBe(get('merge'))
    for (const id of ['group', 'footer', 'footer-merge', 'nested'])
      expect(ownedTableRangeCell(root, get(id))).toBeUndefined()
    expect(ownedTableRangeCell(root, document.body)).toBeUndefined()
  })

  it('clamps an outside pointer to the visible viewport before hit testing', () => {
    const { root, get, hit } = setup()
    hit.mockReturnValue(get('left'))
    expect(hitTableRangeCell(root, -40, 800, viewport)).toBe(get('left'))
    expect(hit).toHaveBeenCalledWith(0.5, 199.5)
    expect(
      hitTableRangeCell(root, 0, 0, { ...viewport, right: 0 }),
    ).toBeUndefined()
  })

  it('chooses the nearest mounted data cell across a group/detail gap and ignores offscreen cells', () => {
    const { root, get, rect } = setup()
    rect('left', 0, 0, 100, 40)
    rect('center', 100, 100, 100, 40)
    rect('merge', 0, 500, 200, 100)
    rect('group', 0, 40, 300, 60)
    rect('nested', 140, 60, 60, 40)
    expect(hitTableRangeCell(root, 150, 80, viewport)).toBe(get('center'))
  })

  it('rejects a scrolling cell hidden underneath the fixed pane', () => {
    const { root, get, rect, hit } = setup()
    rect('left', 0, 0, 100, 40)
    rect('center', 0, 0, 100, 40)
    hit.mockImplementation((_, y) => (y < 40 ? get('left') : null))
    expect(hitTableRangeCell(root, 30, 60, viewport)).toBe(get('left'))
  })

  it('selects a merged continuation even when the origin is not mounted', () => {
    const { root, get, rect } = setup()
    rect('merge', 50, 80, 200, 100)
    expect(hitTableRangeCell(root, 260, 170, viewport)).toBe(get('merge'))
  })
})

describe('range edge speed', () => {
  it('ramps near either edge, stays still in the middle and caps outside the viewport', () => {
    expect(tableRangeEdgeDelta(50, 0, 100, 20, 12)).toBe(0)
    expect(tableRangeEdgeDelta(10, 0, 100, 20, 12)).toBe(-6)
    expect(tableRangeEdgeDelta(90, 0, 100, 20, 12)).toBe(6)
    expect(tableRangeEdgeDelta(-1000, 0, 100, 20, 12)).toBe(-12)
    expect(tableRangeEdgeDelta(1000, 0, 100, 20, 12)).toBe(12)
  })
  it('handles narrow viewports, disabled speed and invalid geometry without NaN', () => {
    expect(tableRangeEdgeDelta(2, 0, 4)).toBe(0)
    expect(tableRangeEdgeDelta(1, 0, 4)).toBe(-8)
    expect(tableRangeEdgeDelta(1, 0, 4, 40, 0)).toBe(0)
    expect(tableRangeEdgeDelta(1, 0, 0)).toBe(0)
    expect(tableRangeEdgeDelta(Number.NaN, 0, 4)).toBe(0)
    expect(tableRangeEdgeDelta(0, 0, 100, Number.NaN, Number.NaN)).toBe(-16)
  })
})
