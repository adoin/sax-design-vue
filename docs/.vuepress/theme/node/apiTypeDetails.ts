import { readFileSync, readdirSync } from 'node:fs'
import { relative, resolve } from 'node:path'

import type { ThemeApiTypeDefinition } from '../shared/frontmatter/normal'

type DeclarationKind = 'interface' | 'type' | 'enum'

interface IndexedTypeDefinition extends ThemeApiTypeDefinition {
  component: string
}

interface TypeRegistry {
  byComponent: Map<string, Map<string, IndexedTypeDefinition>>
  byName: Map<string, IndexedTypeDefinition[]>
}

const componentAliases: Record<string, string[]> = {
  'date-panel': ['date-picker'],
  'form-group': ['form'],
  'radio-group': ['radio'],
}

const declarationPattern =
  /^(?:(?:export|declare)\s+)*(interface|type|enum)\s+([A-Za-z_$][\w$]*)/gm
const identifierPattern = /\b[A-Za-z_$][\w$]*\b/g

const walkTypeScriptFiles = (directory: string): string[] => {
  const files: string[] = []

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue

    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) files.push(...walkTypeScriptFiles(path))
    else if (entry.isFile() && /\.(?:ts|tsx)$/.test(entry.name))
      files.push(path)
  }

  return files
}

const scanBalancedBlock = (source: string, start: number) => {
  let depth = 0
  let quote = ''
  let lineComment = false
  let blockComment = false

  for (let index = start; index < source.length; index += 1) {
    const character = source[index]
    const next = source[index + 1]

    if (lineComment) {
      if (character === '\n') lineComment = false
      continue
    }
    if (blockComment) {
      if (character === '*' && next === '/') {
        blockComment = false
        index += 1
      }
      continue
    }
    if (quote) {
      if (character === '\\') index += 1
      else if (character === quote) quote = ''
      continue
    }
    if (character === '/' && next === '/') {
      lineComment = true
      index += 1
      continue
    }
    if (character === '/' && next === '*') {
      blockComment = true
      index += 1
      continue
    }
    if (character === "'" || character === '"' || character === '`') {
      quote = character
      continue
    }
    if (character === '{') depth += 1
    else if (character === '}') {
      depth -= 1
      if (depth === 0) return index + 1
    }
  }

  return source.length
}

const scanTypeAlias = (source: string, start: number) => {
  const assignment = source.indexOf('=', start)
  if (assignment < 0) return source.length

  const depths = { brace: 0, bracket: 0, parenthesis: 0, angle: 0 }
  let quote = ''
  let lineComment = false
  let blockComment = false

  for (let index = assignment + 1; index < source.length; index += 1) {
    const character = source[index]
    const next = source[index + 1]

    if (lineComment) {
      if (character === '\n') lineComment = false
      continue
    }
    if (blockComment) {
      if (character === '*' && next === '/') {
        blockComment = false
        index += 1
      }
      continue
    }
    if (quote) {
      if (character === '\\') index += 1
      else if (character === quote) quote = ''
      continue
    }
    if (character === '/' && next === '/') {
      lineComment = true
      index += 1
      continue
    }
    if (character === '/' && next === '*') {
      blockComment = true
      index += 1
      continue
    }
    if (character === "'" || character === '"' || character === '`') {
      quote = character
      continue
    }

    if (character === '{') depths.brace += 1
    else if (character === '}') depths.brace -= 1
    else if (character === '[') depths.bracket += 1
    else if (character === ']') depths.bracket -= 1
    else if (character === '(') depths.parenthesis += 1
    else if (character === ')') depths.parenthesis -= 1
    else if (character === '<') depths.angle += 1
    else if (character === '>' && depths.angle > 0) depths.angle -= 1

    const balanced = Object.values(depths).every((depth) => depth === 0)
    if (balanced && character === ';') return index + 1
    if (balanced && character === '\n' && /\S/.test(next || '')) return index
  }

  return source.length
}

