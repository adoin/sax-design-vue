export const normalizeUploadAccept = (accept?: string | string[]) =>
  (Array.isArray(accept) ? accept : accept?.split(',') || [])
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean)

export const matchesUploadAccept = (file: File, accept?: string | string[]) => {
  const rules = normalizeUploadAccept(accept)
  if (!rules.length) return true

  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return rules.some((rule) => {
    if (rule.startsWith('.')) return name.endsWith(rule)
    if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1))
    return type === rule
  })
}
