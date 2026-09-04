/** Compare rendered bounds in viewport pixels, including ancestor scaling. */
export function tableFocusVisible(cell: HTMLElement, viewport: HTMLElement) {
  const window = viewport.getBoundingClientRect()
  const target = cell.getBoundingClientRect()
  // No layout is available in a detached/hidden tree (or a DOM-only renderer).
  // Native focus still decides whether the element can actually receive focus.
  if (!window.height || !target.height) return undefined
  const scale = viewport.offsetHeight
    ? window.height / viewport.offsetHeight
    : 1
  const top = window.top + viewport.clientTop * scale
  const height = viewport.clientHeight * scale
  if (height <= 0) return false
  const bottom = top + height
  return target.height > height
    ? target.top <= top + 1 && target.bottom >= bottom - 1
    : target.top >= top - 1 && target.bottom <= bottom + 1
}
