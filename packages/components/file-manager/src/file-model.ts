import type {
  FileManagerEntry,
  FileManagerId,
  FileManagerOperation,
} from './types'

export function indexFiles(entries: FileManagerEntry[]) {
  const byId = new Map<FileManagerId, FileManagerEntry>()
  const children = new Map<FileManagerId | null, FileManagerEntry[]>()
  for (const entry of entries) {
    if (byId.has(entry.id)) throw new Error(`Duplicate file ID: ${entry.id}`)
    byId.set(entry.id, entry)
    const group = children.get(entry.parentId) ?? []
    group.push(entry)
    children.set(entry.parentId, group)
  }
  return { byId, children }
}
export type FileManagerIndex = ReturnType<typeof indexFiles>

export function ancestors(index: FileManagerIndex, id: FileManagerId | null) {
  const path: FileManagerEntry[] = []
  const seen = new Set<FileManagerId>()
  while (id !== null && !seen.has(id)) {
    seen.add(id)
    const entry = index.byId.get(id)
    if (!entry) break
    path.unshift(entry)
    id = entry.parentId
  }
  return path
}

export function topLevelIds(index: FileManagerIndex, ids: FileManagerId[]) {
  const selected = new Set(ids)
  return [...selected].filter(
    (id) =>
      index.byId.has(id) &&
      !ancestors(index, index.byId.get(id)!.parentId).some((entry) =>
        selected.has(entry.id),
      ),
  )
}

export function descendantIds(index: FileManagerIndex, ids: FileManagerId[]) {
  const result = new Set<FileManagerId>()
  const stack = [...ids]
  while (stack.length) {
    const id = stack.pop()!
    if (result.has(id)) continue
    result.add(id)
    for (const child of index.children.get(id) ?? []) stack.push(child.id)
  }
  return result
}

