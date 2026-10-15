export const componentSizes = ['', 'medium', 'small', 'large'] as const

export type ComponentSize = (typeof componentSizes)[number] | 'default'

export const componentSizeMap = {
  large: 40,
  medium: 32,
  default: 32,
  small: 24,
} as const
