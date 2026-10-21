import { fileURLToPath } from 'node:url'
import path from 'node:path'

const librarySourceRoot = `${path
  .resolve(path.dirname(fileURLToPath(import.meta.url)), '../../components')
  .replace(/\\/g, '/')}/`

export function isApplicationIconSource(id: string) {
  const filename = id.split('?', 1)[0].replace(/\\/g, '/')
  return (
    !id.startsWith('\0') &&
    !id.includes('?vue&type=') &&
    !filename.includes('/node_modules/') &&
    !filename.includes('/packages/iconify/') &&
    !filename.startsWith(librarySourceRoot) &&
    !filename.endsWith('.d.ts') &&
    /\.(?:vue|[cm]?[jt]sx?)$/.test(filename)
  )
}

export function addIconImports(code: string, id: string, imports: string[]) {
  const block = `${imports.join('\n')}\n`
  if (!id.split('?', 1)[0].endsWith('.vue')) return block + code
  const scriptSetup = /<script\b([^>]*\bsetup\b[^>]*)>/i
  return scriptSetup.test(code)
    ? code.replace(scriptSetup, (match) => `${match}\n${block}`)
    : `<script setup lang="ts">\n${block}</script>\n${code}`
}
