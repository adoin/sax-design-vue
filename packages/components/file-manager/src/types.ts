import type { VNodeChild } from 'vue'
import type { ComponentShape } from '@vuesax-alpha/constants'
import type { ContextMenuItem } from '../../context-menu'

export type FileManagerId = string | number
export type FileManagerView = 'grid' | 'list'
export type FileManagerAction =
  | 'open'
  | 'rename'
  | 'delete'
  | 'cut'
  | 'copy'
  | 'paste'
  | 'new-folder'
  | 'select-all'
  | 'refresh'
  | 'hide'
  | 'unhide'
export interface FileManagerEntry {
  id: FileManagerId
  parentId: FileManagerId | null
  name: string
  kind: 'folder' | 'file'
  extension?: string
  mimeType?: string
  size?: number
  modifiedAt?: string | number
  thumbnail?: string
  disabled?: boolean
  /** Omit to retain dot-prefixed hidden-file conventions; false explicitly unhides. */
  hidden?: boolean
  /** False denies the operation through every entry point. */
  permissions?: Partial<
    Record<'rename' | 'delete' | 'move' | 'copy' | 'create' | 'hide', boolean>
  >
  data?: unknown
}
export interface FileManagerBehavior {
  multiple?: boolean
  rangeSelect?: boolean
  toggleSelect?: boolean
  keyboard?: boolean
  deleteKey?: boolean
  renameKey?: boolean
  clipboard?: boolean
  dragDrop?: boolean
  /** Shift + wheel changes the tile size; browser Ctrl + wheel stays native. */
  wheelZoom?: boolean
  typeahead?: boolean
  openOn?: 'double-click' | 'click'
  foldersFirst?: boolean
  showHidden?: boolean
}
export interface FileManagerGlobalConfig {
  behavior?: FileManagerBehavior
  view?: FileManagerView
  tileSize?: number
  treeShowFiles?: boolean
  icons?: FileManagerIcons
  thumbnails?: FileManagerThumbnails
  sortOptions?: FileManagerSortOption[]
}
export type FileManagerGraphic = string | { icon?: string; src?: string }
export interface FileManagerIcons {
  back?: FileManagerGraphic
  forward?: FileManagerGraphic
  up?: FileManagerGraphic
  home?: FileManagerGraphic
  folder?: FileManagerGraphic
  folderOpen?: FileManagerGraphic
  file?: FileManagerGraphic
  eye?: FileManagerGraphic
  eyeOff?: FileManagerGraphic
  grid?: FileManagerGraphic
  list?: FileManagerGraphic
}
/** String values are image URLs; object values can use an SIcon name instead. */
export type FileManagerThumbnails = Record<string, FileManagerGraphic>
export interface FileManagerSort {
  key: string
  order: 'ascending' | 'descending'
}
export interface FileManagerSortOption {
  key: string
  label: string
  /** Required for application-defined criteria. Built-in keys are name, modifiedAt and size. */
  compare?: (a: FileManagerEntry, b: FileManagerEntry) => number
}
export interface FileManagerContext {
  entry?: FileManagerEntry
  selection: FileManagerEntry[]
  directory: FileManagerEntry | null
  source: 'content' | 'tree' | 'breadcrumb' | 'keyboard' | 'toolbar'
  /** Available when resolving a custom context-menu function. */
  defaultItems?: FileManagerMenuItem[]
}
export interface FileManagerMenuItem extends ContextMenuItem {
  action?: FileManagerAction
  sort?: FileManagerSort
}
export interface FileManagerOperation {
  type: 'rename' | 'delete' | 'move' | 'copy' | 'new-folder' | 'set-hidden'
  ids: FileManagerId[]
  targetId?: FileManagerId | null
  name?: string
  hidden?: boolean
}
export interface FileManagerPreviewContext {
  entry: FileManagerEntry
  view: FileManagerView
  selected: boolean
  size: number
  renderDefault?: () => VNodeChild
}
export interface FileManagerPreviewRenderer {
  /** Lowercase extensions without dots, matched case-insensitively. */
  extensions?: string[]
  mimeTypes?: string[]
  match?: (entry: FileManagerEntry) => boolean
  render: (context: FileManagerPreviewContext) => VNodeChild
}
export interface FileManagerProps {
  modelValue?: FileManagerEntry[]
  directoryId?: FileManagerId | null
  selectedIds?: FileManagerId[]
  view?: FileManagerView
  tileSize?: number
  height?: string | number
  treeWidth?: number
  showTree?: boolean
  rootLabel?: string
  treeShowFiles?: boolean
  showHidden?: boolean
  sort?: FileManagerSort
  sortOptions?: FileManagerSortOption[]
  icons?: FileManagerIcons
  thumbnails?: FileManagerThumbnails
  behavior?: FileManagerBehavior
  previewRenderers?: FileManagerPreviewRenderer[]
  contextMenu?:
    | false
    | FileManagerMenuItem[]
    | ((context: FileManagerContext) => FileManagerMenuItem[])
  beforeOperation?: (
    operation: FileManagerOperation,
    context: FileManagerContext,
    nextEntries: readonly FileManagerEntry[],
  ) => boolean | void | Promise<boolean | void>
  createId?: () => FileManagerId
  shape?: ComponentShape
}

export interface FileManagerExposes {
  navigate: (id: FileManagerId | null) => void
  execute: (operation: FileManagerOperation) => Promise<boolean>
  select: (ids: FileManagerId[]) => void
  rename: (entry?: FileManagerEntry) => void
  scrollTo: (id: FileManagerId) => Promise<void> | undefined
}
export type FileManagerEmits = {
  'update:modelValue': (entries: FileManagerEntry[]) => void
  'update:directoryId': (id: FileManagerId | null) => void
  'update:selectedIds': (ids: FileManagerId[]) => void
  'update:view': (view: FileManagerView) => void
  'update:tileSize': (size: number) => void
  'update:showHidden': (value: boolean) => void
  'update:sort': (sort: FileManagerSort) => void
  'selection-change': (entries: FileManagerEntry[]) => void
  navigate: (id: FileManagerId | null) => void
  open: (entry: FileManagerEntry) => void
  operation: (
    operation: FileManagerOperation,
    entries: FileManagerEntry[],
  ) => void
  'operation-error': (error: unknown, operation: FileManagerOperation) => void
  'menu-select': (
    item: FileManagerMenuItem,
    context: FileManagerContext,
  ) => void
  refresh: (id: FileManagerId | null) => void
}
export interface FileManagerSlots {
  'folder-preview'?: (context: FileManagerPreviewContext) => VNodeChild
  toolbar?: (context: FileManagerToolbarContext) => VNodeChild
  status?: (context: { count: number; selected: number }) => VNodeChild
}
export interface FileManagerToolbarContext {
  directory: FileManagerEntry | null
  selection: FileManagerEntry[]
  pending: boolean
  search: string
  setSearch: (value: string) => void
  view: FileManagerView
  setView: (view: FileManagerView) => void
  toggleView: () => void
  showHidden: boolean
  setShowHidden: (value: boolean) => void
  sort: FileManagerSort
  sortOptions: FileManagerSortOption[]
  setSort: (sort: FileManagerSort) => void
}
/** Derive the public component from the SFC instead of duplicating Vue's generic contract. */
export type FileManagerComponent = typeof import('./file-manager.vue').default
