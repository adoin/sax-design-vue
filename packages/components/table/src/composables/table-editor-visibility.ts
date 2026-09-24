/**
 * Return the smallest scroll-axis delta that reveals a target inside a safe
 * viewport. Positive values move later content toward the start edge.
 */
export function tableEditorRevealDelta(
  targetStart: number,
  targetEnd: number,
  viewportStart: number,
  viewportEnd: number,
  margin = 0,
) {
  const safeStart = viewportStart + Math.max(0, margin)
  const safeEnd = viewportEnd - Math.max(0, margin)
  if (
    !Number.isFinite(targetStart) ||
    !Number.isFinite(targetEnd) ||
    !Number.isFinite(safeStart) ||
    !Number.isFinite(safeEnd) ||
    safeEnd <= safeStart ||
    targetEnd <= targetStart
  )
    return 0

  const targetSize = targetEnd - targetStart
  const viewportSize = safeEnd - safeStart
  if (targetSize > viewportSize) {
    if (targetStart <= safeStart && targetEnd >= safeEnd) return 0
    return targetStart > safeStart
      ? targetStart - safeStart
      : targetEnd - safeEnd
  }
  if (targetStart < safeStart) return targetStart - safeStart
  if (targetEnd > safeEnd) return targetEnd - safeEnd
  return 0
}
