#!/usr/bin/env node
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { compileDemoSfc } from './compile-demo-sfc.ts'

const root = dirname(fileURLToPath(import.meta.url))
const demoDir = join(root, 'src')

let failed = 0

for (const file of readdirSync(demoDir).filter((name) => name.endsWith('.vue') && name !== 'App.vue')) {
  const name = file.replace('.vue', '')
  const source = readFileSync(join(demoDir, file), 'utf8')
  const { component, error } = compileDemoSfc(source, name)

  if (error || !component) {
    failed += 1
    console.error(`[compile] ${name}: ${error || 'missing component'}`)
    continue
  }

  console.log(`[ok] ${name}`)
}

if (failed > 0) {
  process.exitCode = 1
  console.error(`\n${failed} demo(s) failed validation`)
} else {
  console.log('\nAll playground demos passed compile checks')
}
