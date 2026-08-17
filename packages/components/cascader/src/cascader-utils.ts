import type {
  CascaderFieldNames,
  CascaderOption,
  CascaderPathValue,
  CascaderValue,
} from './cascader'

export interface CascaderNode {
  value: CascaderValue
  label: string
  option: CascaderOption
  pathValues: CascaderPathValue
  pathOptions: CascaderOption[]
  children: CascaderNode[]
  disabled: boolean
  isLeaf: boolean
  level: number
}

export interface CascaderFieldAccessors {
  value: string
  label: string
  children: string
  disabled: string
  isLeaf: string
}

export const resolveFieldNames = (
  fieldNames: CascaderFieldNames,
): CascaderFieldAccessors => ({
  value: fieldNames.value || 'value',
  label: fieldNames.label || 'label',
  children: fieldNames.children || 'children',
  disabled: fieldNames.disabled || 'disabled',
  isLeaf: fieldNames.isLeaf || 'isLeaf',
})

export const pathKey = (path: CascaderPathValue) =>
  path.map((value) => `${typeof value}:${String(value)}`).join('|')

export const samePath = (left: CascaderPathValue, right: CascaderPathValue) =>
  left.length === right.length &&
  left.every((value, index) => value === right[index])

export const normalizeCascaderNodes = (
  options: CascaderOption[],
  fields: CascaderFieldAccessors,
  parentValues: CascaderPathValue = [],
  parentOptions: CascaderOption[] = [],
  level = 0,
): CascaderNode[] => {
  const result: CascaderNode[] = []
  options.forEach((option: CascaderOption) => {
    const rawValue = option[fields.value]
    if (typeof rawValue !== 'string' && typeof rawValue !== 'number') return
    const rawChildren = option[fields.children]
    const childOptions = Array.isArray(rawChildren)
      ? (rawChildren as CascaderOption[])
      : []
    const pathValues = [...parentValues, rawValue]
    const pathOptions = [...parentOptions, option]
    const children = normalizeCascaderNodes(
      childOptions,
      fields,
      pathValues,
      pathOptions,
      level + 1,
    )
    result.push({
      value: rawValue,
      label: String(option[fields.label] ?? rawValue),
      option,
      pathValues,
      pathOptions,
      children,
      disabled: Boolean(option[fields.disabled]),
      isLeaf:
        option[fields.isLeaf] === true ||
        (children.length === 0 && option[fields.isLeaf] !== false),
      level,
    })
  })
  return result
}

export const flattenCascaderNodes = (nodes: CascaderNode[]): CascaderNode[] => {
  const result: CascaderNode[] = []
  nodes.forEach((node: CascaderNode) => {
    result.push(node, ...flattenCascaderNodes(node.children))
  })
  return result
}

export const findCascaderNode = (
  nodes: CascaderNode[],
  values: CascaderPathValue,
) => {
  let current = nodes
  let found: CascaderNode | undefined
  for (const value of values) {
    found = current.find((node) => node.value === value)
    if (!found) return undefined
    current = found.children
  }
  return found
}

export const selectableLeafNodes = (node: CascaderNode): CascaderNode[] => {
  if (node.disabled) return []
  if (node.isLeaf || node.children.length === 0) return [node]
  const result: CascaderNode[] = []
  node.children.forEach((child) => result.push(...selectableLeafNodes(child)))
  return result
}

export const splitHighlightedText = (text: string, query: string) => {
  if (!query) return [{ text, match: false }]
  const normalized = query.toLocaleLowerCase()
  const lowerText = text.toLocaleLowerCase()
  const parts: Array<{ text: string; match: boolean }> = []
  let cursor = 0
  let matchIndex = lowerText.indexOf(normalized)
  while (matchIndex >= 0) {
    if (matchIndex > cursor)
      parts.push({ text: text.slice(cursor, matchIndex), match: false })
    parts.push({
      text: text.slice(matchIndex, matchIndex + query.length),
      match: true,
    })
    cursor = matchIndex + query.length
    matchIndex = lowerText.indexOf(normalized, cursor)
  }
  if (cursor < text.length)
    parts.push({ text: text.slice(cursor), match: false })
  return parts.length ? parts : [{ text, match: false }]
}

export const calculateVisibleTagCount = (
  availableWidth: number,
  tagWidths: number[],
  overflowWidth: number,
  reservedWidth: number,
) => {
  const budget = Math.max(0, availableWidth - reservedWidth)
  const total = tagWidths.reduce((sum, width) => sum + width, 0)
  if (total <= budget) return tagWidths.length
  const tagBudget = Math.max(0, budget - overflowWidth)
  let used = 0
  let count = 0
  for (const width of tagWidths) {
    if (used + width > tagBudget) break
    used += width
    count++
  }
  return count
}
