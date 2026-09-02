import type { TableRow, TableSortMethod, TableSortOrder } from './table'

const naturalCollator = new Intl.Collator(undefined, { numeric: true })
const stringCollator = new Intl.Collator(undefined, { numeric: false })

const numericValue = (value: unknown) => {
  if (typeof value !== 'number' && typeof value !== 'string') return null
  if (typeof value === 'string' && !value.trim()) return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

const comparisonSign = (result: boolean | number) =>
  typeof result === 'boolean'
    ? Number(result)
    : Number.isNaN(result)
      ? 0
      : Math.sign(result)

export function compareTableValues(
  a: unknown,
  b: unknown,
  rowA: TableRow,
  rowB: TableRow,
  method: TableSortMethod | undefined,
  order: TableSortOrder,
): number {
  const av = method === 'number' ? numericValue(a) : a
  const bv = method === 'number' ? numericValue(b) : b
  // Missing values always trail valid values, independently of direction.
  if (av == null || bv == null) return av == null ? (bv == null ? 0 : 1) : -1

  let diff: number
  if (typeof method === 'function') {
    diff = comparisonSign(method(av, bv, rowA, rowB))
    // A predicate's false/0 means "not after", not necessarily equality.
    // Check the reverse pair to distinguish "before" from a stable tie.
    if (!diff) diff = -comparisonSign(method(bv, av, rowB, rowA))
  } else if (method === 'string') {
    diff = stringCollator.compare(String(av), String(bv))
  } else if (typeof av === 'number' && typeof bv === 'number') {
    diff = av - bv
  } else {
    diff = naturalCollator.compare(String(av), String(bv))
  }
  return order === 'asc' ? diff : -diff
}
