import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
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
const splittableFields = new Set(['type', 'values', 'default'])

const decodeYamlScalar = (rawValue) => {
  let value = rawValue.trim()

  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      value = JSON.parse(value)
    } catch {
      // Leave malformed legacy content intact so it can still be quoted safely.
    }
  } else if (value.startsWith("'") && value.endsWith("'")) {
    value = value.slice(1, -1).replaceAll("''", "'")
  }

  value = String(value).trim()
  if (
    value.length >= 2 &&
    value[0] === value.at(-1) &&
    (value[0] === "'" || value[0] === '"')
  ) {
    value = value.slice(1, -1)
  }
  return value
}

const splitNames = (value) =>
  value
    .split(/\s*\/\s*/)
    .map((part) => part.trim())
    .filter(Boolean)

const splitScalar = (rawValue, count) => {
  const trimmed = rawValue.trim()
  const quote =
    trimmed.length >= 2 &&
    trimmed[0] === trimmed.at(-1) &&
    (trimmed[0] === "'" || trimmed[0] === '"')
      ? trimmed[0]
      : ''
  const inner = quote ? trimmed.slice(1, -1) : trimmed
  const candidates = [inner.split(/\s+\/\s+/), inner.split(/\s*,\s*/)]
  const parts = candidates.find((candidate) => candidate.length === count)

  if (!parts) return Array.from({ length: count }, () => rawValue)
  return parts.map((part) =>
    quote ? `${quote}${part.trim()}${quote}` : part.trim(),
  )
}

const splitRow = (rowLines, names) => {
  const fieldValues = new Map()

  rowLines.forEach((line, index) => {
    const match = line.match(/^ {4}([a-z][\w-]*):\s*(.*)$/)
    if (!match || !splittableFields.has(match[1])) return
    fieldValues.set(index, splitScalar(match[2], names.length))
  })

  return names.flatMap((name, nameIndex) =>
    rowLines.map((line, lineIndex) => {
      if (lineIndex === 0) return `  - name: ${name}`
      const values = fieldValues.get(lineIndex)
      if (!values) return line
      return line.replace(/^( {4}[a-z][\w-]*:\s*).*/, `$1${values[nameIndex]}`)
    }),
  )
}

const transformMarkdown = (source) => {
  const newline = source.includes('\r\n') ? '\r\n' : '\n'
  const hasFinalNewline = source.endsWith('\n')
  let lines = source.split(/\r?\n/)
  const closingFrontmatterIndex = lines.indexOf('---', 1)
  const descriptionLines = lines
    .slice(1, closingFrontmatterIndex)
    .map((line, index) => ({ index: index + 1, line }))
    .filter(({ line }) => line.startsWith('description:'))

  if (descriptionLines.length > 1) {
    const description = descriptionLines[0].line
    const duplicateIndexes = new Set(descriptionLines.map(({ index }) => index))
    lines = lines.filter((_, index) => !duplicateIndexes.has(index))
    lines.splice(lines.indexOf('---', 1), 0, description)
  }
  const result = []
  let inFrontmatter = false
  let frontmatterClosed = false
  let section = ''
  let expandedRows = 0
  let createdRows = 0

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]

    if (line === '---' && !frontmatterClosed) {
      if (!inFrontmatter) inFrontmatter = true
      else {
        inFrontmatter = false
        frontmatterClosed = true
      }
      result.push(line)
      continue
    }

    if (inFrontmatter) {
      const sectionMatch = line.match(/^([A-Z][A-Z_]*):/)
      if (sectionMatch) section = sectionMatch[1]
    }

    const rowMatch =
      inFrontmatter && apiSections.has(section)
        ? line.match(/^ {2}- name:\s*(.+\/.+)$/)
        : null

    const unsafeDashMatch =
      inFrontmatter && apiSections.has(section)
        ? line.match(/^( {4}(?:type|values|default): )-$/)
        : null

    const defaultMatch =
      inFrontmatter && apiSections.has(section)
        ? line.match(/^( {4}default:)(.*)$/)
        : null

    if (
      defaultMatch &&
      ['-', '—'].includes(decodeYamlScalar(defaultMatch[2]))
    ) {
      result.push(`${defaultMatch[1]} null`)
      continue
    }

    const valuesMatch =
      inFrontmatter && apiSections.has(section)
        ? line.match(/^( {4}values:)(.*)$/)
        : null

    if (valuesMatch && !['|', '>'].includes(valuesMatch[2].trim())) {
      result.push(
        `${valuesMatch[1]} ${JSON.stringify(decodeYamlScalar(valuesMatch[2]))}`,
      )
      continue
    }

    if (unsafeDashMatch) {
      result.push(`${unsafeDashMatch[1]}'-'`)
      continue
    }

    if (!rowMatch) {
      result.push(line)
      continue
    }

    let end = index + 1
    while (
      end < lines.length &&
      !lines[end].startsWith('  - name:') &&
      !/^[A-Za-z][\w-]*:/.test(lines[end]) &&
      lines[end] !== '---'
    ) {
      end += 1
    }

    const names = splitNames(rowMatch[1])
    const rowLines = lines.slice(index, end)
    result.push(...splitRow(rowLines, names))
    expandedRows += 1
    createdRows += names.length
    index = end - 1
  }

  let output = result.join(newline)
  if (hasFinalNewline && !output.endsWith(newline)) output += newline
  return { output, expandedRows, createdRows }
}

let changedFiles = 0
let expandedRows = 0
let createdRows = 0

for (const root of docsRoots) {
  for (const filename of readdirSync(root).filter((file) =>
    file.endsWith('.md'),
  )) {
    const path = resolve(root, filename)
    const source = readFileSync(path, 'utf8')
    const transformed = transformMarkdown(source)
    if (transformed.output === source) continue

    writeFileSync(path, transformed.output)
    changedFiles += 1
    expandedRows += transformed.expandedRows
    createdRows += transformed.createdRows
  }
}

process.stdout.write(
  `Split ${expandedRows} grouped API rows into ${createdRows} rows across ${changedFiles} files.\n`,
)
