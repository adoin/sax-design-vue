import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import matter from 'gray-matter'
import { describe, expect, it } from 'vitest'
import { createApiTypeDetailsResolver } from '../../docs/.vuepress/theme/node/apiTypeDetails'

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
    expect(details.TableValidationContext.declaration).toContain('signal: AbortSignal')
    expect(details.TableValidationConfig.declaration).toContain('onCommit?')
    expect(details.TableValidateOptions.declaration).toContain('scope?')
    expect(details.TableValidationResult.declaration).toContain('cancelled: boolean')
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

          const nameMatch = line.match(/^  - name:\s*(.+)$/)
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