const declarationEnd = (
  source: string,
  start: number,
  kind: DeclarationKind,
) => {
  if (kind === 'type') return scanTypeAlias(source, start)
  const blockStart = source.indexOf('{', start)
  return blockStart < 0 ? source.length : scanBalancedBlock(source, blockStart)
}

const readDeclarations = (
  source: string,
  component: string,
  sourcePath: string,
) => {
  const declarations: IndexedTypeDefinition[] = []

  for (const match of source.matchAll(declarationPattern)) {
    const start = match.index
    const kind = match[1] as DeclarationKind
    const name = match[2]
    const end = declarationEnd(source, start, kind)

    declarations.push({
      name,
      declaration: source.slice(start, end).trim(),
      source: sourcePath,
      references: [],
      component,
    })
  }

  return declarations
}

const createRegistry = (componentsRoot: string): TypeRegistry => {
  const byComponent = new Map<string, Map<string, IndexedTypeDefinition>>()
  const byName = new Map<string, IndexedTypeDefinition[]>()

  for (const file of walkTypeScriptFiles(componentsRoot)) {
    const component = relative(componentsRoot, file).split(/[\\/]/)[0]
    const componentTypes = byComponent.get(component) ?? new Map()
    byComponent.set(component, componentTypes)

    for (const definition of readDeclarations(
      readFileSync(file, 'utf8'),
      component,
      relative(resolve(componentsRoot, '../..'), file).replaceAll('\\', '/'),
    )) {
      if (!componentTypes.has(definition.name)) {
        componentTypes.set(definition.name, definition)
      }
      const namedDefinitions = byName.get(definition.name) ?? []
      namedDefinitions.push(definition)
      byName.set(definition.name, namedDefinitions)
    }
  }

  const resolveDefinition = (component: string, name: string) => {
    const localComponents = [component, ...(componentAliases[component] ?? [])]
    for (const localComponent of localComponents) {
      const local = byComponent.get(localComponent)?.get(name)
      if (local) return local
    }

    const matches = byName.get(name)
    return matches?.length === 1 ? matches[0] : undefined
  }

  for (const definitions of byComponent.values()) {
    for (const definition of definitions.values()) {
      const seen = new Set<string>()
      definition.references = Array.from(
        definition.declaration.matchAll(identifierPattern),
        (match) => match[0],
      ).filter((name) => {
        if (name === definition.name || seen.has(name)) return false
        seen.add(name)
        return !!resolveDefinition(definition.component, name)
      })
    }
  }

  return { byComponent, byName }
}

export const createApiTypeDetailsResolver = (componentsRoot: string) => {
  let registry: TypeRegistry | undefined

  const getRegistry = () => {
    registry ??= createRegistry(componentsRoot)
    return registry
  }

  return (component: string, expressions: string[]) => {
    const { byComponent, byName } = getRegistry()
    const details: Record<string, ThemeApiTypeDefinition> = {}
    const queued = new Set<string>()
    const queue: Array<{ component: string; name: string }> = []

    const resolveDefinition = (owner: string, name: string) => {
      const localComponents = [owner, ...(componentAliases[owner] ?? [])]
      for (const localComponent of localComponents) {
        const local = byComponent.get(localComponent)?.get(name)
        if (local) return local
      }
      const matches = byName.get(name)
      return matches?.length === 1 ? matches[0] : undefined
    }

    const enqueue = (owner: string, name: string) => {
      const definition = resolveDefinition(owner, name)
      if (!definition) return
      const key = `${definition.component}:${definition.name}`
      if (queued.has(key)) return
      queued.add(key)
      queue.push({ component: definition.component, name: definition.name })
    }

    expressions.forEach((expression) => {
      for (const match of expression.matchAll(identifierPattern)) {
        enqueue(component, match[0])
      }
    })

    while (queue.length) {
      const current = queue.shift()!
      const definition = resolveDefinition(current.component, current.name)
      if (!definition || details[definition.name]) continue

      details[definition.name] = {
        name: definition.name,
        declaration: definition.declaration,
        source: definition.source,
        references: definition.references,
      }
      definition.references.forEach((name) =>
        enqueue(definition.component, name),
      )
    }

    return details
  }
}
