import { computed, nextTick, onBeforeUnmount, shallowRef, watch } from 'vue'
import { useGlobalConfig, useLocale } from '@vuesax-alpha/hooks'
import {
  ancestors,
  applyFileOperation,
  canMoveFiles,
  indexFiles,
  isFileHidden,
  resolveExtension,
  topLevelIds,
} from './file-model'
import type {
  FileManagerAction,
  FileManagerContext,
  FileManagerEntry,
  FileManagerGraphic,
  FileManagerId,
  FileManagerMenuItem,
  FileManagerOperation,
  FileManagerProps,
  FileManagerSort,
  FileManagerSortOption,
  FileManagerToolbarContext,
  FileManagerView,
} from './types'

export function useFileManager(
  props: Readonly<FileManagerProps>,
  emit: (event: string, ...args: any[]) => void,
) {
  const global = useGlobalConfig('fileManager')
  const { t } = useLocale()
  const label = (key: string, values?: Record<string, string | number>) =>
    t(`vs.fileManager.${key}`, values)
  const localFiles = shallowRef<FileManagerEntry[]>([])
  const localDirectory = shallowRef<FileManagerId | null>(null)
  const localSelection = shallowRef<FileManagerId[]>([])
  const localView = shallowRef<FileManagerView>()
  const localTile = shallowRef<number>()
  const files = computed(() => props.modelValue ?? localFiles.value)
  const index = computed(() => indexFiles(files.value))
  const directoryId = computed(() =>
    props.directoryId !== undefined ? props.directoryId : localDirectory.value,
  )
  const directory = computed(() =>
    directoryId.value === null
      ? null
      : (index.value.byId.get(directoryId.value) ?? null),
  )
  const selectedIds = computed(() => props.selectedIds ?? localSelection.value)
  const selection = computed(() =>
    selectedIds.value
      .map((id) => index.value.byId.get(id))
      .filter((entry): entry is FileManagerEntry => !!entry),
  )
  const selectedSet = computed(() => new Set(selectedIds.value))
  const view = computed(
    () => props.view ?? localView.value ?? global.value?.view ?? 'grid',
  )
  const tileSize = computed(() =>
    Math.max(
      88,
      Math.min(
        280,
        props.tileSize ?? localTile.value ?? global.value?.tileSize ?? 144,
      ),
    ),
  )
  const localShowHidden = shallowRef<boolean>()
  const showHidden = computed(
    () =>
      props.showHidden ??
      localShowHidden.value ??
      props.behavior?.showHidden ??
      global.value?.behavior?.showHidden ??
      false,
  )
  const setShowHidden = (value: boolean) => {
    localShowHidden.value = value
    emit('update:showHidden', value)
  }
  const treeShowFiles = computed(
    () => props.treeShowFiles ?? global.value?.treeShowFiles ?? false,
  )
  const icons = computed(() => ({ ...global.value?.icons, ...props.icons }))
  const thumbnails = computed(
    () =>
      new Map(
        Object.entries({
          ...global.value?.thumbnails,
          ...props.thumbnails,
        }).map(([extension, graphic]) => [
          extension.replace(/^\./, '').toLowerCase(),
          graphic,
        ]),
      ),
  )
  const graphicFor = (
    entry: FileManagerEntry,
    opened = false,
  ): FileManagerGraphic | undefined => {
    if (entry.kind === 'folder')
      return opened ? icons.value.folderOpen : icons.value.folder
    if (entry.thumbnail) return { src: entry.thumbnail }
    const configured =
      thumbnails.value.get(resolveExtension(entry)) ?? thumbnails.value.get('*')
    return typeof configured === 'string'
      ? { src: configured }
      : (configured ?? icons.value.file)
  }
  const behavior = computed(() => ({
    multiple: true,
    rangeSelect: true,
    toggleSelect: true,
    keyboard: true,
    deleteKey: true,
    renameKey: true,
    clipboard: true,
    dragDrop: true,
    wheelZoom: true,
    typeahead: true,
    openOn: 'double-click' as 'double-click' | 'click',
    foldersFirst: true,
    ...global.value?.behavior,
    ...props.behavior,
    showHidden: showHidden.value,
  }))
  const localSort = shallowRef<FileManagerSort>({
    key: 'name',
    order: 'ascending',
  })
  const sort = computed<FileManagerSort>(() => {
    const value = props.sort ?? localSort.value
    return sortOptions.value.some((option) => option.key === value.key)
      ? value
      : { ...value, key: sortOptions.value[0]?.key ?? 'name' }
  })
  const sortOptions = computed<FileManagerSortOption[]>(
    () =>
      props.sortOptions ??
      global.value?.sortOptions ?? [
        { key: 'name', label: label('name') },
        { key: 'modifiedAt', label: label('modified') },
        { key: 'size', label: label('size') },
      ],
  )
  const setSort = (value: FileManagerSort) => {
    if (!sortOptions.value.some((option) => option.key === value.key)) return
    localSort.value = { ...value }
    emit('update:sort', { ...value })
  }
  const search = shallowRef('')
  const setSearch = (value: string) => {
    search.value = value
  }
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
  })
  const visible = computed(() => {
    const option = sortOptions.value.find(
      (option) => option.key === sort.value.key,
    )
    return (index.value.children.get(directoryId.value) ?? [])
      .filter(
        (entry) =>
          (showHidden.value || !isFileHidden(entry)) &&
          entry.name
            .toLocaleLowerCase()
            .includes(search.value.toLocaleLowerCase()),
      )
      .slice()
      .sort((a, b) => {
        if (behavior.value.foldersFirst && a.kind !== b.kind)
          return a.kind === 'folder' ? -1 : 1
        const key = option?.key ?? 'name'
        const order = option?.compare
          ? option.compare(a, b)
          : key === 'size'
            ? (a.size ?? 0) - (b.size ?? 0)
            : key === 'modifiedAt'
              ? Number(new Date(a.modifiedAt ?? 0)) -
                Number(new Date(b.modifiedAt ?? 0))
              : collator.compare(a.name, b.name)
        return (
          ((Number.isFinite(order) ? order : 0) ||
            collator.compare(a.name, b.name)) *
          (sort.value.order === 'descending' ? -1 : 1)
        )
      })
  })
  const path = computed(() => ancestors(index.value, directoryId.value))
  const focusedId = shallowRef<FileManagerId>()
  const anchorId = shallowRef<FileManagerId>()
  const expanded = shallowRef(new Set<FileManagerId>())
  const history = shallowRef<(FileManagerId | null)[]>([directoryId.value])
  const historyIndex = shallowRef(0)
  const editingId = shallowRef<FileManagerId>()
  const draft = shallowRef('')
  const pending = shallowRef(false)
  const error = shallowRef('')
  const clipboard = shallowRef<{ ids: FileManagerId[]; cut: boolean }>()
  const draggedIds = shallowRef<FileManagerId[]>([])
  const dropTarget = shallowRef<FileManagerId | null | undefined>()
  let disposed = false
  let revision = 0
  const setSelection = (ids: FileManagerId[]) => {
    const next = [...new Set(ids)].filter((id) => {
      const item = index.value.byId.get(id)
      return item && !item.disabled
    })
    localSelection.value = next
    emit('update:selectedIds', next)
    emit(
      'selection-change',
      next.map((id) => index.value.byId.get(id)!),
    )
  }
  const setView = (value: FileManagerView) => {
    localView.value = value
    emit('update:view', value)
  }
  const setTileSize = (value: number) => {
    const size = Math.round(Math.max(88, Math.min(280, value)))
    localTile.value = size
    emit('update:tileSize', size)
  }
  const navigate = (id: FileManagerId | null, record = true) => {
    if (
      id !== null &&
      (!index.value.byId.has(id) ||
        index.value.byId.get(id)!.kind !== 'folder' ||
        index.value.byId.get(id)!.disabled)
    )
      return
    if (directoryId.value === id) return
    if (record) {
      history.value = [...history.value.slice(0, historyIndex.value + 1), id]
      historyIndex.value = history.value.length - 1
    }
    localDirectory.value = id
    emit('update:directoryId', id)
    emit('navigate', id)
  }
  const goHistory = (delta: number) => {
    let i = historyIndex.value + delta
    while (i >= 0 && i < history.value.length) {
      const id = history.value[i]
      if (id === null || index.value.byId.has(id)) {
        historyIndex.value = i
        navigate(id, false)
        return
      }
      i += delta
    }
  }
  watch(
    directoryId,
    () => {
      revision++
      if (history.value[historyIndex.value] !== directoryId.value) {
        history.value = [
          ...history.value.slice(0, historyIndex.value + 1),
          directoryId.value,
        ]
        historyIndex.value = history.value.length - 1
      }
      search.value = ''
      editingId.value = undefined
      focusedId.value = undefined
      anchorId.value = undefined
      setSelection([])
      expanded.value = new Set([
        ...expanded.value,
        ...path.value.map((entry) => entry.id),
      ])
    },
    { immediate: true },
  )
  watch(files, () => {
    revision++
    if (focusedId.value !== undefined && !index.value.byId.has(focusedId.value))
      focusedId.value = undefined
    if (selectedIds.value.some((id) => !index.value.byId.has(id)))
      setSelection(selectedIds.value.filter((id) => index.value.byId.has(id)))
    if (directoryId.value !== null && !index.value.byId.has(directoryId.value))
      navigate(null)
  })
  watch([showHidden, files], () => {
    if (!showHidden.value) {
      const hidden = path.value.find((entry) => isFileHidden(entry))
      if (hidden) navigate(hidden.parentId)
    }
    const allowed = new Set(visible.value.map((entry) => entry.id))
    if (selectedIds.value.some((id) => !allowed.has(id)))
      setSelection(selectedIds.value.filter((id) => allowed.has(id)))
  })
  const context = (
    entry?: FileManagerEntry,
    source: FileManagerContext['source'] = 'content',
  ): FileManagerContext => ({
    entry,
    selection: selection.value,
    directory: directory.value,
    source,
  })
  const select = (
    entry: FileManagerEntry,
    event: Pick<MouseEvent, 'shiftKey' | 'ctrlKey' | 'metaKey'>,
  ) => {
    if (entry.disabled) return
    focusedId.value = entry.id
    const toggle =
      behavior.value.multiple &&
      behavior.value.toggleSelect &&
      (event.ctrlKey || event.metaKey)
    if (
      behavior.value.multiple &&
      behavior.value.rangeSelect &&
      event.shiftKey &&
      anchorId.value !== undefined
    ) {
      const from = visible.value.findIndex((item) => item.id === anchorId.value)
      const to = visible.value.indexOf(entry)
      if (from >= 0 && to >= 0) {
        const ids = visible.value
          .slice(Math.min(from, to), Math.max(from, to) + 1)
          .map((item) => item.id)
        setSelection(toggle ? [...selectedIds.value, ...ids] : ids)
        return
      }
    }
    setSelection(
      toggle
        ? selectedSet.value.has(entry.id)
          ? selectedIds.value.filter((id) => id !== entry.id)
          : [...selectedIds.value, entry.id]
        : [entry.id],
    )
    anchorId.value = entry.id
  }
  const open = (entry: FileManagerEntry) => {
    if (entry.disabled) return
    if (entry.kind === 'folder') navigate(entry.id)
    else emit('open', entry)
  }
  const operate = async (operation: FileManagerOperation, ctx = context()) => {
    if (pending.value) return false
    pending.value = true
    error.value = ''
    const started = revision
    const snapshot = files.value
    const records = snapshot.map((entry) => ({ ...entry }))
    const permissions = snapshot.map((entry) =>
      JSON.stringify(entry.permissions),
    )
    try {
      // Validate before persistence and reject stale data before committing.
      const idFactory =
        props.createId ??
        (() =>
          globalThis.crypto?.randomUUID?.() ??
          `file-${Date.now()}-${Math.random().toString(36).slice(2)}`)
      const next = applyFileOperation(snapshot, operation, idFactory)
      if (
        (await props.beforeOperation?.(operation, ctx, next)) === false ||
        disposed
      )
        return false
      if (
        revision !== started ||
        files.value !== snapshot ||
        files.value.length !== records.length ||
        records.some((before, i) => {
          const current = files.value[i]
          return (
            Object.keys(current).length !== Object.keys(before).length ||
            Object.entries(before).some(
              ([key, value]) =>
                current[key as keyof FileManagerEntry] !== value,
            ) ||
            JSON.stringify(current.permissions) !== permissions[i]
          )
        })
      )
        throw new Error('Directory data changed; retry the operation')
      localFiles.value = next
      emit('update:modelValue', next)
      emit('operation', operation, next)
      if (operation.type === 'delete') setSelection([])
      if (operation.type === 'move' && clipboard.value?.cut)
        clipboard.value = undefined
      return true
    } catch (cause) {
      error.value = label('operationFailed')
      emit('operation-error', cause, operation)
      return false
    } finally {
      if (!disposed) pending.value = false
    }
  }
  const rename = (entry?: FileManagerEntry) => {
    if (
      !entry ||
      entry.disabled ||
      entry.permissions?.rename === false ||
      pending.value
    )
      return
    editingId.value = entry.id
    draft.value = entry.name
    error.value = ''
  }
  const commitRename = async () => {
    const id = editingId.value
    if (id === undefined || pending.value) return
    if (draft.value === index.value.byId.get(id)?.name) {
      editingId.value = undefined
      return
    }
    if (await operate({ type: 'rename', ids: [id], name: draft.value }))
      editingId.value = undefined
  }
  const actions = async (action: FileManagerAction, ctx = context()) => {
    if (pending.value) return
    const chosen = ctx.selection.length
      ? ctx.selection
      : ctx.entry
        ? [ctx.entry]
        : []
    const ids = chosen.map((entry) => entry.id)
    if (action === 'open' && chosen.length === 1) open(chosen[0])
    if (action === 'rename' && chosen.length === 1) {
      if (chosen[0].parentId !== directoryId.value) {
        navigate(chosen[0].parentId)
        await nextTick()
      }
      rename(chosen[0])
    }
    if (action === 'delete') await operate({ type: 'delete', ids }, ctx)
    if (action === 'hide' || action === 'unhide')
      await operate({ type: 'set-hidden', ids, hidden: action === 'hide' }, ctx)
    if (
      (action === 'cut' || action === 'copy') &&
      behavior.value.clipboard &&
      ids.length
    )
      clipboard.value = {
        ids: topLevelIds(index.value, ids),
        cut: action === 'cut',
      }
    if (action === 'paste' && clipboard.value && behavior.value.clipboard)
      await operate(
        {
          type: clipboard.value.cut ? 'move' : 'copy',
          ids: clipboard.value.ids,
          targetId:
            ctx.entry?.kind === 'folder' ? ctx.entry.id : directoryId.value,
        },
        ctx,
      )
    if (action === 'select-all')
      setSelection(
        behavior.value.multiple
          ? visible.value.map((entry) => entry.id)
          : visible.value.slice(0, 1).map((entry) => entry.id),
      )
    if (action === 'refresh') emit('refresh', directoryId.value)
    if (action === 'new-folder') {
      const targetId =
        ctx.entry?.kind === 'folder' ? ctx.entry.id : directoryId.value
      const names = new Set(
        (index.value.children.get(targetId) ?? []).map((entry) =>
          entry.name.toLocaleLowerCase(),
        ),
      )
      let name = label('newFolder'),
        n = 2
      while (names.has(name.toLocaleLowerCase()))
        name = `${label('newFolder')} (${n++})`
      if (await operate({ type: 'new-folder', ids: [], targetId, name }, ctx)) {
        const created = localFiles.value[localFiles.value.length - 1]
        if (created && created.parentId === directoryId.value) {
          setSelection([created.id])
          rename(created)
        }
      }
    }
  }
  const menuContext = shallowRef<FileManagerContext>(context())
  const defaultMenu = (ctx: FileManagerContext): FileManagerMenuItem[] => {
    const chosen = ctx.selection
    const item = (
      action: FileManagerAction,
      disabled = false,
      divided = false,
    ): FileManagerMenuItem => ({
      action,
      value: action,
      label: label(action),
      disabled: pending.value || disabled,
      divided,
    })
    if (!ctx.entry && ctx.source === 'content')
      return [
        ...sortOptions.value.map((option) => ({
          value: `sort:${option.key}`,
          label: `${label('sortBy', { name: option.label })}${sort.value.key === option.key ? ' ✓' : ''}`,
          sort: { key: option.key, order: sort.value.order },
        })),
        ...(sortOptions.value.length
          ? (['ascending', 'descending'] as const)
          : []
        ).map((order, i) => ({
          value: `sort-order:${order}`,
          label: `${label(order)}${sort.value.order === order ? ' ✓' : ''}`,
          sort: { key: sort.value.key, order },
          divided: i === 0,
        })),
        item('paste', !clipboard.value || !behavior.value.clipboard, true),
        item('new-folder'),
        item('select-all'),
        item('refresh'),
      ]
    return [
      item('open', chosen.length !== 1),
      item(
        'cut',
        !chosen.length ||
          !behavior.value.clipboard ||
          chosen.some((entry) => entry.permissions?.move === false),
      ),
      item(
        'copy',
        !chosen.length ||
          !behavior.value.clipboard ||
          chosen.some((entry) => entry.permissions?.copy === false),
      ),
      item('paste', !clipboard.value || !behavior.value.clipboard),
      item(
        'rename',
        chosen.length !== 1 || chosen[0]?.permissions?.rename === false,
        true,
      ),
      item(
        'delete',
        !chosen.length ||
          chosen.some((entry) => entry.permissions?.delete === false),
      ),
      item(
        chosen.length && chosen.every(isFileHidden) ? 'unhide' : 'hide',
        !chosen.length ||
          chosen.some((entry) => entry.permissions?.hide === false),
      ),
      item('new-folder', false, true),
      item('select-all'),
      item('refresh'),
    ]
  }
  const menuItems = computed<FileManagerMenuItem[]>(() => {
    if (props.contextMenu === false) return []
    const defaults = defaultMenu(menuContext.value)
    if (typeof props.contextMenu === 'function')
      return props.contextMenu({ ...menuContext.value, defaultItems: defaults })
    return props.contextMenu ?? defaults
  })
  const toggleView = () => setView(view.value === 'grid' ? 'list' : 'grid')
  const toolbar = computed<FileManagerToolbarContext>(() => ({
    directory: directory.value,
    selection: selection.value,
    pending: pending.value,
    search: search.value,
    setSearch,
    view: view.value,
    setView,
    toggleView,
    showHidden: showHidden.value,
    setShowHidden,
    sort: sort.value,
    sortOptions: sortOptions.value,
    setSort,
  }))
  let dropCacheIndex: typeof index.value | undefined
  let dropCacheIds: FileManagerId[] | undefined
  const dropCache = new Map<FileManagerId | null, boolean>()
  const canDrop = (targetId: FileManagerId | null, ids = draggedIds.value) => {
    if (!behavior.value.dragDrop || !ids.length || pending.value) return false
    if (dropCacheIndex !== index.value || dropCacheIds !== ids) {
      dropCache.clear()
      dropCacheIndex = index.value
      dropCacheIds = ids
    }
    const cached = dropCache.get(targetId)
    if (cached !== undefined) return cached
    const valid = canMoveFiles(index.value, ids, targetId)
    dropCache.set(targetId, valid)
    return valid
  }
  const drop = async (targetId: FileManagerId | null) => {
    if (!canDrop(targetId)) return
    const ids = draggedIds.value
    draggedIds.value = []
    dropTarget.value = undefined
    await operate({ type: 'move', ids, targetId })
  }
  onBeforeUnmount(() => {
    disposed = true
  })
  return {
    label,
    files,
    index,
    directoryId,
    directory,
    selectedIds,
    selection,
    selectedSet,
    view,
    tileSize,
    behavior,
    visible,
    path,
    sort,
    sortOptions,
    setSort,
    toolbar,
    showHidden,
    setShowHidden,
    icons,
    graphicFor,
    treeShowFiles,
    toggleView,
    setSearch,
    search,
    focusedId,
    anchorId,
    expanded,
    history,
    historyIndex,
    editingId,
    draft,
    pending,
    error,
    clipboard,
    draggedIds,
    dropTarget,
    menuContext,
    menuItems,
    setSelection,
    setView,
    setTileSize,
    navigate,
    goHistory,
    select,
    open,
    operate,
    rename,
    commitRename,
    actions,
    context,
    canDrop,
    drop,
  }
}
export type FileManagerState = ReturnType<typeof useFileManager>
