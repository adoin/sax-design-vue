#!/usr/bin/env node
/**
 * Generate Vue icon components from Iconify (MingCute) SVGs.
 * Run: node scripts/generate-extra-icons.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'packages/icons-vue/src/components')

/** @type {Array<{ name: string; line?: string; fill?: string }>} */
const icons = [
  { name: 'share', line: 'mingcute:share-2-line', fill: 'mingcute:share-2-fill' },
  { name: 'link', line: 'mingcute:link-line', fill: 'mingcute:link-fill' },
  { name: 'copy', line: 'mingcute:copy-line', fill: 'mingcute:copy-fill' },
  { name: 'calendar', line: 'mingcute:calendar-line', fill: 'mingcute:calendar-fill' },
  { name: 'clock', line: 'mingcute:time-line', fill: 'mingcute:time-fill' },
  { name: 'refresh', line: 'mingcute:refresh-2-line', fill: 'mingcute:refresh-2-fill' },
  { name: 'save', line: 'mingcute:save-line', fill: 'mingcute:save-fill' },
  { name: 'print', line: 'mingcute:print-line', fill: 'mingcute:print-fill' },
  { name: 'sort', line: 'mingcute:sort-ascending-line', fill: 'mingcute:sort-ascending-fill' },
  { name: 'bookmark', line: 'mingcute:bookmark-line', fill: 'mingcute:bookmark-fill' },
  { name: 'chart', line: 'mingcute:chart-bar-line', fill: 'mingcute:chart-bar-fill' },
  { name: 'cart', line: 'mingcute:shopping-cart-1-line', fill: 'mingcute:shopping-cart-1-fill' },
  { name: 'wallet', line: 'mingcute:wallet-line', fill: 'mingcute:wallet-fill' },
  { name: 'wifi', line: 'mingcute:wifi-line', fill: 'mingcute:wifi-fill' },
  { name: 'map-pin', line: 'mingcute:location-line', fill: 'mingcute:location-fill' },
  { name: 'paperclip', line: 'mingcute:attachment-line', fill: 'mingcute:attachment-fill' },
  { name: 'fullscreen', line: 'mingcute:fullscreen-line', fill: 'mingcute:fullscreen-fill' },
  { name: 'power', line: 'mingcute:power-line', fill: 'mingcute:power-fill' },
  { name: 'chat', line: 'mingcute:chat-1-line', fill: 'mingcute:chat-1-fill' },
  { name: 'comment', line: 'mingcute:comment-line', fill: 'mingcute:comment-fill' },
  { name: 'flag', line: 'mingcute:flag-1-line', fill: 'mingcute:flag-1-fill' },
  { name: 'block', line: 'mingcute:forbid-circle-line', fill: 'mingcute:forbid-circle-fill' },
  { name: 'info-circle', line: 'mingcute:information-line', fill: 'mingcute:information-fill' },
  { name: 'warning', line: 'mingcute:alert-line', fill: 'mingcute:alert-fill' },
  { name: 'help-circle', line: 'mingcute:question-line', fill: 'mingcute:question-fill' },
  { name: 'pencil', line: 'mingcute:pencil-line', fill: 'mingcute:pencil-fill' },
  { name: 'mail', line: 'mingcute:mail-line', fill: 'mingcute:mail-fill' },
  { name: 'sun', line: 'mingcute:sun-line', fill: 'mingcute:sun-fill' },
  { name: 'moon', line: 'mingcute:moon-line', fill: 'mingcute:moon-fill' },
  { name: 'bluetooth', line: 'mingcute:bluetooth-line', fill: 'mingcute:bluetooth-fill' },
  { name: 'card', line: 'mingcute:bank-card-line', fill: 'mingcute:bank-card-fill' },
  { name: 'shop', line: 'mingcute:store-line', fill: 'mingcute:store-fill' },
  { name: 'external-link', line: 'mingcute:external-link-line', fill: 'mingcute:external-link-fill' },
  { name: 'file', line: 'mingcute:file-line', fill: 'mingcute:file-fill' },
  { name: 'filter', line: 'mingcute:filter-line', fill: 'mingcute:filter-fill' },
  { name: 'verified', line: 'mingcute:check-circle-line', fill: 'mingcute:check-circle-fill' },
  { name: 'cloud', line: 'mingcute:cloud-line', fill: 'mingcute:cloud-fill' },
  { name: 'attach', line: 'mingcute:paper-line', fill: 'mingcute:paper-fill' },
  { name: 'expand', line: 'mingcute:arrows-up-line', fill: 'mingcute:arrows-up-fill' },
  { name: 'photo', line: 'mingcute:pic-line', fill: 'mingcute:pic-fill' },
  { name: 'phone', line: 'mingcute:phone-line', fill: 'mingcute:phone-fill' },
  { name: 'delete', line: 'mingcute:delete-2-line', fill: 'mingcute:delete-2-fill' },
]

