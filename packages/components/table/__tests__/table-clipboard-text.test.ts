import { describe, expect, it } from 'vitest'
import {
  TableClipboardLimitError,
  checkTableClipboardArea,
  formatTableClipboardText,
  parseTableClipboardText,
} from '../src/clipboard-text'

describe('Table clipboard text codec', () => {
  it('round-trips tabs, quotes, line breaks, Unicode and final empty rows', () => {
    const rows = [
      ['项目', 'a\tb', '"quoted"', 'first\r\nsecond', '😀'],
      ['1', '2', '3', '\r\n', ''],
      ['', '', '', '', ''],
    ]
    expect(parseTableClipboardText(formatTableClipboardText(rows))).toEqual(
      rows,
    )
  })
  it('accepts spreadsheet record separators and pads ragged rows without shifting cells', () => {
    expect(parseTableClipboardText('A\tB\r\nC\rD\tE\t\n')).toEqual([
      ['A', 'B', ''],
      ['C', '', ''],
      ['D', 'E', ''],
    ])
    expect(parseTableClipboardText('')).toEqual([['']])
    expect(parseTableClipboardText('\n')).toEqual([['']])
    expect(parseTableClipboardText('\n\n')).toEqual([[''], ['']])
    expect(parseTableClipboardText('""\r\n""')).toEqual([[''], ['']])
    expect(
      parseTableClipboardText(formatTableClipboardText([['A', 'B'], []])),
    ).toEqual([
      ['A', 'B'],
      ['', ''],
    ])
  })
  it('preserves plain text, formulas and markup verbatim', () => {
    const rows = [
      ['=SUM(A1:A4)', '<script>alert(1)</script>', ' 01 ', 'x"y', '\uFEFFBOM'],
    ]
    expect(parseTableClipboardText(formatTableClipboardText(rows))).toEqual(
      rows,
    )
    expect(parseTableClipboardText('x"y')).toEqual([['x"y']])
  })
  it('rejects malformed quotes before yielding any data', () => {
    for (const text of ['A\t"unfinished', '"x"tail', '"x" "y"']) {
      expect(() => parseTableClipboardText(text)).toThrow(SyntaxError)
    }
  })
  it('bounds padded rectangle size as well as actual input cells', () => {
    expect(() =>
      parseTableClipboardText('A\nB\nC\tD', { maxCells: 5 }),
    ).toThrow(TableClipboardLimitError)
    expect(() =>
      formatTableClipboardText([['A'], ['B'], ['C', 'D']], { maxCells: 5 }),
    ).toThrow(TableClipboardLimitError)
    expect(parseTableClipboardText('A\tB', { maxCells: 2 })).toEqual([
      ['A', 'B'],
    ])
    expect(() => checkTableClipboardArea(1_000_000, 100_000, 10_000)).toThrow(
      TableClipboardLimitError,
    )
    expect(() =>
      checkTableClipboardArea(
        Number.MAX_SAFE_INTEGER,
        2,
        Number.MAX_SAFE_INTEGER,
      ),
    ).toThrow(TableClipboardLimitError)
  })
  it('counts escaping and record separators toward the text limit', () => {
    expect(() =>
      parseTableClipboardText('12345', { maxCharacters: 4 }),
    ).toThrow(TableClipboardLimitError)
    expect(() =>
      formatTableClipboardText([['"']], { maxCharacters: 3 }),
    ).toThrow(TableClipboardLimitError)
    expect(() =>
      formatTableClipboardText([['A'], ['B']], { maxCharacters: 3 }),
    ).toThrow(TableClipboardLimitError)
    expect(formatTableClipboardText([['A'], ['B']], { maxCharacters: 4 })).toBe(
      'A\r\nB',
    )
  })
  it('rejects invalid dimensions and unbounded limits before allocation', () => {
    for (const maxCells of [0, -1, 1.5, Infinity, Number.NaN]) {
      expect(() => parseTableClipboardText('a', { maxCells })).toThrow(
        TypeError,
      )
    }
    expect(() => formatTableClipboardText([])).toThrow(TypeError)
    expect(() => formatTableClipboardText([[]])).toThrow(TypeError)
    expect(() =>
      formatTableClipboardText(Array.from({ length: 20_000 }, () => [])),
    ).toThrow(TableClipboardLimitError)
    expect(() =>
      formatTableClipboardText([[1] as unknown as string[]]),
    ).toThrow(TypeError)
  })
})
