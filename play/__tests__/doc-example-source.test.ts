import { readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { parse } from '@vue/compiler-sfc'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'
import { compileDemoSfc } from '../compile-demo-sfc'
import { demoRuntimeModules } from '../demo-runtime-modules'

const projectRoot = resolve(__dirname, '../..')
const docsRoots = [
  resolve(projectRoot, 'docs/components'),
  resolve(projectRoot, 'docs/zh/components'),
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
  it('reconstructs and compiles every component example as a complete Vue SFC', () => {
    const failures: string[] = []
    let exampleCount = 0
    globalThis.IntersectionObserver = class IntersectionObserver {
      readonly root = null
      readonly rootMargin = '0px'
      readonly thresholds = []
      disconnect() {}
      observe() {}
      takeRecords() {
        return []
      }
      unobserve() {}
    }
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div />' } }],
    })
    const saxDesignVue = demoRuntimeModules['sax-design-vue'].default as {
      install: () => void
    }

    for (const markdownPath of docsRoots.flatMap((root) =>
      readdirSync(root)
        .filter((file) => file.endsWith('.md'))
        .map((file) => resolve(root, file)),
    )) {
      const markdown = readFileSync(markdownPath, 'utf8')
      const cards = Array.from(
        markdown.matchAll(/<card[^>]*>([\s\S]*?)<\/card>/g),
      )

      cards.forEach((cardMatch, index) => {
        const card = cardMatch[1]
        if (!card.includes('<template #example>')) return
        exampleCount += 1

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
          demoRuntimeModules,
        )
        if (!compiled.component || compiled.error) {
          failures.push(
            `${markdownPath} — ${heading}: ${compiled.error || 'failed to compile'}`,
          )
          return
        }

        try {
          const wrapper = mount(compiled.component, {
            global: {
              config: { warnHandler: () => {} },
              plugins: [saxDesignVue, router],
            },
          })
          wrapper.unmount()
        } catch (error) {
          failures.push(
            `${markdownPath} — ${heading}: ${error instanceof Error ? error.message : String(error)}`,
          )
        }
      })
    }

    expect(exampleCount).toBeGreaterThan(0)
    expect(failures).toEqual([])
  }, 60_000)
})
