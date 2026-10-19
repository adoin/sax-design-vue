import { buildProps, definePropType } from '@vuesax-alpha/utils'
import { useShapeProp } from '@vuesax-alpha/hooks'
import type { ExtractPropTypes } from 'vue'
import type Window from './window.vue'

export interface WindowRect {
  x: number
  y: number
  width: number
  height: number
}
export type WindowResizeDirection =
  'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
export interface WindowBounds {
  width: number
  height: number
}
export const windowProps = buildProps({
  rect: {
    type: definePropType<WindowRect>(Object),
    default: () => ({ x: 24, y: 24, width: 640, height: 480 }),
  },
  title: { type: String, default: '' },
  minWidth: { type: Number, default: 280 },
  minHeight: { type: Number, default: 180 },
  draggable: { type: Boolean, default: true },
  resizable: { type: Boolean, default: true },
  boundary: { type: Boolean, default: true },
  active: Boolean,
  zIndex: { type: Number, default: 1 },
  titleEditable: Boolean,
  keyboardStep: { type: Number, default: 10 },
  shape: useShapeProp,
} as const)
export type WindowProps = ExtractPropTypes<typeof windowProps>
export interface WindowExposes {
  focus: () => void
  rename: () => Promise<void>
}
export type WindowInstance = InstanceType<typeof Window> & WindowExposes
const finite = (value: number, fallback: number) =>
  Number.isFinite(value) ? value : fallback
export function constrainWindowRect(
  rect: WindowRect,
  minWidth: number,
  minHeight: number,
  bounds?: WindowBounds,
): WindowRect {
  const minimumWidth = Math.max(1, finite(minWidth, 280))
  const minimumHeight = Math.max(48, finite(minHeight, 180))
  const width = Math.max(
    minimumWidth,
    Math.min(finite(rect.width, 640), bounds?.width ?? Infinity),
  )
  const height = Math.max(
    minimumHeight,
    Math.min(finite(rect.height, 480), bounds?.height ?? Infinity),
  )
  return {
    x: Math.max(
      0,
      Math.min(
        finite(rect.x, 0),
        bounds ? Math.max(0, bounds.width - width) : Infinity,
      ),
    ),
    y: Math.max(
      0,
      Math.min(
        finite(rect.y, 0),
        bounds ? Math.max(0, bounds.height - height) : Infinity,
      ),
    ),
    width,
    height,
  }
}
export function resizeWindowRect(
  start: WindowRect,
  direction: WindowResizeDirection,
  dx: number,
  dy: number,
  minWidth: number,
  minHeight: number,
  bounds?: WindowBounds,
): WindowRect {
  const left = direction.includes('w')
    ? Math.max(
        0,
        Math.min(start.x + dx, start.x + start.width - Math.max(1, minWidth)),
      )
    : start.x
  const top = direction.includes('n')
    ? Math.max(
        0,
        Math.min(
          start.y + dy,
          start.y + start.height - Math.max(48, minHeight),
        ),
      )
    : start.y
  const right = direction.includes('e')
    ? Math.max(
        start.x + Math.max(1, minWidth),
        Math.min(start.x + start.width + dx, bounds?.width ?? Infinity),
      )
    : start.x + start.width
  const bottom = direction.includes('s')
    ? Math.max(
        start.y + Math.max(48, minHeight),
        Math.min(start.y + start.height + dy, bounds?.height ?? Infinity),
      )
    : start.y + start.height
  return constrainWindowRect(
    { x: left, y: top, width: right - left, height: bottom - top },
    minWidth,
    minHeight,
    bounds,
  )
}
