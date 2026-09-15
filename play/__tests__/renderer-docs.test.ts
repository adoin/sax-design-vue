import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const projectRoot = resolve(__dirname, '../..')
const pages = [
  resolve(projectRoot, 'docs/components/renderer.md'),
  resolve(projectRoot, 'docs/zh/components/renderer.md'),
]
const requiredTypes = [
  'RendererOptions',
  'FormRendererParams',
  'TableDefaultRendererParams',
  'TableGlobalEditRendererParams',
  'TableGlobalFilterRendererParams',
  'TableGlobalToolbarRendererParams',
  'VNodeChild',
]

describe('Renderer documentation', () => {
  it('keeps localized TSX and h() registration variants fully typed', () => {
    for (const page of pages) {
      const markdown = readFileSync(page, 'utf8')
      const variant = markdown.match(
        /<code-variants>[\s\S]*?<template #tsx>([\s\S]*?)<\/template>[\s\S]*?<template #h>([\s\S]*?)<\/template>[\s\S]*?<\/code-variants>/,
      )
      expect(variant, page).toBeTruthy()

      const sources = variant!.slice(1).map((slot) => {
        const include = slot.match(/@\[code\]\(([^)]+)\)/)?.[1]
        expect(include, page).toBeTruthy()
        return readFileSync(resolve(dirname(page), include!), 'utf8')
      })

      requiredTypes.forEach((type) => {
        expect(sources[0], `${page} TSX`).toContain(type)
        expect(sources[1], `${page} h()`).toContain(type)
      })
      expect(sources[0]).toContain('@jsxImportSource vue')
      expect(sources[0]).toContain('<select')
      expect(sources[1]).toContain("import { h } from 'vue'")
      expect(sources[1]).toMatch(/h\(\s*'select'/)
      expect(markdown).toContain(
        'TableGlobalToolbarRendererParams<Row, QueryForm>',
      )
      expect(markdown).toContain(
        'interface RendererOptions<Model extends object',
      )
      expect(markdown).toContain('children?: RendererOptions<Model>[]')
      expect(markdown).not.toContain('Stage-specific context')
      expect(markdown).not.toContain('专属上下文')
    }
  })
})
