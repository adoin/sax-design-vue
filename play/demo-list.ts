export const PLAY_DEMOS = [
  'App',
  'alert',
  'spacer',
  'divider',
  'progress',
  'chip',
  'breadcrumb',
  'textarea',
  'collapse',
  'list',
  'images',
  'prompt',
  'tabs',
  'slider',
  'upload',
] as const

export type PlayDemoName = (typeof PLAY_DEMOS)[number]
