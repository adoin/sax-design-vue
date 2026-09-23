import { highlightTypeScriptSegments } from './highlightVueSource'

const codeSelector = [
  'div.language-typescript > pre > code',
  'div.language-tsx > pre > code',
].join(', ')

/** Restore highlighted fence nodes when VuePress production hydration flattens them. */
export const restoreTypeScriptFenceHighlight = (root: ParentNode) => {
  root.querySelectorAll<HTMLElement>(codeSelector).forEach((code) => {
    if (code.querySelector('.token')) return

    const source = code.textContent
    if (!source) return

    const language = code.classList.contains('language-tsx')
      ? 'tsx'
      : 'typescript'
    const fragment = document.createDocumentFragment()
    let line = document.createElement('span')
    line.className = 'line'
    fragment.append(line)

    highlightTypeScriptSegments(source, language).forEach(
      ({ classes, text }) => {
        text.split(/(\r?\n)/).forEach((part) => {
          if (!part) return
          if (part === '\n' || part === '\r\n') {
            fragment.append(document.createTextNode(part))
            line = document.createElement('span')
            line.className = 'line'
            fragment.append(line)
          } else if (classes.length) {
            const token = document.createElement('span')
            token.className = classes.join(' ')
            token.textContent = part
            line.append(token)
          } else {
            line.append(document.createTextNode(part))
          }
        })
      },
    )

    code.replaceChildren(fragment)
  })
}
