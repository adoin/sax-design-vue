import Prism from 'prismjs'
import 'prismjs/components/prism-markup.js'
import 'prismjs/components/prism-css.js'
import 'prismjs/components/prism-clike.js'
import 'prismjs/components/prism-javascript.js'
import 'prismjs/components/prism-typescript.js'
import 'prismjs/components/prism-jsx.js'
import 'prismjs/components/prism-tsx.js'
import 'prismjs/components/prism-scss.js'

export interface SourceHighlightSegment {
  classes: string[]
  text: string
}

type PrismTokenContent = Prism.TokenStream | Prism.Token

interface SourceSection {
  language: string
  source: string
}

const variableDeclaration = {
  pattern: /(\b(?:const|let|var)\s+)[A-Za-z_$][\w$]*/,
  lookbehind: true,
  alias: 'variable',
}

const typeReference = [
  {
    pattern:
      /(\b(?:as|extends|implements|satisfies)\s+|=>[ \t]*)[A-Z_$][\w$]*(?=[ \t]*(?:<|\[|[>,|&)=;?:{}.]|=>|\r?$))/m,
    lookbehind: true,
    alias: 'class-name',
  },
  {
    pattern: /(:\s*)[A-Z_$][\w$]*(?=[ \t]*(?:<|\[|[>,|&)=;?:{}.]|=>|\r?$))/m,
    lookbehind: true,
    alias: 'class-name',
  },
  {
    pattern:
      /([<|&]\s*)[A-Z_$][\w$]*(?=[ \t]*(?:<|\[|[>,|&)=;?:{}.]|=>|\r?$))/m,
    lookbehind: true,
    alias: 'class-name',
  },
  {
    pattern: /(,\s*)[A-Z_$][\w$]*(?=[ \t]*(?:<|\[|[>,|&)=;?{}.]|=>|\r?$))/m,
    lookbehind: true,
    alias: 'class-name',
  },
]

const typeImport = {
  pattern: /(\bimport\s+type\s*{\s*)[A-Z_$][\w$]*(?=\s*(?:,|}))/,
  lookbehind: true,
  alias: 'class-name',
}

const tsxGenericArrow = {
  pattern:
    /<(?=(?:const\s+)?[A-Z_$][\w$]*\b)(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
  greedy: true,
  alias: ['generic', 'class-name'],
  inside: {
    'type-reference': {
      pattern: /\b[A-Z_$][\w$]*\b/,
      alias: 'class-name',
    },
    keyword: /\b(?:const|extends|in|keyof|out)\b/,
    builtin:
      /\b(?:any|bigint|boolean|never|number|object|string|symbol|unknown)\b/,
    operator: /[&|?=:]/,
    punctuation: /[<>{}[\](),.]/,
  },
}

const ensureVariableDeclarationTokens = () => {
  for (const language of ['javascript', 'typescript']) {
    if (!Prism.languages[language]?.['variable-declaration'])
      Prism.languages.insertBefore(language, 'keyword', {
        'variable-declaration': variableDeclaration,
      })
  }
}

const ensureTypeReferenceTokens = () => {
  for (const language of ['typescript', 'tsx']) {
    if (!Prism.languages[language]?.['type-import'])
      Prism.languages.insertBefore(language, 'class-name', {
        'type-import': typeImport,
        'type-reference': typeReference,
      })
  }

  if (!Prism.languages.tsx?.['generic-arrow'])
    Prism.languages.insertBefore('tsx', 'tag', {
      'generic-arrow': tsxGenericArrow,
    })
}

const ensureSourceHighlightTokens = () => {
  ensureVariableDeclarationTokens()
  ensureTypeReferenceTokens()
}

ensureSourceHighlightTokens()

const languageForBlock = (tag: string, openingTag: string) => {
  const lang = openingTag.match(/\blang\s*=\s*["']([^"']+)["']/i)?.[1]
  if (tag === 'script') {
    if (lang === 'tsx') return 'tsx'
    if (lang === 'jsx') return 'jsx'
    return lang === 'ts' || lang === 'typescript' ? 'typescript' : 'javascript'
  }
  if (tag === 'style') return lang === 'scss' ? 'scss' : 'css'
  return 'markup'
}

const vueSourceSections = (source: string) => {
  const sections: SourceSection[] = []
  const blockPattern = /<(template|script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi
  let offset = 0

  for (const match of source.matchAll(blockPattern)) {
    const index = match.index ?? 0
    if (index > offset)
      sections.push({ language: 'markup', source: source.slice(offset, index) })

    const block = match[0]
    const tag = match[1].toLowerCase()
    const openingEnd = block.indexOf('>') + 1
    const closingStart = block.toLowerCase().lastIndexOf(`</${tag}`)
    const openingTag = block.slice(0, openingEnd)
    const content = block.slice(openingEnd, closingStart)
    const closingTag = block.slice(closingStart)

    sections.push({ language: 'markup', source: openingTag })
    if (content)
      sections.push({
        language: languageForBlock(tag, openingTag),
        source: content,
      })
    sections.push({ language: 'markup', source: closingTag })
    offset = index + block.length
  }

  if (offset < source.length)
    sections.push({ language: 'markup', source: source.slice(offset) })
  return sections.length ? sections : [{ language: 'markup', source }]
}

const grammarFor = (language: string) => {
  ensureSourceHighlightTokens()
  return Prism.languages[language] ?? Prism.languages.markup
}

const tokenClasses = (token: Prism.Token) => {
  const aliases = Array.isArray(token.alias)
    ? token.alias
    : token.alias
      ? [token.alias]
      : []

  return ['token', token.type, ...aliases]
}

const appendSegments = (
  content: PrismTokenContent,
  parentClasses: string[],
  segments: SourceHighlightSegment[],
) => {
  const values = Array.isArray(content) ? content : [content]

  values.forEach((value) => {
    if (typeof value === 'string') {
      segments.push({ classes: parentClasses, text: value })
      return
    }

    appendSegments(
      value.content,
      [...parentClasses, ...tokenClasses(value)],
      segments,
    )
  })
}

export const highlightVueSource = (source: string) => {
  const segments: SourceHighlightSegment[] = []
  vueSourceSections(source).forEach(({ language, source: section }) =>
    appendSegments(Prism.tokenize(section, grammarFor(language)), [], segments),
  )
  return segments
}

/** VuePress fence highlighter with language-aware SFC blocks. */
export const highlightVueSfcHtml = (source: string) =>
  vueSourceSections(source)
    .map(({ language, source: section }) =>
      Prism.highlight(section, grammarFor(language), language),
    )
    .join('')

export const highlightTypeScriptHtml = (
  source: string,
  language: 'typescript' | 'tsx',
) => Prism.highlight(source, grammarFor(language), language)

export const highlightTypeScriptSegments = (
  source: string,
  language: 'typescript' | 'tsx',
) => {
  const segments: SourceHighlightSegment[] = []
  appendSegments(Prism.tokenize(source, grammarFor(language)), [], segments)
  return segments
}
