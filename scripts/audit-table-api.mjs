import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { URL, fileURLToPath } from 'node:url'
import { parse } from '@vue/compiler-sfc'
import ts from 'typescript'
import matter from 'gray-matter'

const moduleUrl = import.meta.url
const root = resolve(fileURLToPath(new URL('..', moduleUrl)))
const kebab = (value) =>
  value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
const unwrap = (node) => {
  if (!node) throw new Error('Missing API expression')
  while (
    ts.isAsExpression(node) ||
    ts.isParenthesizedExpression(node) ||
    ts.isSatisfiesExpression(node)
  )
    node = node.expression
  return node
}
const keyOf = (node) => {
  if (!node) return undefined
  if (ts.isIdentifier(node) || ts.isStringLiteral(node)) return node.text
  if (
    ts.isComputedPropertyName(node) &&
    node.expression.getText() === 'UPDATE_MODEL_EVENT'
  )
    return 'update:modelValue'
  throw new Error(`Unsupported API key: ${node.getText()}`)
}
const source = (path) => {
  const text = readFileSync(resolve(root, path), 'utf8')
  const script = path.endsWith('.vue')
    ? parse(text).descriptor.scriptSetup.content
    : text
  return ts.createSourceFile(path, script, ts.ScriptTarget.Latest, true)
}
const declarations = (file) => {
  const nodes = new Map()
  const visit = (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer
    )
      nodes.set(node.name.text, node.initializer)
    ts.forEachChild(node, visit)
  }
  visit(file)
  return nodes
}
const objectEntries = (expression, locals, inherited = new Map()) => {
  let node = unwrap(expression)
  if (ts.isIdentifier(node))
    return objectEntries(locals.get(node.text), locals, inherited)
  if (ts.isCallExpression(node) && node.expression.getText() === 'buildProps')
    node = unwrap(node.arguments[0])
  if (!ts.isObjectLiteralExpression(node))
    throw new Error(`Expected API object: ${node.getText()}`)
  const entries = new Map()
  for (const member of node.properties) {
    if (ts.isSpreadAssignment(member)) {
      const base = inherited.get(member.expression.getText())
      if (!base) throw new Error(`Unsupported API spread: ${member.getText()}`)
      for (const entry of base) entries.set(...entry)
    } else entries.set(keyOf(member.name), member)
  }
  return entries
}
const ownKeys = (expression) =>
  unwrap(expression.arguments[0])
    .properties.filter((member) => !ts.isSpreadAssignment(member))
    .map((member) => keyOf(member.name))
