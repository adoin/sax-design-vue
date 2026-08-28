import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { parse } from '@vue/compiler-sfc'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { compileDemoSfc } from '../compile-demo-sfc'

const projectRoot = resolve(__dirname, '../..')
const docsRoots = [
  resolve(projectRoot, 'docs/components'),
  resolve(projectRoot, 'docs/zh/components'),
]
const checkedComponents = [
  'segmented.md',
  'slider.md',
  'switch.md',
  'verification-code.md',
]

const readCodeIncludes = (markdownPath: string, source: string): string => {
  const includePattern = /@\[code(?:\{(\d+)-(\d+)\})?[^\]]*\]\(([^)]+)\)/g

  return Array.from(source.matchAll(includePattern))
    .map((match) => {
      const [, startValue, endValue, relativePath] = match
      const filePath = resolve(dirname(markdownPath), relativePath)
      const lines = readFileSync(filePath, 'utf8').split(/\r?\n/)

      if (!startValue || !endValue) return lines.join('\n')

      const start = Number(startValue) - 1
      const end = Number(endValue)
      return lines.slice(start, end).join('\n')
    })
    .join('\n')
}

const readSlotSource = (
  markdownPath: string,
  card: string,
  slot: 'template' | 'script' | 'style',
): string => {
  const match = card.match(
    new RegExp(`<template #${slot}>\\s*([\\s\\S]*?)\\s*</template>`),
  )
  return match ? readCodeIncludes(markdownPath, match[1]) : ''
}

describe('documentation example source', () => {
  it('reconstructs redesigned input examples as complete Vue SFCs', () => {
    const failures: string[] = []

    for (const markdownPath of docsRoots.flatMap((root) =>
      checkedComponents.map((component) => resolve(root, component)),
    )) {
      const markdown = readFileSync(markdownPath, 'utf8')
      const cards = Array.from(
        markdown.matchAll(/<card[^>]*>([\s\S]*?)<\/card>/g),
      )

      cards.forEach((cardMatch, index) => {
        const card = cardMatch[1]
        if (!card.includes('<template #example>')) return

        const source = (['template', 'script', 'style'] as const)
          .map((slot) => readSlotSource(markdownPath, card, slot))
          .filter(Boolean)
          .join('\n\n')

        if (!source) return

        const { descriptor, errors } = parse(source, {
          filename: `${markdownPath}#card-${index + 1}`,
        })
        const heading = card.match(/^##\s+(.+)$/m)?.[1] || `card ${index + 1}`

        if (!descriptor.template || errors.length) {
          const messages = errors.map((error) =>
            typeof error === 'string' ? error : error.message,
          )
          failures.push(
            `${markdownPath} — ${heading}: ${messages.join('; ') || 'missing template block'}`,
          )
          return
        }

        const compiled = compileDemoSfc(
          source,
          `${markdownPath}-${index}`.replace(/[^a-z0-9-]/gi, '-'),
        )
        if (!compiled.component || compiled.error) {
          failures.push(
            `${markdownPath} — ${heading}: ${compiled.error || 'failed to compile'}`,
          )
          return
        }

        try {
          mount(compiled.component)
        } catch (error) {
          failures.push(
            `${markdownPath} — ${heading}: ${error instanceof Error ? error.message : String(error)}`,
          )
        }
      })
    }

    expect(failures).toEqual([])
  })
})
