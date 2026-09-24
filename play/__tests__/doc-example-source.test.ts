import { readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { parse } from '@vue/compiler-sfc'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import matter from 'gray-matter'
import { describe, expect, it } from 'vitest'
import '../../docs/.vuepress/global-renderers'
import { compileDemoSfc } from '../compile-demo-sfc'
import { demoRuntimeModules } from '../demo-runtime-modules'

const projectRoot = resolve(__dirname, '../..')
const docsRoots = [
  resolve(projectRoot, 'docs/components'),
  resolve(projectRoot, 'docs/zh/components'),
]
const sizeExampleComponents = [
  'button',
  'cascader',
  'checkbox',
  'control-group',
  'date-picker',
  'form',
  'input',
  'pagination',
  'radio',
  'rate',
  'select',
  'slider',
  'switch',
  'table',
  'table-select',
  'textarea',
  'time-picker',
  'time-select',
  'verification-code',
] as const
const interactiveSizeExampleComponents = [
  'cascader',
  'checkbox',
  'control-group',
  'date-picker',
  'form',
  'input',
  'pagination',
  'radio',
  'rate',
  'select',
  'slider',
  'switch',
  'table-select',
  'textarea',
  'time-picker',
  'time-select',
  'verification-code',
] as const
const markdownFiles = (root: string): string[] =>
  readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const filePath = resolve(root, entry.name)
    if (entry.isDirectory()) return markdownFiles(filePath)
    return entry.isFile() && entry.name.endsWith('.md') ? [filePath] : []
  })
type ExampleSourceSlot = 'template' | 'script' | 'script-tsx' | 'style'

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
const readSlotMarkup = (card: string, slot: ExampleSourceSlot): string => {
  const match = card.match(
    new RegExp(`<template #${slot}>\\s*([\\s\\S]*?)\\s*</template>`),
  )
  return match?.[1] ?? ''
}

const readSlotSource = (
  markdownPath: string,
  card: string,
  slot: ExampleSourceSlot,
): string => {
  return readCodeIncludes(markdownPath, readSlotMarkup(card, slot))
}

const exampleCards = (source: string) =>
  Array.from(source.matchAll(/<card[^>]*>([\s\S]*?)<\/card>/g))
    .map((match) => match[1])
    .filter((card) => card.includes('<template #example>'))

const tableSections = [
  [
    'data-and-column-definitions',
    'Data and column definitions',
    '数据与列定义',
  ],
  ['appearance', 'Appearance', '外观'],
  ['row-selection', 'Row selection', '行选择'],
  ['sorting-and-filtering', 'Sorting and filtering', '排序与筛选'],
  ['trees-and-groups', 'Trees and groups', '树形与分组'],
  ['header-structures', 'Header structures', '表头结构'],
  ['footers-and-summaries', 'Footers and summaries', '表尾与汇总'],
  ['row-expansion', 'Row expansion', '行展开'],
  [
    'editing-validation-and-changes',
    'Editing, validation, and changes',
    '编辑、校验与变更',
  ],
  ['spreadsheet-interactions', 'Spreadsheet interactions', '表格式交互'],
  [
    'column-layout-and-management',
    'Column layout and management',
    '列布局与管理',
  ],
  ['merged-cells', 'Merged cells', '单元格合并'],
  [
    'large-data-and-visualization',
    'Large data and visualization',
    '大数据与可视化',
  ],
  [
    'query-forms-and-request-proxy',
    'Query forms and request proxy',
    '查询表单与请求代理',
  ],
] as const

const normalizedBlock = (value?: string) =>
  (value ?? '').replace(/\r\n?/g, '\n').trim()

