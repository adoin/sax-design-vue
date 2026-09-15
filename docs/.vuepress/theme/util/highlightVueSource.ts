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

const ensureVariableDeclarationTokens = () => {
  for (const language of ['javascript', 'typescript']) {
    if (!Prism.languages[language]?.['variable-declaration'])
      Prism.languages.insertBefore(language, 'keyword', {
        'variable-declaration': variableDeclaration,
      })
  }
}

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
  ensureVariableDeclarationTokens()
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
