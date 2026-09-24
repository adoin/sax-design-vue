import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import matter from 'gray-matter'
import { describe, expect, it } from 'vitest'
import { createApiTypeDetailsResolver } from '../../docs/.vuepress/theme/node/apiTypeDetails'
import { auditTableApi } from './table-api-metadata.mjs'

const projectRoot = resolve(__dirname, '../..')
const docsRoots = [
  resolve(projectRoot, 'docs/components'),
  resolve(projectRoot, 'docs/zh/components'),
]
const apiSections = new Set([
  'PROPS',
  'CHILD_PROPS',
  'GROUP_PROPS',
  'GROUP_TABS_PROPS',
  'BUTTON_PROPS',
  'PICKER_API',
  'ITEMS',
  'RULES',
  'RENDERERS',
  'EVENTS',
  'SLOTS',
  'EXPOSES',
])

describe('documentation API metadata', () => {
  it('keeps legacy card subsections in the shared example and API hierarchy', () => {
    const names = [
      'avatar',
      'calendar',
      'checkbox',
      'dialog',
      'radio',
      'tag',
      'upload',
    ]
    for (const root of docsRoots) {
      for (const name of names) {
        const source = readFileSync(resolve(root, `${name}.md`), 'utf8')
        const cards = [...source.matchAll(/<card[^>]*>[\s\S]*?<\/card>/g)]
        for (const [card] of cards) {
          expect(card, `${name} card has no nested heading`).not.toMatch(
            /^###\s/m,
          )
          if (card.includes('<template #example>'))
            expect(
              [...card.matchAll(/^##\s/gm)],
              `${name} example card owns one H2`,
            ).toHaveLength(1)
        }
      }

      const checkbox = matter(
        readFileSync(resolve(root, 'checkbox.md'), 'utf8'),
      ).data
      const radio = matter(readFileSync(resolve(root, 'radio.md'), 'utf8')).data
      const tag = matter(readFileSync(resolve(root, 'tag.md'), 'utf8')).data
      const upload = matter(
        readFileSync(resolve(root, 'upload.md'), 'utf8'),
      ).data
      expect(checkbox.GROUP_PROPS.length).toBeGreaterThan(0)
      expect(checkbox.GROUP_TABS_PROPS.length).toBeGreaterThan(0)
      expect(radio.BUTTON_PROPS.length).toBeGreaterThan(0)
      expect(tag.GROUP_PROPS.length).toBeGreaterThan(0)
      expect(
        upload.PICKER_API.map((row: { name: string }) => row.name),
      ).toEqual(['SUpload.pick', 'pickUploadFiles'])
    }
  })

  it('keeps Form ownership and Table renderer contracts in generated API sections', () => {
    for (const root of docsRoots) {
      const formSource = readFileSync(resolve(root, 'form.md'), 'utf8')
      const form = matter(formSource).data
      const table = matter(readFileSync(resolve(root, 'table.md'), 'utf8')).data

      expect(formSource).not.toMatch(/^## (API ownership|API 归属)$/m)
      expect(form.ITEMS.map((row: { name: string }) => row.name)).toContain(
        'children',
      )
      expect(form.RULES.map((row: { name: string }) => row.name)).toContain(
        'validator',
      )
      expect(form.RENDERERS.map((row: { name: string }) => row.name)).toContain(
        'modelEvent',
      )
      expect(table.RENDERERS.map((row: { name: string }) => row.name)).toEqual([
        'renderDefault',
        'renderEdit',
        'renderToolbar',
        'queryConfig.items[].itemRender',
        'renderFormItem',
        'name',
        'props',
        'attrs',
        'events',
        'options',
        'cell',
        'header',
        'footer',
        'edit',
        'filter',
      ])
      const formItemRenderer = table.RENDERERS.find(
        (row: { name: string }) => row.name === 'renderFormItem',
      )
      expect(formItemRenderer.link).toBe(
        root === docsRoots[1]
          ? '/zh/components/form.html#custom-renderer'
          : '/components/form.html#custom-renderer',
      )
    }
  })

  it('renders API extensions through explicit Table slots and exposes every type', () => {
    const tableSource = readFileSync(
      resolve(projectRoot, 'docs/.vuepress/theme/components/ApiTable.vue'),
      'utf8',
    )
    for (const slot of [
      'apiName',
      'apiType',
      'apiValues',
      'apiDescription',
      'apiDefault',
      'apiExample',
      'apiMore',
    ]) {
      expect(tableSource).toContain(`slots: { default: '${slot}' }`)
      expect(tableSource).toContain(`<template #${slot}=`)
    }
    expect(tableSource).toContain('v-if="row.type"')
    expect(tableSource).not.toContain('#cell-type')
    expect(tableSource).toContain('const hasValues = computed')
    expect(tableSource).toContain('if (hasValues.value)')
    expect(tableSource).toContain('import { STooltip }')
    expect(tableSource).toContain(":trigger=\"['hover', 'focus']\"")
    expect(tableSource).toContain('t.examples.createIssue')
    expect(tableSource).not.toContain('name="bx:terminal"')
    expect(tableSource).toContain(
      ':aria-label="`${labels.usage}: ${row.name}`"',
    )
    expect(tableSource).toContain(
      '<template #content>{{ labels.usage }}</template>',
    )
    expect(tableSource).not.toContain('class="api-action"')

    const detailsSource = readFileSync(
      resolve(
        projectRoot,
        'docs/.vuepress/theme/components/ApiTypeDetails.vue',
      ),
      'utf8',
    )
    expect(detailsSource).toContain(
      "import ApiTypeTokens from './ApiTypeTokens.vue'",
    )
    expect(detailsSource).toContain('virtual-triggering')
    expect(detailsSource).toContain(':trigger="[]"')
    expect(detailsSource).toContain(':close-on-click-outside="index === 0"')
    expect(detailsSource).toContain(':outside-click-ignore="[stackSelector]"')
    expect(detailsSource).not.toContain('trigger="hover"')
  })

  it('covers the Table family runtime API and statically declared defaults', () => {
    const pages = auditTableApi()
    expect(pages).toHaveLength(4)
    for (const page of pages) {
      const label = `${page.component}/${page.locale}`
      expect(page.inheritedTableLink, label).toBe(true)
      expect(page.exposeTypeMismatch, label).toEqual([])
      expect(page.exposeSignatures.mismatches, label).toEqual([])
      expect(page.exposeSignatures.checked, label).toBe(
        page.sections.EXPOSES.actual,
      )
      expect(page.defaults.checked, label).toBeGreaterThan(0)
      expect(page.defaults.mismatches, label).toEqual([])
      for (const [name, section] of Object.entries(page.sections)) {
        expect(section.actual, `${label}/${name}`).toBeGreaterThan(0)
        expect(section.missing, `${label}/${name}`).toEqual([])
        expect(section.extra, `${label}/${name}`).toEqual([])
        expect(section.duplicates, `${label}/${name}`).toEqual([])
      }
    }
  })

  it('detects changed method argument types, optionality and return values', () => {
    for (const replacement of [
      '(row: string, expanded?: boolean) => Promise<void>',
      '(row: TableRow, expanded: boolean) => Promise<void>',
      '(row: TableRow, expanded?: boolean) => void',
    ]) {
      const pages = auditTableApi({
        readDocumentation: (path: string) =>
          readFileSync(resolve(projectRoot, path), 'utf8').replace(
            '(row: TableRow, expanded?: boolean) => Promise<void>',
            replacement,
          ),
      })
      for (const page of pages)
        expect(
          page.exposeSignatures.mismatches.map((item) => item.name),
        ).toEqual(['toggleRowExpand'])
    }
  })

  it('detects missing metadata, duplicate listener aliases and incorrect defaults', () => {
    const pages = auditTableApi({
      readDocumentation: (path: string) => {
        const text = readFileSync(resolve(projectRoot, path), 'utf8').replace(
          /\r\n/g,
          '\n',
        )
        if (path !== 'docs/components/table-select.md') return text
        return text
          .replace(/ {2}- name: "placeholder"\n(?: {4}.*\n)*/, '')
          .replace('EVENTS:\n', 'EVENTS:\n  - name: rowClick\n')
      },
    })
    const page = pages.find(
      (item) => item.component === 'table-select' && item.locale === 'en',
    )!
    expect(page.sections.PROPS.missing).toContain('placeholder')
    expect(page.sections.EVENTS.duplicates).toContain('row-click')
    // The local Boolean default on clearable is statically resolved; disabled
    // is an imported Popper prop and is deliberately left to semantic review.
    const changed = auditTableApi({
      readDocumentation: (path: string) =>
        readFileSync(resolve(projectRoot, path), 'utf8').replace(
          /( {2}- name: clearable\r?\n(?: {4}.*\r?\n)*? {4}default:) false/,
          '$1 true',
        ),
    }).find(
      (item) => item.component === 'table-select' && item.locale === 'en',
    )!
    expect(changed.defaults.mismatches).toContainEqual({
      name: 'clearable',
      expected: false,
      documented: true,
    })
  })

  it('resolves every Table and TableSelect API type in both locales', () => {
    const resolveTypeDetails = createApiTypeDetailsResolver(
      resolve(projectRoot, 'packages/components'),
    )
    const missing: string[] = []
    for (const root of docsRoots) {
      for (const component of ['table', 'table-select']) {
        const path = resolve(root, `${component}.md`)
        const metadata = matter(readFileSync(path, 'utf8')).data
        const types: string[] = [...apiSections].flatMap((section) =>
          (metadata[section] ?? []).map(
            (entry: { type?: string }) => entry.type ?? '',
          ),
        )
        const details = resolveTypeDetails(component, types)
        const names = new Set(
          types.flatMap((type: string) => type.match(/\bTable[A-Z]\w*/g) ?? []),
        )
        expect(names.size, `${path}: declared table types`).toBeGreaterThan(0)
        for (const name of names)
          if (!details[name]?.declaration) missing.push(`${path}: ${name}`)
      }
    }
    expect(missing).toEqual([])
  })

  it('resolves shared public aliases used by component API metadata', () => {
    const resolveTypeDetails = createApiTypeDetailsResolver(
      resolve(projectRoot, 'packages/components'),
      [resolve(projectRoot, 'packages/constants')],
    )

    expect(resolveTypeDetails('cascader', ['ComponentSize'])).toMatchObject({
      ComponentSize: {
        name: 'ComponentSize',
        declaration:
          'export type ComponentSize = (typeof componentSizes)[number]',
        source: 'packages/constants/size.ts',
      },
    })
    expect(resolveTypeDetails('text', ['TextEffect'])).toMatchObject({
      TextEffect: {
        name: 'TextEffect',
        declaration: 'export type TextEffect = (typeof textEffects)[number]',
        source: 'packages/components/text/src/text.ts',
      },
    })
    expect(
      resolveTypeDetails('card', ['CardType', 'CardTexture', 'CardEffect']),
    ).toMatchObject({
      CardType: {
        declaration: 'export type CardType = (typeof cardTypes)[number]',
        source: 'packages/components/card/src/card.ts',
      },
      CardEffect: {
        declaration: 'export type CardEffect = (typeof cardEffects)[number]',
        source: 'packages/components/card/src/card.ts',
      },
      CardTexture: {
        declaration: 'export type CardTexture = (typeof cardTextures)[number]',
        source: 'packages/components/card/src/card.ts',
      },
    })
    const scrollbarDetails = resolveTypeDetails('scrollbar', ['ScrollbarFade'])
    expect(scrollbarDetails.ScrollbarFade.declaration).toContain(
      'ScrollbarFadeDirection',
    )
    expect(scrollbarDetails.ScrollbarFadeOptions.declaration).toContain(
      'size?: number | string',
    )
    expect(scrollbarDetails.ScrollbarFadeDirection.declaration).toContain(
      '(typeof scrollbarFadeDirections)[number]',
    )
  })

  it('resolves API types and their referenced local declarations', () => {
    const resolveTypeDetails = createApiTypeDetailsResolver(
      resolve(projectRoot, 'packages/components'),
    )
    const details = resolveTypeDetails('table', [
      'TableColumn[]',
      'Boolean | TableVirtualConfig',
      'Boolean | TableResizeConfig',
      'TableColumnWidths',
      'TableColumnResizeParams',
      'Boolean | TableEditConfig',
      'TableEditEndParams',
      'TableEditSlotParams',
      'TableValidationRules',
      'TableValidateOptions',
      'TableValidationConfig',
      'TableValidationResult',
    ])

    expect(details.TableColumn.declaration).toContain(
      'export interface TableColumn',
    )
    expect(details.TableColumnOptions.declaration).toContain(
      'resizable?: boolean',
    )
    expect(details.TableResizeConfig.declaration).toContain('minWidth?: number')
    expect(details.TableColumnWidths.declaration).toContain(
      'Record<string, number>',
    )
    expect(details.TableColumnResizeParams.declaration).toContain(
      'oldWidth: number',
    )
    expect(details.TableColumnSlots.declaration).toContain(
      'export interface TableColumnSlots',
    )
    expect(details.TableRenderer.declaration).toContain(
      'export interface TableRenderer',
    )
    expect(details.TableVirtualConfig.declaration).toContain(
      'export interface TableVirtualConfig',
    )
    expect(details.TableEditConfig.declaration).toContain('onContextChange?')
    expect(details.TableEditorConfig.declaration).toContain('editableMethod?')
    expect(details.TableEditEndParams.declaration).toContain('TableEditRecord')
    expect(details.TableEditRecord.declaration).toContain('updatedRow: Row')
    expect(details.TableEditSlotParams.declaration).toContain('setValue:')
    expect(details.TableEditReason.declaration).toContain("'view'")
    expect(details.TableValidationRule.declaration).toContain('validator?')
    expect(details.TableValidationContext.declaration).toContain(
      'signal: AbortSignal',
    )
    expect(details.TableValidationConfig.declaration).toContain('onCommit?')
    expect(details.TableValidateOptions.declaration).toContain('scope?')
    expect(details.TableValidationResult.declaration).toContain(
      'cancelled: boolean',
    )
    expect(details.TableValidationError.declaration).toContain('field: string')

    expect(
      resolveTypeDetails('table', ['String | Boolean | Function']),
    ).toEqual({})
    expect(resolveTypeDetails('table', ['Row'])).toEqual({})

    const crossComponentDetails = resolveTypeDetails('calendar', [
      'ContextMenuItem[]',
    ])
    expect(crossComponentDetails.ContextMenuItem.source).toBe(
      'packages/components/context-menu/src/context-menu.ts',
    )
  })

  it('documents every scoped slot with typed, clickable scope references in both locales', () => {
    const resolveTypeDetails = createApiTypeDetailsResolver(
      resolve(projectRoot, 'packages/components'),
      [resolve(projectRoot, 'packages/constants')],
    )
    const missing: string[] = []
    const scopesByLocale: Array<Record<string, Record<string, string>>> = []
    const builtIns = new Set(['Array', 'Function', 'Promise', 'Record'])

    for (const root of docsRoots) {
      const pages: Record<string, Record<string, string>> = {}
      for (const filename of readdirSync(root).filter((file) =>
        file.endsWith('.md'),
      )) {
        const component = filename.slice(0, -3)
        const metadata = matter(
          readFileSync(resolve(root, filename), 'utf8'),
        ).data
        const rows = (metadata.SLOTS ?? []) as Array<{
          name: string
          type?: string
          values?: unknown
          scope?: string
        }>
        for (const row of rows) {
          if (!row.scope) continue
          expect(row.type, `${filename} ${row.name}`).toBe('Slot')
          expect(row.values, `${filename} ${row.name}`).toBeUndefined()
          const details = resolveTypeDetails(component, [row.scope])
          for (const name of row.scope.match(/\b[A-Z][A-Za-z0-9_]*/g) ?? []) {
            if (!builtIns.has(name) && !details[name]?.declaration)
              missing.push(`${filename} ${row.name}: ${name}`)
          }
          pages[component] ??= {}
          pages[component][row.name] = row.scope
        }
      }
      scopesByLocale.push(pages)
    }

    expect(missing).toEqual([])
    expect(Object.keys(scopesByLocale[0]).length).toBeGreaterThan(10)
    expect(scopesByLocale[1]).toEqual(scopesByLocale[0])

    const tableSource = readFileSync(
      resolve(projectRoot, 'docs/.vuepress/theme/components/ApiTable.vue'),
      'utf8',
    )
    const themeSource = readFileSync(
      resolve(projectRoot, 'docs/.vuepress/theme/index.ts'),
      'utf8',
    )
    expect(tableSource).toContain('scopeDetails: getTypeDetails(row.scope)')
    expect(tableSource).toContain(':definitions="row.scopeDetails"')
    expect(themeSource).toContain('typeExpressions.push(row.scope)')
  })

  it('keeps every API entry on its own row', () => {
    const groupedRows: string[] = []
    const parseFailures: string[] = []
    const invalidValues: string[] = []
    const invalidDefaults: string[] = []

    for (const root of docsRoots) {
      for (const filename of readdirSync(root).filter((file) =>
        file.endsWith('.md'),
      )) {
        const path = resolve(root, filename)
        const source = readFileSync(path, 'utf8')
        const lines = source.split(/\r?\n/)
        let inFrontmatter = false
        let frontmatterClosed = false
        let section = ''

        try {
          const frontmatter = matter(source).data as Record<
            string,
            | Array<{
                name?: unknown
                values?: unknown
                default?: unknown
              }>
            | undefined
          >
          apiSections.forEach((apiSection) => {
            frontmatter[apiSection]?.forEach((row) => {
              if (row.values !== undefined && typeof row.values !== 'string') {
                invalidValues.push(
                  `${path} — ${apiSection}.${String(row.name)} values must be a string`,
                )
              }
              if (row.default === '-' || row.default === '—') {
                invalidDefaults.push(
                  `${path} — ${apiSection}.${String(row.name)} uses a dash as its default`,
                )
              }
            })
          })
        } catch (error) {
          parseFailures.push(
            `${path} — ${error instanceof Error ? error.message : String(error)}`,
          )
        }

        lines.forEach((line, index) => {
          if (line === '---' && !frontmatterClosed) {
            if (!inFrontmatter) inFrontmatter = true
            else {
              inFrontmatter = false
              frontmatterClosed = true
            }
            return
          }
          if (!inFrontmatter) return

          const sectionMatch = line.match(/^([A-Z][A-Z_]*):/)
          if (sectionMatch) section = sectionMatch[1]
          if (!apiSections.has(section)) return

          const nameMatch = line.match(/^ {2}- name:\s*(.+)$/)
          if (nameMatch && nameMatch[1].includes('/')) {
            groupedRows.push(`${path}:${index + 1} — ${nameMatch[1]}`)
          }
        })
      }
    }

    expect(parseFailures).toEqual([])
    expect(invalidValues).toEqual([])
    expect(invalidDefaults).toEqual([])
    expect(groupedRows).toEqual([])
  })
})