describe('documentation example source', () => {
  it('keeps a localized size example for every public size component', () => {
    for (const component of sizeExampleComponents) {
      const englishPage = readFileSync(
        resolve(
          projectRoot,
          'docs/components',
          component === 'button'
            ? 'README.md'
            : component === 'table'
              ? 'table/appearance.md'
              : `${component}.md`,
        ),
        'utf8',
      )
      const chinesePage = readFileSync(
        resolve(
          projectRoot,
          'docs/zh/components',
          component === 'button'
            ? 'README.md'
            : component === 'table'
              ? 'table/appearance.md'
              : `${component}.md`,
        ),
        'utf8',
      )

      expect(englishPage, `${component}: English Size heading`).toMatch(
        component === 'table' ? /^### Size$/m : /^## Sizes?$/m,
      )
      expect(chinesePage, `${component}: Chinese Size heading`).toMatch(
        component === 'table' ? /^### 尺寸$/m : /^## 尺寸$/m,
      )
      expect(englishPage, `${component}: English size example`).toContain(
        `<${component}-size />`,
      )
      expect(chinesePage, `${component}: Chinese size example`).toContain(
        component === 'rate' ? '<rate-size />' : `<${component}-zh-size />`,
      )

      if (component !== 'table') {
        expect(
          englishPage.indexOf(component === 'input' ? '## Sizes' : '## Size'),
          `${component}: English Size follows the primary example`,
        ).toBeGreaterThan(englishPage.indexOf('<template #example>'))
        expect(
          chinesePage.indexOf('## 尺寸'),
          `${component}: Chinese Size follows the primary example`,
        ).toBeGreaterThan(chinesePage.indexOf('<template #example>'))
      }
    }
  })

  it('keeps Card examples uniform while grouping their outline', () => {
    for (const [
      locale,
      typeGroup,
      typeChildren,
      textureGroup,
      textureChildren,
      effectGroup,
      effectChildren,
    ] of [
      [
        'en',
        'Types',
        [
          'Default',
          'Classic',
          'Overlay',
          'Split',
          'Frosted',
          'Reveal',
          'Profile',
          'Metric',
          'Article',
        ],
        'Textures',
        ['Default solid', 'Liquid glass', 'Liquid glass 2'],
        'Effects',
        ['No effect', 'Spotlight', 'Gradient glow'],
      ],
      [
        'zh',
        '类型',
        [
          '默认',
          '经典图文',
          '图片叠层',
          '横向分栏',
          '毛玻璃说明',
          '居中浮现',
          '人物资料',
          '数据指标',
          '文章卡片',
        ],
        '纹理',
        ['默认纯色', '液态镜片', '液态镜片 2'],
        '特效',
        ['无特效', '聚光边框', '渐变光晕'],
      ],
    ] as const) {
      const markdown = readFileSync(
        resolve(
          projectRoot,
          'docs',
          locale === 'zh' ? 'zh/components/card.md' : 'components/card.md',
        ),
        'utf8',
      )
      const frontmatter = matter(markdown).data
      const configuredGroups = frontmatter.EXAMPLE_GROUPS as Array<{
        title: string
        items: string[]
      }>
      const cards = exampleCards(markdown)
      const headings = cards.map((card) => card.match(/^##\s+(.+)$/m)?.[1])
      const groupTitles = [typeGroup, textureGroup, effectGroup]
      const groupChildren = [typeChildren, textureChildren, effectChildren]

      expect(configuredGroups.map((group) => group.title)).toEqual(groupTitles)
      configuredGroups.forEach((group, index) => {
        expect(group.items).toHaveLength(groupChildren[index].length)
        expect(headings).toEqual(expect.arrayContaining(groupChildren[index]))
      })
      expect(
        cards.every((card) => (card.match(/^##\s+/gm) ?? []).length === 1),
      ).toBe(true)
      expect(cards.every((card) => !/^###\s+/m.test(card))).toBe(true)
      expect(headings.at(-1)).toBe(
        locale === 'zh' ? '综合配置' : 'Complete configuration',
      )
      expect(markdown).not.toContain('<card-effects />')
      expect(markdown).not.toContain('<card-zh-effects />')
      expect(markdown).not.toMatch(/s-card-group|card-group/)
    }
  })

  it('keeps editable size examples controlled by reactive models', () => {
    for (const component of interactiveSizeExampleComponents) {
      for (const locale of ['en', 'zh'] as const) {
        const directory =
          locale === 'zh' && component !== 'rate'
            ? `${component}-zh`
            : component
        const examplePath = resolve(
          projectRoot,
          'docs/.vuepress/components',
          directory,
          'size.vue',
        )
        const example = readFileSync(examplePath, 'utf8')

        expect(
          example,
          `${component}: ${locale} reactive size example`,
        ).toMatch(/\bv-model(?::[\w-]+)?=/)
        expect(
          example,
          `${component}: ${locale} has no fixed model value`,
        ).not.toMatch(/(?:^|\s):?model-value=/m)
      }
    }
  })

  it('keeps massive table data inside the virtual-scrolling example in both locales', () => {
    for (const root of docsRoots) {
      const markdownPath = resolve(
        root,
        'table/large-data-and-visualization.md',
      )
      const markdown = readFileSync(markdownPath, 'utf8')
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
      const source = readSlotSource(markdownPath, card, 'template')
      expect(source).toContain('class="stress-demo"')
      expect(source).toContain('v-if="!started"')
      expect(source).not.toMatch(/10 万行|100,000 rows|100 亿|10 billion/)
    }
  })

  it('reconstructs and compiles every component example as a complete Vue SFC', () => {
    const failures: string[] = []
    let exampleCount = 0
    let tsxExampleCount = 0
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

    for (const markdownPath of docsRoots.flatMap(markdownFiles)) {
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

        const tsxScript = readSlotSource(markdownPath, card, 'script-tsx')
        if (!tsxScript) return
        tsxExampleCount += 1

        const tsxSource = [
          readSlotSource(markdownPath, card, 'template'),
          tsxScript,
          readSlotSource(markdownPath, card, 'style'),
        ]
          .filter(Boolean)
          .join('\n\n')
        const tsxDescriptor = parse(tsxSource).descriptor
        if (tsxDescriptor.scriptSetup?.lang !== 'tsx') {
          failures.push(
            `${markdownPath} — ${heading} (TSX): missing script setup lang=\"tsx\"`,
          )
          return
        }

        const tsxCompiled = compileDemoSfc(
          tsxSource,
          `${markdownPath}-${index}-tsx`.replace(/[^a-z0-9-]/gi, '-'),
          demoRuntimeModules,
        )
        if (!tsxCompiled.component || tsxCompiled.error) {
          failures.push(
            `${markdownPath} — ${heading} (TSX): ${tsxCompiled.error || 'failed to compile'}`,
          )
          return
        }

        try {
          const wrapper = mount(tsxCompiled.component, {
            global: {
              config: { warnHandler: () => {} },
              plugins: [saxDesignVue, router],
            },
          })
          wrapper.unmount()
        } catch (error) {
          failures.push(
            `${markdownPath} — ${heading} (TSX): ${error instanceof Error ? error.message : String(error)}`,
          )
        }
      })
    }

    expect(exampleCount).toBeGreaterThan(0)
    expect(tsxExampleCount).toBeGreaterThan(0)
    expect(failures).toEqual([])
  }, 120_000)

  it('keeps every Table example paired, localized and identical to its complete source SFC', () => {
    const paths = docsRoots.map((root) =>
      tableSections.map(([slug]) => resolve(root, `table/${slug}.md`)),
    )
    const markdown = paths.map((localePaths) =>
      localePaths.map((path) => readFileSync(path, 'utf8')),
    )
    const cards = markdown.map((localePages) =>
      localePages.flatMap(exampleCards),
    )
    expect(cards[0]).toHaveLength(69)
    expect(cards[1]).toHaveLength(cards[0].length)

    markdown.forEach((localePages, localeIndex) => {
      expect(
        readFileSync(resolve(docsRoots[localeIndex], 'table.md'), 'utf8'),
      ).not.toContain('<template #example>')
      localePages.forEach((source, sectionIndex) => {
        expect(
          source.match(/<card class="table-doc-section-start">/g),
        ).toHaveLength(1)
        expect(source.match(/^##\s+.+$/gm)).toEqual([
          `## ${tableSections[sectionIndex][localeIndex + 1]}`,
        ])
      })
      expect(
        localePages.flatMap((source) => source.match(/^###\s+.+$/gm) ?? []),
      ).toHaveLength(70)
    })

    markdown.forEach((localePages) => {
      const source = localePages.join('\n')
      expect(source.match(/<template #example>/g)).toHaveLength(
        exampleCards(source).length,
      )
    })

    cards[0].forEach((english, index) => {
      const chinese = cards[1][index]
      const tags = [english, chinese].map(
        (card) => card.match(/<template #example>\s*<([\w-]+)/)?.[1] ?? '',
      )
      expect(tags[0]).toBeTruthy()
      expect(tags[1].replace(/^table-zh-/, 'table-')).toBe(tags[0])

      const sectionIndex = tableSections.findIndex((_, candidateIndex) => {
        const previousCount = markdown[0]
          .slice(0, candidateIndex)
          .reduce((count, source) => count + exampleCards(source).length, 0)
        const currentCount = exampleCards(markdown[0][candidateIndex]).length
        return index >= previousCount && index < previousCount + currentCount
      })
      for (const [locale, card, markdownPath] of [
        ['en', english, paths[0][sectionIndex]],
        ['zh', chinese, paths[1][sectionIndex]],
      ] as const) {
        const heading = card.match(/^###\s+.+$/m)
        expect(heading).toBeTruthy()
        const headingEnd = heading!.index! + heading![0].length
        const exampleStart = card.indexOf('<template #example>')
        expect(
          card.slice(headingEnd, exampleStart).replace(/[`\s]/g, '').length,
        ).toBeGreaterThan(20)

        const canonicalSlots = (['template', 'script', 'style'] as const)
          .map((slot) => readSlotMarkup(card, slot))
          .join('\n')
        const includes = Array.from(
          canonicalSlots.matchAll(
            /@\[code(?:\{\d+-\d+\})?[^\]]*\]\(([^)]+)\)/g,
          ),
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
