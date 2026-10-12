import type { CSSProperties } from 'vue'
import type {
  SkeletonElement,
  SkeletonGroup,
  SkeletonItem,
  SkeletonLength,
  SkeletonRow,
} from './skeleton'

export const skeletonLength = (value: SkeletonLength | undefined) =>
  typeof value === 'number' ? `${Math.max(0, value)}px` : value
export const defaultSkeletonRows: SkeletonRow[] = [
  [{ type: 'line', width: '38%', height: 20 }],
  ['line'],
  ['line'],
  [{ type: 'line', width: '72%' }],
]
export function normalizeSkeletonRows(rows: SkeletonRow[]) {
  return rows.map((row) => {
    const config = Array.isArray(row) ? { items: row } : row
    return {
      items: config.items.map(
        (item: SkeletonItem): SkeletonElement | SkeletonGroup =>
          typeof item === 'string' ? { type: item } : item,
      ),
      style: {
        gap: skeletonLength(config.gap),
        alignItems:
          config.align === 'start' || config.align === 'end'
            ? `flex-${config.align}`
            : config.align,
        justifyContent:
          config.justify === 'start' || config.justify === 'end'
            ? `flex-${config.justify}`
            : config.justify,
      } as CSSProperties,
    }
  })
}
export function skeletonItemStyle(
  item: SkeletonElement | SkeletonGroup,
): CSSProperties {
  const equalSides = item.type === 'circle' || item.type === 'square'
  const size = equalSides
    ? skeletonLength(item.size ?? item.width ?? item.height ?? 40)
    : undefined
  return {
    width: size ?? skeletonLength(item.width),
    height: equalSides
      ? undefined
      : item.type === 'group'
        ? undefined
        : skeletonLength(item.height),
    aspectRatio: equalSides ? '1' : undefined,
    flex:
      item.flex !== undefined
        ? `${Math.max(0, item.flex)} 1 0%`
        : item.width !== undefined || equalSides
          ? '0 1 auto'
          : '1 1 0%',
    '--sax-skeleton-gap':
      item.type === 'group' ? skeletonLength(item.gap) : undefined,
  } as CSSProperties
}
