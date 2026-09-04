export interface TableClipboardLimits {
  maxCells?: number
  maxCharacters?: number
}

export class TableClipboardLimitError extends RangeError {
  constructor(readonly limit: 'cells' | 'characters') {
    super(`Table clipboard ${limit} limit exceeded`)
    this.name = 'TableClipboardLimitError'
  }
}

export function tableClipboardLimits(options: TableClipboardLimits = {}) {
  const limits = {
    maxCells: options.maxCells ?? 10_000,
    maxCharacters: options.maxCharacters ?? 2_000_000,
  }
  for (const value of Object.values(limits)) {
    if (!Number.isSafeInteger(value) || value < 1)
      throw new TypeError('Clipboard limits must be positive safe integers')
  }
  return limits
}

export function checkTableClipboardArea(
  rows: number,
  columns: number,
  maxCells: number,
) {
  if (
    !Number.isSafeInteger(rows) ||
    rows < 1 ||
    !Number.isSafeInteger(columns) ||
    columns < 1
  )
    throw new TypeError('Clipboard data must have at least one row and column')
  if (rows > Math.floor(maxCells / columns))
    throw new TableClipboardLimitError('cells')
}

/** Plain TSV only: quoted tabs/newlines round-trip without evaluating HTML or formulas. */
export function parseTableClipboardText(
  text: string,
  options?: TableClipboardLimits,
): string[][] {
  const { maxCells, maxCharacters } = tableClipboardLimits(options)
  if (text.length > maxCharacters)
    throw new TableClipboardLimitError('characters')
  const rows: string[][] = []
  let row: string[] = []
  let value = ''
  let quoted = false
  let closed = false
  let started = false
  let width = 0
  let terminator = false
  const field = () => {
    width = Math.max(width, row.length + 1)
    checkTableClipboardArea(rows.length + 1, width, maxCells)
    row.push(value)
    value = ''
    closed = false
    started = false
  }
  const record = () => {
    field()
    rows.push(row)
    row = []
  }
  for (let index = 0; index < text.length; index++) {
    const char = text[index]
    terminator = false
    if (quoted) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          value += '"'
          index++
        } else {
          quoted = false
          closed = true
        }
      } else value += char
      continue
    }
    if (char === '\t') {
      field()
      continue
    }
    if (char === '\n' || char === '\r') {
      record()
      if (char === '\r' && text[index + 1] === '\n') index++
      terminator = true
      continue
    }
    if (closed)
      throw new SyntaxError('Unexpected text after a quoted clipboard field')
    if (!started && char === '"') quoted = true
    else value += char
    started = true
  }
  if (quoted) throw new SyntaxError('Unclosed quoted clipboard field')
  // A final record separator does not create an extra row; quoted empty rows do.
  if (!terminator) record()
  for (const entry of rows) while (entry.length < width) entry.push('')
  return rows
}

/** Quote empty cells too, preserving a final empty row across text applications. */
export function formatTableClipboardText(
  data: readonly (readonly string[])[],
  options?: TableClipboardLimits,
): string {
  const { maxCells, maxCharacters } = tableClipboardLimits(options)
  checkTableClipboardArea(data.length, 1, maxCells)
  let width = 0
  for (const row of data) {
    if (!Array.isArray(row))
      throw new TypeError('Clipboard rows must be arrays')
    width = Math.max(width, row.length)
    checkTableClipboardArea(data.length, Math.max(1, width), maxCells)
  }
  checkTableClipboardArea(data.length, width, maxCells)
  let length = 0
  const rows: string[] = []
  for (const row of data) {
    const cells: string[] = []
    for (let index = 0; index < width; index++) {
      const value = index < row.length ? row[index] : ''
      if (typeof value !== 'string')
        throw new TypeError('Clipboard text cells must be strings')
      if (value.length > maxCharacters - length)
        throw new TableClipboardLimitError('characters')
      const cell =
        !value || /[\t\r\n"]/.test(value)
          ? `"${value.replace(/"/g, '""')}"`
          : value
      length += cell.length + (index > 0 ? 1 : 0)
      if (length > maxCharacters)
        throw new TableClipboardLimitError('characters')
      cells.push(cell)
    }
    length += rows.length > 0 ? 2 : 0
    if (length > maxCharacters) throw new TableClipboardLimitError('characters')
    rows.push(cells.join('\t'))
  }
  return rows.join('\r\n')
}
