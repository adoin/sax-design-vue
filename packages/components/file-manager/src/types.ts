import type {
  ComponentOptionsMixin,
  DefineComponent,
  PublicProps,
  SlotsType,
  VNodeChild,
} from 'vue'
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
  /** False denies the operation through every entry point. */
  permissions?: Partial<
    Record<'rename' | 'delete' | 'move' | 'copy' | 'create', boolean>
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
}
export interface FileManagerContext {
  entry?: FileManagerEntry
  selection: FileManagerEntry[]
  directory: FileManagerEntry | null
  source: 'content' | 'tree' | 'breadcrumb' | 'keyboard' | 'toolbar'
}
export interface FileManagerMenuItem extends ContextMenuItem {
  action?: FileManagerAction
}
export interface FileManagerOperation {
  type: 'rename' | 'delete' | 'move' | 'copy' | 'new-folder'
  ids: FileManagerId[]
  targetId?: FileManagerId | null
  name?: string
}
export interface FileManagerPreviewContext {
  entry: FileManagerEntry
  view: FileManagerView
  selected: boolean
  size: number
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
  toolbar?: (context: {
    directory: FileManagerEntry | null
    selection: FileManagerEntry[]
    pending: boolean
  }) => VNodeChild
  status?: (context: { count: number; selected: number }) => VNodeChild
}
/** Keep the public component declaration independent from private child component inference. */
export type FileManagerComponent = DefineComponent<
  FileManagerProps,
  FileManagerExposes,
  Record<never, never>,
  Record<never, never>,
  Record<never, never>,
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  FileManagerEmits,
  string,
  PublicProps,
  FileManagerProps,
  Record<never, never>,
  SlotsType<FileManagerSlots>
>
