import { describe, expect, it } from 'vitest'
import { selectVisibleAnchorSection } from '../src/anchor-active-section'

describe('visible Anchor sections', () => {
  it('selects the section covering most of the readable viewport', () => {
    expect(
      selectVisibleAnchorSection(
        [
          { href: '#previous', top: -200 },
          { href: '#current', top: 220 },
        ],
        124,
        650,
        '#previous',
      ),
    ).toBe('#current')
  })

  it('keeps the current section near an equal-area boundary', () => {
    expect(
      selectVisibleAnchorSection(
        [
          { href: '#previous', top: -200 },
          { href: '#current', top: 380 },
        ],
        124,
        650,
        '#previous',
      ),
    ).toBe('#previous')
  })

  it('does not select a heading below the viewport or an empty viewport', () => {
    expect(
      selectVisibleAnchorSection([{ href: '#later', top: 900 }], 124, 650, ''),
    ).toBeUndefined()
    expect(
      selectVisibleAnchorSection([{ href: '#first', top: 100 }], 650, 124, ''),
    ).toBeUndefined()
  })
})
