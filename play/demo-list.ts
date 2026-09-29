export const PLAY_DEMOS = [
  'App',
  'alert',
  'spacer',
  'divider',
  'progress',
  'tag',
  'breadcrumb',
  'textarea',
  'collapse',
  'list',
  'images',
  'tabs',
  'slider',
  'upload',
] as const

export type PlayDemoName = (typeof PLAY_DEMOS)[number]
