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
  'tag',
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

// SLayout's aside slot and SMenu replace the retired standalone Sidebar API.
const retired = new Set(['sidebar'])
const expected = ORIGINAL.filter((name) => !retired.has(name))

const resolved = new Set<string>()
for (const name of implemented) {
  resolved.add(name)
  for (const [alpha, aliases] of Object.entries(ALIAS)) {
    if (name === alpha) aliases.forEach((a) => resolved.add(a))
  }
}

const missing = expected.filter((c) => !resolved.has(c))
const done = expected.filter((c) => resolved.has(c))

console.log('Implemented:', done.length, '/', expected.length)
console.log('Done:', done.join(', '))
console.log('Missing:', missing.join(', ') || '(none)')
console.log('Retired:', [...retired].join(', '))
