import { afterEach, describe, expect, it } from 'vitest'
import {
  lockTableRangeOutsideScroll,
  tableRangeScrollParent,
} from '../src/composables/table-range-scroll'

afterEach(() => {
  document.body.innerHTML = ''
  document.documentElement.scrollTop = 0
})

const box = (overflow: string, scroll: number, client: number) => {
  const node = document.createElement('div')
  node.style.overflow = overflow
  node.style.overflowY = overflow
  Object.defineProperty(node, 'scrollHeight', {
    configurable: true,
    get: () => scroll,
  })
  Object.defineProperty(node, 'clientHeight', {
    configurable: true,
    get: () => client,
  })
  return node
}

describe('table range scroll ownership', () => {
  it('uses an inner overflowing body and ignores the page', () => {
    const page = box('auto', 2000, 400)
    const root = box('auto', 200, 200)
    const body = box('auto', 800, 200)
    root.append(body)
    page.append(root)
    document.body.append(page)
    expect(tableRangeScrollParent(root, body)).toBe(body)
    expect(tableRangeScrollParent(root)).toBeUndefined()
  })

  it('restores ancestor scroll without touching the table scroller', () => {
    const page = box('auto', 2000, 400)
    const root = box('auto', 800, 200)
    page.append(root)
    document.body.append(page)
    page.scrollTop = 80
    root.scrollTop = 12
    const unlock = lockTableRangeOutsideScroll(root)
    page.scrollTop = 240
    root.scrollTop = 40
    page.dispatchEvent(new Event('scroll', { bubbles: true }))
    expect(page.scrollTop).toBe(80)
    expect(root.scrollTop).toBe(40)
    unlock()
  })
})