export function validName(name: string) {
  return (
    !!name.trim() &&
    !/[\\/:*?"<>|]/.test(name) &&
    !Array.from(name).some((char) => char.charCodeAt(0) < 32) &&
    !/^(\.|\.\.)$/.test(name.trim())
  )
}

/** Validate drag hover using the existing index, without cloning the full file array. */
export function canMoveFiles(
  index: FileManagerIndex,
  ids: FileManagerId[],
  target: FileManagerId | null,
) {
  if (!ids.length || ids.some((id) => !index.byId.has(id))) return false
  const destination = target === null ? undefined : index.byId.get(target)
  if (
    target !== null &&
    (!destination ||
      destination.kind !== 'folder' ||
      destination.disabled ||
      destination.permissions?.create === false)
  )
    return false
  const roots = topLevelIds(index, ids)
  const subtree = descendantIds(index, roots)
  if (target !== null && subtree.has(target)) return false
  for (const id of subtree) {
    const entry = index.byId.get(id)!
    if (entry.disabled || entry.permissions?.move === false) return false
  }
  const occupied = new Set(
    (index.children.get(target) ?? []).map((entry) =>
      entry.name.toLocaleLowerCase(),
    ),
  )
  for (const id of roots) {
    const entry = index.byId.get(id)!
    const name = entry.name.toLocaleLowerCase()
    if (entry.parentId === target || occupied.has(name)) return false
    occupied.add(name)
  }
  return true
}

/** Pure, atomic mutation planner. Input records are never changed. */
export function applyFileOperation(
  entries: FileManagerEntry[],
  operation: FileManagerOperation,
  createId: () => FileManagerId,
) {
  const index = indexFiles(entries)
  const ids = topLevelIds(index, operation.ids)
  const selected = ids.map((id) => index.byId.get(id)!)
  const target = operation.targetId ?? null
  const assert = (condition: boolean, message: string) => {
    if (!condition) throw new Error(message)
  }
  const permitted = (
    entry: FileManagerEntry,
    permission: 'rename' | 'delete' | 'move' | 'copy' | 'create' | 'hide',
  ) => !entry.disabled && entry.permissions?.[permission] !== false
  const checkTarget = () =>
    assert(
      target === null ||
        (!!index.byId.get(target) &&
          index.byId.get(target)!.kind === 'folder' &&
          permitted(index.byId.get(target)!, 'create')),
      'Invalid or read-only destination',
    )
  const checkName = (
    name: string,
    parentId: FileManagerId | null,
    exclude?: FileManagerId,
  ) => {
    assert(validName(name), 'Invalid name')
    assert(
      !(index.children.get(parentId) ?? []).some(
        (entry) =>
          entry.id !== exclude &&
          entry.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
      ),
      'A file with this name already exists',
    )
  }
  const allocate = () => {
    const id = createId()
    assert(!index.byId.has(id), 'Generated file ID already exists')
    index.byId.set(id, { id } as FileManagerEntry)
    return id
  }
  if (operation.type === 'new-folder') {
    checkTarget()
    const name = operation.name?.trim() ?? ''
    checkName(name, target)
    return [
      ...entries,
      { id: allocate(), parentId: target, kind: 'folder' as const, name },
    ]
  }
  assert(
    selected.length > 0 && operation.ids.every((id) => index.byId.has(id)),
    'No valid selection',
  )
  if (operation.type === 'rename') {
    assert(
      selected.length === 1 && permitted(selected[0], 'rename'),
      'Rename denied',
    )
    const name = operation.name?.trim() ?? ''
    checkName(name, selected[0].parentId, selected[0].id)
    return entries.map((entry) =>
      entry.id === selected[0].id
        ? { ...entry, name, extension: undefined }
        : entry,
    )
  }
  if (operation.type === 'set-hidden') {
    assert(typeof operation.hidden === 'boolean', 'Hidden state is required')
    for (const entry of selected)
      assert(permitted(entry, 'hide'), 'Hide denied')
    const changed = new Set(ids)
    return entries.map((entry) =>
      changed.has(entry.id) ? { ...entry, hidden: operation.hidden } : entry,
    )
  }
  const subtree = descendantIds(index, ids)
  for (const id of subtree)
    assert(
      permitted(
        index.byId.get(id)!,
        operation.type === 'delete'
          ? 'delete'
          : operation.type === 'copy'
            ? 'copy'
            : 'move',
      ),
      'Operation denied',
    )
  if (operation.type === 'delete')
    return entries.filter((entry) => !subtree.has(entry.id))
  checkTarget()
  assert(
    target === null || !subtree.has(target),
    'A folder cannot contain itself',
  )
  const names = new Set<string>()
  for (const entry of selected) {
    if (operation.type === 'move')
      assert(entry.parentId !== target, 'Already in destination')
    checkName(entry.name, target)
    const name = entry.name.toLocaleLowerCase()
    assert(!names.has(name), 'Duplicate destination name')
    names.add(name)
  }
  if (operation.type === 'move') {
    const moved = new Set(ids)
    return entries.map((entry) =>
      moved.has(entry.id) ? { ...entry, parentId: target } : entry,
    )
  }
  const copies = new Map([...subtree].map((id) => [id, allocate()]))
  return [
    ...entries,
    ...entries
      .filter((entry) => subtree.has(entry.id))
      .map((entry) => ({
        ...entry,
        id: copies.get(entry.id)!,
        parentId: copies.get(entry.parentId!) ?? target,
      })),
  ]
}

export function resolveExtension(entry: FileManagerEntry) {
  return (
    entry.extension ??
    (entry.name.includes('.')
      ? entry.name.slice(entry.name.lastIndexOf('.') + 1)
      : '')
  )
    .replace(/^\./, '')
    .toLowerCase()
}

export function isFileHidden(entry: FileManagerEntry) {
  return entry.hidden ?? entry.name.startsWith('.')
}

export function gridColumns(width: number, size: number, gap = 12) {
  return Math.max(1, Math.floor((Math.max(0, width) + gap) / (size + gap)))
}