const interfaceKeys = (file, name) => {
  const node = file.statements.find(
    (statement) =>
      ts.isInterfaceDeclaration(statement) && statement.name.text === name,
  )
  if (!node) throw new Error(`Missing ${name}`)
  return node.members.map((member) => keyOf(member.name))
}
// Compare argument order, optionality and result types, independently of names
// chosen for arguments in prose. Table's Row defaults to TableRow.
const signatureOf = (node) => {
  const type = (value) => {
    if (!value) return 'untyped'
    if (ts.isParenthesizedTypeNode(value)) return type(value.type)
    const unionMembers = (item) =>
      ts.isUnionTypeNode(item)
        ? item.types.flatMap(unionMembers)
        : ts.isTypeReferenceNode(item) &&
            item.typeName.getText() === 'TableRowKey'
          ? ['number', 'string']
          : [type(item)]
    if (ts.isUnionTypeNode(value))
      return [...new Set(value.types.flatMap(unionMembers))].sort().join('|')
    if (ts.isArrayTypeNode(value)) return `Array<${type(value.elementType)}>`
    if (ts.isTypeReferenceNode(value)) {
      let name = value.typeName.getText()
      if (name === 'Row') name = 'TableRow'
      if (name === 'TableRowKey') return 'number|string'
      const args = value.typeArguments?.map(type) ?? []
      if (
        name.startsWith('Table') &&
        args.length === 1 &&
        args[0] === 'TableRow'
      )
        args.length = 0
      return args.length ? `${name}<${args.join(',')}>` : name
    }
    return value.getText().replace(/\s+/g, '').replace(/"/g, "'")
  }
  if (!node || !ts.isFunctionTypeNode(node)) return null
  return {
    parameters: node.parameters.map((parameter) => ({
      type: type(parameter.type),
      optional: Boolean(parameter.questionToken),
      rest: Boolean(parameter.dotDotDotToken),
    })),
    result: type(node.type),
  }
}
const interfaceSignatures = (file, name) => {
  const node = file.statements.find(
    (statement) =>
      ts.isInterfaceDeclaration(statement) && statement.name.text === name,
  )
  return new Map(
    node.members.map((member) => [
      keyOf(member.name),
      signatureOf(member.type),
    ]),
  )
}
const documentedSignature = (text) => {
  const file = ts.createSourceFile(
    'signature.ts',
    `type Method = ${text}`,
    ts.ScriptTarget.Latest,
    true,
  )
  return file.parseDiagnostics.length
    ? null
    : signatureOf(file.statements[0]?.type)
}
const exposed = (file) => {
  let call
  const visit = (node) => {
    if (
      ts.isCallExpression(node) &&
      node.expression.getText() === 'defineExpose'
    )
      call = node
    ts.forEachChild(node, visit)
  }
  visit(file)
  if (!call) throw new Error(`Missing defineExpose: ${file.fileName}`)
  return [...objectEntries(call.arguments[0], declarations(file)).keys()]
}

// Only statically declared defaults are compared. Theme hooks and imported
// Popper props require a separate semantic review, not a guessed default.
const propDefault = (member) => {
  const node = unwrap(member.initializer)
  if (ts.isIdentifier(node)) return node.text === 'Boolean' ? false : undefined
  if (!ts.isObjectLiteralExpression(node)) return undefined
  const value = node.properties.find(
    (property) => property.name && keyOf(property.name) === 'default',
  )?.initializer
  if (!value) return undefined
  let expression = unwrap(value)
  if (ts.isArrowFunction(expression)) expression = unwrap(expression.body)
  if (expression.kind === ts.SyntaxKind.TrueKeyword) return true
  if (expression.kind === ts.SyntaxKind.FalseKeyword) return false
  if (
    expression.kind === ts.SyntaxKind.NullKeyword ||
    expression.getText() === 'undefined'
  )
    return null
  if (ts.isStringLiteral(expression)) return expression.text
  if (ts.isNumericLiteral(expression)) return Number(expression.text)
  if (ts.isArrayLiteralExpression(expression) && !expression.elements.length)
    return '[]'
  if (ts.isObjectLiteralExpression(expression) && !expression.properties.length)
    return '{}'
  throw new Error(`Unsupported local prop default: ${expression.getText()}`)
}
const staticSlots = (component, file) => {
  const names = new Set()
  const visitScript = (node) => {
    if (
      ts.isCallExpression(node) &&
      node.expression.getText() === 'defineSlots'
    ) {
      for (const member of node.typeArguments?.[0]?.members ?? [])
        if (member.name) names.add(keyOf(member.name))
    }
    ts.forEachChild(node, visitScript)
  }
  visitScript(file)
  const vue = readFileSync(
    resolve(root, `packages/components/${component}/src/${component}.vue`),
    'utf8',
  )
  const visitTemplate = (node) => {
    if (node.tag === 'slot') {
      const name = node.props.find(
        (prop) =>
          prop.name === 'name' ||
          (prop.name === 'bind' && prop.arg?.content === 'name'),
      )
      if (!name) names.add('default')
      else if (name.type === 6) names.add(name.value.content)
    }
    for (const child of node.children ?? []) visitTemplate(child)
  }
  visitTemplate(parse(vue).descriptor.template.ast)
  if (component === 'table') {
    const column = source('packages/components/table/src/table-column.vue')
    const visitColumn = (node) => {
      if (
        ts.isPropertyAccessExpression(node) &&
        node.expression.getText() === 'slots'
      )
        names.add(`STableColumn.${node.name.text}`)
      ts.forEachChild(node, visitColumn)
    }
    visitColumn(column)
  }
  return [...names]
}

export function auditTableApi({
  readDocumentation = (path) => readFileSync(resolve(root, path), 'utf8'),
} = {}) {
  const tableFile = source('packages/components/table/src/table.ts')
  const tableNodes = declarations(tableFile)
  const tableProps = objectEntries(tableNodes.get('tableProps'), tableNodes)
  const tableEmits = objectEntries(tableNodes.get('tableEmits'), tableNodes)
  const inherited = new Map([
    ['tableProps', tableProps],
    ['tableEmits', tableEmits],
  ])
  const result = []
  for (const component of ['table', 'table-grid', 'table-select']) {
    const prefix = component.replace(/-([a-z])/g, (_, char) =>
      char.toUpperCase(),
    )
    const file = source(`packages/components/${component}/src/${component}.ts`)
    const vue = source(`packages/components/${component}/src/${component}.vue`)
    const nodes = declarations(file)
    const props = objectEntries(nodes.get(`${prefix}Props`), nodes, inherited)
    const emits = objectEntries(nodes.get(`${prefix}Emits`), nodes, inherited)
    const ownEmits = [...emits.keys()].filter(
      (name) => component !== 'table-grid' || !tableEmits.has(name),
    )
    const contract = {
      PROPS: (component === 'table-grid'
        ? ownKeys(nodes.get(`${prefix}Props`))
        : [...props.keys()]
      ).map(kebab),
      EVENTS: ownEmits,
      EXPOSES: exposed(vue),
      SLOTS: staticSlots(component, vue),
      ...(component === 'table'
        ? {
            CHILD_PROPS: [
              ...interfaceKeys(tableFile, 'TableColumnOptions'),
              'key',
            ].map(kebab),
          }
        : {}),
    }
    for (const locale of ['en', 'zh']) {
      const path = `docs/${locale === 'zh' ? 'zh/' : ''}components/${component}.md`
      const text = readDocumentation(path)
      const data = matter(text).data
      const sections = {}
      for (const [section, names] of Object.entries(contract)) {
        const rows = data[section] ?? []
        const documented = rows.map((row) => String(row.name))
        // Vue accepts kebab-case listeners for camelCase emitted event names.
        const normalize = section === 'EVENTS' ? kebab : (name) => name
        const expected = names.map(normalize)
        const present = documented.map(normalize)
        sections[section] = {
          actual: names.length,
          documented: documented.length,
          ...(section === 'SLOTS'
            ? {
                scope:
                  'static declarations only; dynamic forwarded slots reviewed separately',
              }
            : {}),
          missing: names.filter((name) => !present.includes(normalize(name))),
          duplicates: documented.filter(
            (name, index) => present.indexOf(normalize(name)) !== index,
          ),
          extra:
            section === 'SLOTS'
              ? []
              : documented.filter(
                  (name) =>
                    !expected.includes(normalize(name)) &&
                    !(section === 'PROPS' && name === 'v-model'),
                ),
        }
      }
      const defaults = { checked: 0, mismatches: [], unresolved: [] }
      for (const name of contract.PROPS) {
        const [key, member] = [...props].find(([key]) => kebab(key) === name)
        const expected = propDefault(member)
        if (expected === undefined) {
          defaults.unresolved.push(key)
          continue
        }
        defaults.checked++
        const row = data.PROPS?.find((row) => row.name === name)
        const documented = row?.default ?? null
        if (String(documented) !== String(expected))
          defaults.mismatches.push({ name, expected, documented })
      }
      const declaredExposes =
        component === 'table-select'
          ? null
          : interfaceKeys(
              file,
              component === 'table' ? 'TableExposes' : 'TableGridExposes',
            )
      const exposeTypeMismatch = declaredExposes
        ? [...new Set([...declaredExposes, ...contract.EXPOSES])].filter(
            (name) =>
              declaredExposes.includes(name) !==
              contract.EXPOSES.includes(name),
          )
        : []
      const signatures =
        component === 'table-select'
          ? null
          : interfaceSignatures(
              file,
              component === 'table' ? 'TableExposes' : 'TableGridExposes',
            )
      const exposeSignatures = {
        checked: signatures?.size ?? 0,
        mismatches: [],
      }
      for (const [name, expected] of signatures ?? []) {
        const row = data.EXPOSES?.find((row) => row.name === name)
        const documented = documentedSignature(row?.type ?? '')
        if (JSON.stringify(expected) !== JSON.stringify(documented))
          exposeSignatures.mismatches.push({ name, expected, documented })
      }
      result.push({
        component,
        locale,
        sections,
        defaults,
        exposeTypeMismatch,
        exposeSignatures,
        inheritedTableLink:
          component !== 'table-grid' || text.includes('./table.md'),
      })
    }
  }
  return result
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const result = auditTableApi()
  const json = `${JSON.stringify(result, null, 2)}\n`
  if (process.argv[2]) writeFileSync(process.argv[2], json)
  else process.stdout.write(json)
  if (
    result.some(
      (page) =>
        !page.inheritedTableLink ||
        page.defaults.mismatches.length ||
        page.exposeTypeMismatch.length ||
        page.exposeSignatures.mismatches.length ||
        Object.values(page.sections).some(
          (section) =>
            section.missing.length ||
            section.duplicates.length ||
            section.extra.length,
        ),
    )
  )
    process.exitCode = 1
}
