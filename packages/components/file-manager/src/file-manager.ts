import { buildProps, definePropType } from '@vuesax-alpha/utils'
import { componentShapes } from '@vuesax-alpha/constants'
import type {
  FileManagerBehavior,
  FileManagerContext,
  FileManagerEntry,
  FileManagerIcons,
  FileManagerId,
  FileManagerMenuItem,
  FileManagerPreviewRenderer,
  FileManagerProps,
  FileManagerSort,
  FileManagerSortOption,
  FileManagerThumbnails,
} from './types'

export const fileManagerProps = buildProps({
  modelValue: {
    type: definePropType<FileManagerEntry[]>(Array),
    default: undefined,
  },
  directoryId: {
    type: definePropType<FileManagerId | null>([String, Number]),
    default: undefined,
  },
  selectedIds: {
    type: definePropType<FileManagerId[]>(Array),
    default: undefined,
  },
  view: { type: String, values: ['grid', 'list'], default: undefined },
  tileSize: { type: Number, default: undefined },
  height: { type: [String, Number], default: 560 },
  treeWidth: { type: Number, default: 216 },
  showTree: { type: Boolean, default: true },
  rootLabel: { type: String, default: undefined },
  treeShowFiles: { type: Boolean, default: undefined },
  showHidden: { type: Boolean, default: undefined },
  sort: { type: definePropType<FileManagerSort>(Object), default: undefined },
  sortOptions: {
    type: definePropType<FileManagerSortOption[]>(Array),
    default: undefined,
  },
  icons: { type: definePropType<FileManagerIcons>(Object), default: undefined },
  thumbnails: {
    type: definePropType<FileManagerThumbnails>(Object),
    default: undefined,
  },
  behavior: {
    type: definePropType<FileManagerBehavior>(Object),
    default: undefined,
  },
  previewRenderers: {
    type: definePropType<FileManagerPreviewRenderer[]>(Array),
    default: () => [],
  },
  contextMenu: {
    type: definePropType<
      | false
      | FileManagerMenuItem[]
      | ((context: FileManagerContext) => FileManagerMenuItem[])
    >([Boolean, Array, Function]),
    default: undefined,
  },
  beforeOperation: {
    type: definePropType<NonNullable<FileManagerProps['beforeOperation']>>(
      Function,
    ),
    default: undefined,
  },
  createId: {
    type: definePropType<() => FileManagerId>(Function),
    default: undefined,
  },
  shape: { type: String, values: componentShapes, default: undefined },
} as const)
