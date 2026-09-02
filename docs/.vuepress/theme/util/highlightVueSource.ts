import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'

export interface SourceHighlightSegment {
  classes: string[]
  text: string
}

type PrismTokenContent = Prism.TokenStream | Prism.Token

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
  appendSegments(Prism.tokenize(source, Prism.languages.markup), [], segments)
  return segments
}
