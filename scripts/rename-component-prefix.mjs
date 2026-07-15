#!/usr/bin/env node
/**
 * Rename component prefix Vs* -> S* and <vs- -> <s-
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  '.git',
  '.temp',
  'pnpm-lock.yaml',
])

const EXT = /\.(vue|ts|tsx|md|mjs|sh|json)$/

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  const stat = fs.statSync(dir)
  if (stat.isFile()) {
    out.push(dir)
    return out
  }
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue
    walk(path.join(dir, name), out)
  }
  return out
}

function transform(content, file) {
  let c = content

  // PascalCase exports / imports / component names (SButton -> SButton)
  c = c.replace(/\bVs([A-Z][a-zA-Z0-9]*)/g, 'S$1')

  const tagLike =
    file.endsWith('.vue') ||
    file.endsWith('.md') ||
    file.endsWith('.tsx') ||
    file.includes(`${path.sep}docs${path.sep}`)

  if (tagLike) {
    c = c.replace(/<\/vs-/g, '</s-')
    c = c.replace(/<vs-/g, '<s-')
  }

  return c
}

const roots = [
  'packages',
  'docs',
  'play',
  'global.d.ts',
  'typings',
  'ssr-testing',
  'scripts',
  'README.md',
  'README.zh-CN.md',
]

let changed = 0
for (const root of roots) {
  const abs = path.join(ROOT, root)
  const files = fs.statSync(abs).isFile() ? [abs] : walk(abs)
  for (const file of files) {
    if (!EXT.test(file)) continue
    if (file.includes(`${path.sep}.vuepress${path.sep}.temp${path.sep}`)) continue
    const before = fs.readFileSync(file, 'utf8')
    const after = transform(before, file)
    if (after !== before) {
      fs.writeFileSync(file, after)
      changed++
    }
  }
}

console.log(`Updated ${changed} files`)