function toPascalCase(name) {
  return name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function stripMingcuteWatermark(svg) {
  return svg
    .replace(/<svg[^>]*>/i, '')
    .replace(/<\/svg>/i, '')
    .replace(/<path(?![^>]*fill="currentColor")[^>]*\/>/gi, '')
    .replace(/<path(?![^>]*fill="currentColor")[^>]*>[\s\S]*?<\/path>/gi, '')
    .replace(/<g[^>]*>/gi, '')
    .replace(/<\/g>/gi, '')
    .trim()
}

async function fetchSvg(iconId) {
  const res = await fetch(`https://api.iconify.design/${iconId}.svg`)
  if (!res.ok) {
    throw new Error(`Failed to fetch ${iconId}: ${res.status}`)
  }
  return res.text()
}

function writeIcon(fileName, componentName, innerSvg) {
  const displayName = `${componentName}Icon`
  const content = `<template>
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${innerSvg}
  </svg>
</template>

<script lang="ts">
export default {
  name: '${displayName}',
}
</script>
`
  fs.writeFileSync(path.join(outDir, `${fileName}.vue`), content)
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true })

  const exports = []

  for (const icon of icons) {
    if (icon.line) {
      try {
        const svg = await fetchSvg(icon.line)
        const inner = stripMingcuteWatermark(svg)
        const pascal = toPascalCase(icon.name)
        writeIcon(icon.name, pascal, inner)
        exports.push({ file: icon.name, exportName: pascal })
        console.log(`[ok] ${icon.name}`)
      } catch (error) {
        console.error(`[skip] ${icon.name}: ${error.message}`)
      }
    }

    if (icon.fill) {
      try {
        const svg = await fetchSvg(icon.fill)
        const inner = stripMingcuteWatermark(svg)
        const fileName = `${icon.name}-bold`
        const pascal = `${toPascalCase(icon.name)}Bold`
        writeIcon(fileName, pascal, inner)
        exports.push({ file: fileName, exportName: pascal })
        console.log(`[ok] ${fileName}`)
      } catch (error) {
        console.error(`[skip] ${icon.name}-bold: ${error.message}`)
      }
    }
  }

  const indexLines = [
    `import * as baseIcons from '@vuesax-alpha/icons-vue'`,
    `import { extraIcons } from './extra-icons'`,
    `import type { Component } from 'vue'`,
    ``,
    `export * from '@vuesax-alpha/icons-vue'`,
    `export { extraIcons } from './extra-icons'`,
    ``,
    ...exports.map(
      ({ file, exportName }) =>
        `export { default as ${exportName} } from './components/${file}.vue'`
    ),
    ``,
    `export const saxIcons = {`,
    `  ...(baseIcons as Record<string, Component>),`,
    `  ...extraIcons,`,
    `} as Record<string, Component>`,
    ``,
    `export default saxIcons`,
    ``,
    `export {`,
    `  buildIconCatalog,`,
    `  filterIconCatalog,`,
    `  iconNameToKebab,`,
    `} from './registry'`,
    ``,
  ]

  const extraIconLines = [
    `import type { Component } from 'vue'`,
    ``,
    ...exports.map(
      ({ file, exportName }) =>
        `import ${exportName} from './components/${file}.vue'`
    ),
    ``,
    `export const extraIcons = {`,
    ...exports.map(({ exportName }) => `  ${exportName},`),
    `} as Record<string, Component>`,
    ``,
    `export const extraIconNames = [`,
    ...exports.map(({ exportName }) => `  '${exportName}',`),
    `] as const`,
    ``,
  ]

  fs.writeFileSync(
    path.join(root, 'packages/icons-vue/src/extra-icons.ts'),
    `${extraIconLines.join('\n')}\n`
  )

  fs.writeFileSync(
    path.join(root, 'packages/icons-vue/src/index.ts'),
    `${indexLines.join('\n')}\n`
  )

  console.log(`\nGenerated ${exports.length} extra icons`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
