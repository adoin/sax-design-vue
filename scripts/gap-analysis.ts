/**
 * Compare original vuesax (Vue 2) components with vuesax-alpha implementations.
 * Run: npx tsx scripts/gap-analysis.ts
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const ORIGINAL = [
  'alert',
  'avatar',
  'breadcrumb',
  'button',
  'card',
  'checkbox',
  'chip',
  'collapse',
  'divider',
  'dropdown',
  'icon',
  'images',
  'input',
  'input-number',
  'list',
  'navbar',
  'pagination',
  'popup',
  'progress',
  'prompt',
  'radio',
  'select',
  'sidebar',
  'slider',
  'spacer',
  'switch',
  'table',
  'tabs',
  'textarea',
  'time-picker',
  'tooltip',
  'upload',
]

const componentsDir = path.join(ROOT, 'packages/components')
const implemented = fs
  .readdirSync(componentsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((name) => fs.existsSync(path.join(componentsDir, name, 'index.ts')))

const ALIAS: Record<string, string[]> = {
  dialog: ['popup'],
  'time-select': ['time-picker'],
  popper: ['dropdown'],
}

const resolved = new Set<string>()
for (const name of implemented) {
  resolved.add(name)
  for (const [alpha, aliases] of Object.entries(ALIAS)) {
    if (name === alpha) aliases.forEach((a) => resolved.add(a))
  }
}

const missing = ORIGINAL.filter((c) => !resolved.has(c))
const done = ORIGINAL.filter((c) => resolved.has(c))

console.log('Implemented:', done.length, '/', ORIGINAL.length)
console.log('Done:', done.join(', '))
console.log('Missing:', missing.join(', ') || '(none)')
