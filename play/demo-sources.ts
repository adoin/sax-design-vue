import { PLAY_DEMOS, type PlayDemoName } from './demo-list'

const rawModules = import.meta.glob('./src/*.vue', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, unknown>

function normalizeRaw(value: unknown): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'default' in value) {
    const mod = (value as { default: unknown }).default
    return typeof mod === 'string' ? mod : String(mod ?? '')
  }
  return ''
}

export const DEMO_SOURCES: Record<string, string> = {}

for (const [path, mod] of Object.entries(rawModules)) {
  const name = path.replace(/^\.\/src\/(.+)\.vue$/, '$1')
  if (name) {
    DEMO_SOURCES[name] = normalizeRaw(mod)
  }
}

export function getDemoSource(name: string): string {
  return DEMO_SOURCES[name] ?? ''
}

export function isPlayDemo(name: string): name is PlayDemoName {
  return (PLAY_DEMOS as readonly string[]).includes(name)
}

export const PLAYGROUND_DEMOS = PLAY_DEMOS.filter((name) => name !== 'App')
