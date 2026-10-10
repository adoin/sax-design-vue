export interface AgentCodeToken {
  text: string
  kind?: 'keyword' | 'string' | 'comment' | 'number'
}
// A small, safe lexical highlighter. Consumers can supply a line slot for a
// language-specific highlighter without allowing HTML into the default path.
export const tokenizeAgentCode = (
  code: string,
  language: string,
): AgentCodeToken[][] => {
  const pattern =
    /\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:export|import|from|const|let|var|return|if|else|function|async|await|class|interface|type|new|throw|true|false|null|undefined|def|for|while|in)\b|\b\d+(?:\.\d+)?\b/g
  const tokens: AgentCodeToken[] = []
  let offset = 0
  if (
    [
      'js',
      'jsx',
      'ts',
      'tsx',
      'javascript',
      'typescript',
      'python',
      'json',
    ].includes(language.toLowerCase())
  ) {
    let match: RegExpExecArray | null
    while ((match = pattern.exec(code))) {
      if (match.index > offset)
        tokens.push({ text: code.slice(offset, match.index) })
      const text = match[0]
      tokens.push({
        text,
        kind:
          text.startsWith('//') || text.startsWith('/*')
            ? 'comment'
            : /^["'`]/.test(text)
              ? 'string'
              : /^\d/.test(text)
                ? 'number'
                : 'keyword',
      })
      offset = pattern.lastIndex
    }
  }
  tokens.push({ text: code.slice(offset) })
  const lines: AgentCodeToken[][] = [[]]
  for (const token of tokens) {
    const fragments = token.text.split('\n')
    fragments.forEach((text, index) => {
      if (index) lines.push([])
      lines[lines.length - 1].push({ text, kind: token.kind })
    })
  }
  return lines
}
