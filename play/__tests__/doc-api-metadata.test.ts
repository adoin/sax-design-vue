import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import matter from 'gray-matter'
import { describe, expect, it } from 'vitest'
import { createApiTypeDetailsResolver } from '../../docs/.vuepress/theme/node/apiTypeDetails'
import { auditTableApi } from '../../scripts/audit-table-api.mjs'

const projectRoot = resolve(__dirname, '../..')
const docsRoots = [
  resolve(projectRoot, 'docs/components'),
  resolve(projectRoot, 'docs/zh/components'),
]
const apiSections = new Set([
  'PROPS',
  'CHILD_PROPS',
  'EVENTS',
  'SLOTS',
  'EXPOSES',
])

describe('documentation API metadata', () => {
  it('covers the Table family runtime API and statically declared defaults', () => {
    const pages = auditTableApi()
    expect(pages).toHaveLength(6)
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
      for (const page of pages.filter(
        (page) => page.component !== 'table-grid',
      ))
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

  it('resolves every Table, TableGrid and TableSelect API type in both locales', () => {
    const resolveTypeDetails = createApiTypeDetailsResolver(
      resolve(projectRoot, 'packages/components'),
    )
    const missing: string[] = []
    for (const root of docsRoots) {
      for (const component of ['table', 'table-grid', 'table-select']) {
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
    expect(details.TableEditorConfig.declaration).toContain('checkMethod?')
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

    const crossComponentDetails = resolveTypeDetails('calendar', [
      'ContextMenuItem[]',
    ])
    expect(crossComponentDetails.ContextMenuItem.source).toBe(
      'packages/components/context-menu/src/context-menu.ts',
    )
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
