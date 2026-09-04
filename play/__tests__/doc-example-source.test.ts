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

const exampleCards = (source: string) =>
  Array.from(source.matchAll(/<card[^>]*>([\s\S]*?)<\/card>/g))
    .map((match) => match[1])
    .filter((card) => card.includes('<template #example>'))

const normalizedBlock = (value?: string) =>
  (value ?? '').replace(/\r\n?/g, '\n').trim()

describe('documentation example source', () => {
  it('keeps massive table data inside the virtual-scrolling example in both locales', () => {
    for (const root of docsRoots) {
      const markdown = readFileSync(resolve(root, 'table.md'), 'utf8')
      const virtualCards = Array.from(
        markdown.matchAll(/<card[^>]*>([\s\S]*?)<\/card>/g),
      ).filter((match) => /<table-(?:zh-)?virtual\s*\/>/.test(match[1]))
      expect(virtualCards).toHaveLength(1)
      expect(markdown).not.toMatch(/<table-(?:zh-)?stress\s*\/>/)
      expect(markdown).not.toMatch(
        /stress\.vue|fixed-column-stress-test|10-万-×/,
      )
      const card = virtualCards[0][1]
      expect(card).toContain('`virtualSource`')
      const source = readSlotSource(resolve(root, 'table.md'), card, 'template')
      expect(source).toContain('class="stress-demo"')
      expect(source).toContain('v-if="!started"')
      expect(source).not.toMatch(/10 万行|100,000 rows|100 亿|10 billion/)
    }
  })

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

        if (!source) {
          failures.push(
            `${markdownPath} — card ${index + 1}: missing Code/Playground source`,
          )
          return
        }

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

  it('keeps every Table example paired, localized and identical to its complete source SFC', () => {
    const paths = docsRoots.map((root) => resolve(root, 'table.md'))
    const markdown = paths.map((path) => readFileSync(path, 'utf8'))
    const cards = markdown.map(exampleCards)
    expect(cards[0]).toHaveLength(59)
    expect(cards[1]).toHaveLength(cards[0].length)

    for (const [source, examples] of markdown.map(
      (source, index) => [source, cards[index]] as const,
    ))
      expect(source.match(/<template #example>/g)).toHaveLength(examples.length)

    cards[0].forEach((english, index) => {
      const chinese = cards[1][index]
      const tags = [english, chinese].map(
        (card) => card.match(/<template #example>\s*<([\w-]+)/)?.[1] ?? '',
      )
      expect(tags[0]).toBeTruthy()
      expect(tags[1].replace(/^table-zh-/, 'table-')).toBe(tags[0])

      for (const [locale, card, markdownPath] of [
        ['en', english, paths[0]],
        ['zh', chinese, paths[1]],
      ] as const) {
        const headingEnd = card.indexOf('\n', card.indexOf('## '))
        const exampleStart = card.indexOf('<template #example>')
        expect(
          card.slice(headingEnd, exampleStart).replace(/[`\s]/g, '').length,
        ).toBeGreaterThan(20)

        const includes = Array.from(
          card.matchAll(/@\[code(?:\{\d+-\d+\})?[^\]]*\]\(([^)]+)\)/g),
        ).map((match) => resolve(dirname(markdownPath), match[1]))
        expect(includes.length).toBeGreaterThan(0)
        expect(new Set(includes)).toHaveLength(1)
        expect(includes[0].replaceAll('\\', '/')).toContain(
          locale === 'zh' ? '/components/table-zh/' : '/components/table/',
        )

        const reconstructed = (['template', 'script', 'style'] as const)
          .map((slot) => readSlotSource(markdownPath, card, slot))
          .filter(Boolean)
          .join('\n\n')
        const actual = readFileSync(includes[0], 'utf8')
        if (locale === 'en') expect(actual).not.toMatch(/[\u3400-\u9fff]/)
        else expect(actual).toMatch(/[\u3400-\u9fff]/)
        const rebuiltDescriptor = parse(reconstructed).descriptor
        const actualDescriptor = parse(actual).descriptor
        expect(normalizedBlock(rebuiltDescriptor.template?.content)).toBe(
          normalizedBlock(actualDescriptor.template?.content),
        )
        expect(normalizedBlock(rebuiltDescriptor.script?.content)).toBe(
          normalizedBlock(actualDescriptor.script?.content),
        )
        expect(normalizedBlock(rebuiltDescriptor.scriptSetup?.content)).toBe(
          normalizedBlock(actualDescriptor.scriptSetup?.content),
        )
        expect(
          rebuiltDescriptor.styles.map((style) =>
            normalizedBlock(style.content),
          ),
        ).toEqual(
          actualDescriptor.styles.map((style) =>
            normalizedBlock(style.content),
          ),
        )
      }
    })
  })
})
