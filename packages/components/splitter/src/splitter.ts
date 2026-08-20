import { addUnit, buildProps } from '@vuesax-alpha/utils'

import type { ExtractPropTypes, PropType } from 'vue'
import type Splitter from './splitter.vue'

export type SplitterDirection = 'horizontal' | 'vertical'
export type SplitterSize = number | 'rest'
export type SplitterGapSize = string | number
export type SplitterGap = SplitterGapSize | [SplitterGapSize, SplitterGapSize]

const splitterGapProp = [
  String,
  Number,
  Array,
] as unknown as PropType<SplitterGap>

const normalizeGapSize = (value: SplitterGapSize) =>
  value === 0 ? '0px' : addUnit(value)

export const normalizeSplitterGap = (gap: SplitterGap) => {
  const [rowGap, columnGap] = Array.isArray(gap) ? gap : [gap, gap]
  return {
    rowGap: normalizeGapSize(rowGap),
    columnGap: normalizeGapSize(columnGap),
  }
}

export interface SplitterGroupValue {
  type: SplitterDirection
  size: SplitterNodeValue[]
  /** Size of this nested group inside its parent. Omitted values behave as `rest`. */
  value?: SplitterSize
}

export type SplitterNodeValue = SplitterSize | SplitterGroupValue
export type SplitterModelValue = SplitterGroupValue

export const isSplitterGroupValue = (
  value: unknown,
): value is SplitterGroupValue => {
  if (!value || typeof value !== 'object') return false
  const group = value as Partial<SplitterGroupValue>
  return (
    (group.type === 'horizontal' || group.type === 'vertical') &&
    Array.isArray(group.size)
  )
}

export const getSplitterNodeSize = (value: SplitterNodeValue): SplitterSize =>
  isSplitterGroupValue(value) ? (value.value ?? 'rest') : value

export const resolveSplitterSizes = (
  values: SplitterNodeValue[],
  itemCount: number,
) => {
  if (itemCount <= 0) return []

  const source = Array.from(
    { length: itemCount },
    (_, index) => values[index] ?? 'rest',
  )
  const explicit = source.map((item) => {
    const value = getSplitterNodeSize(item)
    return typeof value === 'number' && Number.isFinite(value)
      ? Math.max(0, value)
      : undefined
  })
  const explicitTotal = explicit.reduce<number>(
    (total, value) => total + (value ?? 0),
    0,
  )
  const restCount = explicit.filter((value) => value === undefined).length

  if (!restCount) {
    if (!explicitTotal) return source.map(() => 1 / itemCount)
    return explicit.map((value) => (value ?? 0) / explicitTotal)
  }

  if (explicitTotal >= 1) {
    const scale = explicitTotal ? 1 / explicitTotal : 0
    return explicit.map((value) => (value ?? 0) * scale)
  }

  const restSize = (1 - explicitTotal) / restCount
  return explicit.map((value) => value ?? restSize)
}

const setSplitterNodeSize = (
  node: SplitterNodeValue,
  value: SplitterSize,
): SplitterNodeValue =>
  isSplitterGroupValue(node) ? { ...node, value } : value

export const quantizeSplitterSizes = (sizes: number[], precision: number) => {
  if (!sizes.length) return []
  const digits = Math.max(0, Math.min(Math.trunc(precision), 8))
  const scale = 10 ** digits
  const total = sizes.reduce((sum, size) => sum + Math.max(0, size), 0)
  const normalized = total
    ? sizes.map((size) => Math.max(0, size) / total)
    : sizes.map(() => 1 / sizes.length)
  const units = normalized.map((size) => Math.floor(size * scale))
  let remaining = scale - units.reduce((sum, value) => sum + value, 0)
  const order = normalized
    .map((size, index) => ({
      index,
      remainder: size * scale - units[index],
    }))
    .sort((first, second) =>
      second.remainder === first.remainder
        ? second.index - first.index
        : second.remainder - first.remainder,
    )

  for (let index = 0; remaining > 0; index += 1, remaining -= 1) {
    units[order[index % order.length].index] += 1
  }

  return units.map((value) => value / scale)
}

export const updateSplitterPair = (
  model: SplitterModelValue,
  path: number[],
  index: number,
  first: number,
  second: number,
  restIndex = -1,
): SplitterModelValue => {
  const root: SplitterModelValue = { ...model, size: [...model.size] }
  let group = root

  for (const childIndex of path) {
    const child = group.size[childIndex]
    if (!isSplitterGroupValue(child)) return model
    const nextChild: SplitterGroupValue = {
      ...child,
      size: [...child.size],
    }
    group.size[childIndex] = nextChild
    group = nextChild
  }

  const firstNode = group.size[index] ?? 'rest'
  const secondNode = group.size[index + 1] ?? 'rest'
  group.size[index] = setSplitterNodeSize(
    firstNode,
    restIndex === index ? 'rest' : first,
  )
  group.size[index + 1] = setSplitterNodeSize(
    secondNode,
    restIndex === index + 1 ? 'rest' : second,
  )
  return root
}

export const normalizeSplitterGroup = (
  model: SplitterModelValue,
  path: number[],
  itemCount: number,
  restIndex: number,
  precision: number,
): SplitterModelValue => {
  if (itemCount <= 0) return model

  let sourceGroup: SplitterGroupValue = model
  for (const childIndex of path) {
    const child = sourceGroup.size[childIndex]
    if (!isSplitterGroupValue(child)) return model
    sourceGroup = child
  }

  const countMismatch = sourceGroup.size.length !== itemCount
  const sourceNodes = Array.from(
    { length: itemCount },
    (_, index) => sourceGroup.size[index] ?? 'rest',
  )
  const resolved = countMismatch
    ? sourceNodes.map(() => 1 / itemCount)
    : resolveSplitterSizes(sourceNodes, itemCount)
  const quantized = quantizeSplitterSizes(resolved, precision)
  const nextNodes = sourceNodes.map((node, index) =>
    setSplitterNodeSize(node, index === restIndex ? 'rest' : quantized[index]),
  )
  const unchanged =
    !countMismatch &&
    sourceGroup.size.every(
      (node, index) =>
        getSplitterNodeSize(node) === getSplitterNodeSize(nextNodes[index]),
    )

  if (unchanged) return model

  const root: SplitterModelValue = { ...model, size: [...model.size] }
  let targetGroup = root
  for (const childIndex of path) {
    const child = targetGroup.size[childIndex]
    if (!isSplitterGroupValue(child)) return model
    const nextChild = { ...child, size: [...child.size] }
    targetGroup.size[childIndex] = nextChild
    targetGroup = nextChild
  }
  targetGroup.size = nextNodes
  return root
}

const defaultModelValue = (): SplitterModelValue => ({
  type: 'horizontal',
  size: ['rest', 'rest'],
})

export const splitterProps = buildProps({
  modelValue: {
    type: Object as PropType<SplitterModelValue>,
    default: defaultModelValue,
    validator: isSplitterGroupValue,
  },
  minSize: {
    type: Number,
    default: 0.08,
  },
  keyboardStep: {
    type: Number,
  },
  precision: {
    type: Number,
    default: 2,
  },
  gap: {
    type: splitterGapProp,
    default: 12,
  },
  disabled: Boolean,
} as const)

export const splitterEmits = {
  'update:modelValue': (value: SplitterModelValue) =>
    isSplitterGroupValue(value),
  change: (value: SplitterModelValue) => isSplitterGroupValue(value),
}

export type SplitterProps = ExtractPropTypes<typeof splitterProps>
export type SplitterEmits = typeof splitterEmits
export type SplitterInstance = InstanceType<typeof Splitter>
