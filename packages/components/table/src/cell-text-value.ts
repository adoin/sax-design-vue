import type { TableEditContext } from './table-edit'

/** Default text conversions follow built-in editors; custom data uses a supplied converter. */
export function parseTableCellText(
  value: unknown,
  context: TableEditContext,
): unknown {
  const editor =
    typeof context.column.editor === 'object'
      ? context.column.editor
      : undefined
  if (typeof value !== 'string') return value
  if (editor?.type === 'number') {
    if (!value.trim()) return null
    const number = Number(value)
    if (!Number.isFinite(number))
      throw new TypeError('Cell number is not finite')
    return number
  }
  if (editor?.type === 'switch') {
    if (value === 'true') return true
    if (value === 'false') return false
    throw new TypeError('Cell switch value must be true or false')
  }
  if (editor?.type === 'select') {
    const items = editor.options ?? editor.props?.options
    if (Array.isArray(items)) {
      const option = items.find((item) => String(item.value) === value)
      if (option) return option.value
    }
  }
  if (editor?.type === 'date' && context.value instanceof Date) {
    if (!value) return null
    const date = new Date(value)
    if (!Number.isFinite(date.getTime()))
      throw new TypeError('Cell date is invalid')
    return date
  }
  return value
}
