---
description: 'File manager with a folder tree, breadcrumbs, virtual icon grid and list view.'
PROPS:
  - name: 'v-model'
    type: 'FileManagerEntry[]'
    description: 'Files and directories; root entries have parentId null.'
    usage: '#explorer'
    default: []
  - name: 'v-model:directory-id'
    type: 'FileManagerId | null'
    description: 'Open directory ID; null means root.'
    usage: '#explorer'
    default: null
  - name: 'v-model:selected-ids'
    type: 'FileManagerId[]'
    description: 'Selected stable IDs.'
    usage: '#explorer'
    default: []
  - name: 'v-model:view'
    type: 'FileManagerView'
    description: 'Icon grid or list view.'
    usage: '#explorer'
    default: 'grid'
  - name: 'v-model:tile-size'
    type: 'Number'
    description: 'Tile width clamped to 88–280 px; adjustable with Shift + wheel.'
    usage: '#explorer'
    default: 144
  - name: 'v-model:show-hidden'
    type: 'Boolean'
    description: 'Show hidden entries; toggle with the upper-left eye.'
    usage: '#search-and-toolbar'
    default: false
  - name: 'v-model:sort'
    type: 'FileManagerSort'
    description: 'Current sort criterion and direction.'
    usage: '#search-and-toolbar'
  - name: 'sort-options'
    type: 'FileManagerSortOption[]'
    description: 'Sort criteria with optional custom comparators.'
    usage: '#search-and-toolbar'
  - name: 'tree-show-files'
    type: 'Boolean'
    description: 'Include files in the tree.'
    usage: '#search-and-toolbar'
    default: false
  - name: 'icons'
    type: 'FileManagerIcons'
    description: 'Customize Home, folder states, files and toolbar icons.'
    usage: '#search-and-toolbar'
  - name: 'thumbnails'
    type: 'FileManagerThumbnails'
    description: 'Map extensions to image URLs or icon configurations.'
    usage: '#search-and-toolbar'
  - name: 'height'
    type: 'String | Number'
    description: 'Overall manager height.'
    usage: '#explorer'
    default: 560
  - name: 'tree-width'
    type: 'Number'
    description: 'Tree width with a 140 px minimum.'
    usage: '#explorer'
    default: 216
  - name: 'show-tree'
    type: 'Boolean'
    description: 'Show the folder tree.'
    usage: '#explorer'
    default: true
  - name: 'root-label'
    type: 'String'
    description: 'Accessible name and tooltip for Home; localized when omitted.'
    usage: '#explorer'
  - name: 'behavior'
    type: 'FileManagerBehavior'
    description: 'Override matching global fileManager.behavior options.'
    usage: '#explorer'
  - name: 'preview-renderers'
    type: 'FileManagerPreviewRenderer[]'
    description: 'First matching extension, MIME or predicate renderer wins.'
    usage: '#explorer'
    default: []
  - name: 'context-menu'
    type: 'false | FileManagerMenuItem[] | ((context: FileManagerContext) => FileManagerMenuItem[])'
    description: 'Disable or replace the default menu; custom items emit menu-select.'
    usage: '#explorer'
  - name: 'before-operation'
    type: '(operation: FileManagerOperation, context: FileManagerContext, nextEntries: readonly FileManagerEntry[]) => boolean | void | Promise<boolean | void>'
    description: 'Async mutation guard; false cancels, throwing emits operation-error.'
    usage: '#explorer'
  - name: 'create-id'
    type: '() => FileManagerId'
    description: 'Unique ID factory for creation/copy; defaults to crypto.randomUUID.'
    usage: '#explorer'
  - name: 'shape'
    type: 'ComponentShape'
    description: 'Geometry inherited from ConfigProvider or installation options.'
    usage: '#shape'
    default: 'rounded'
EVENTS:
  - name: 'selection-change'
    type: '(entries: FileManagerEntry[]) => void'
    description: 'Selection changed.'
    usage: '#explorer'
  - name: 'navigate'
    type: '(id: FileManagerId | null) => void'
    description: 'Directory navigation.'
    usage: '#explorer'
  - name: 'open'
    type: '(entry: FileManagerEntry) => void'
    description: 'Open a file; the application handles preview/download.'
    usage: '#explorer'
  - name: 'operation'
    type: '(operation: FileManagerOperation, entries: FileManagerEntry[]) => void'
    description: 'Successful mutation and the complete next array.'
    usage: '#explorer'
  - name: 'operation-error'
    type: '(error: unknown, operation: FileManagerOperation) => void'
    description: 'Validation or async persistence failure.'
    usage: '#explorer'
  - name: 'menu-select'
    type: '(item: FileManagerMenuItem, context: FileManagerContext) => void'
    description: 'Menu selection; action invokes a built-in command.'
    usage: '#explorer'
  - name: 'refresh'
    type: '(id: FileManagerId | null) => void'
    description: 'Request that the application reload the directory.'
    usage: '#explorer'
SLOTS:
  - name: 'folder-preview'
    type: '(context: FileManagerPreviewContext)'
    description: 'Folder cover, such as a four-image collage.'
    usage: '#explorer'
  - name: 'toolbar'
    type: '(context: FileManagerToolbarContext)'
    description: 'Replace the whole row using search and view state and update hooks.'
    usage: '#explorer'
  - name: 'status'
    type: '(context: { count: number; selected: number })'
    description: 'Footer item/selection counts.'
    usage: '#explorer'
EXPOSES:
  - name: 'navigate'
    type: '(id: FileManagerId | null) => void'
    description: 'Open a directory.'
    usage: '#explorer'
  - name: 'execute'
    type: '(operation: FileManagerOperation) => Promise<boolean>'
    description: 'Execute through shared validation and async guards.'
    usage: '#explorer'
  - name: 'select'
    type: '(ids: FileManagerId[]) => void'
    description: 'Change selection.'
    usage: '#explorer'
  - name: 'rename'
    type: '(entry: FileManagerEntry) => void'
    description: 'Start inline renaming.'
    usage: '#explorer'
  - name: 'scroll-to'
    type: '(id: FileManagerId) => Promise<void>'
    description: 'Reveal an entry in the current directory.'
    usage: '#explorer'
---

# File Manager

<card>

## Explorer

Double-click folders to open them. Click to select, Ctrl / ⌘ + click to toggle, and Shift + click to select a range. Drop onto folders, the tree or breadcrumbs to move entries; Shift + wheel resizes icons. Open 10,000 files from the toolbar and switch between icons and list view. The data-driven context menu includes a custom Information action.

<template #example><file-manager-explorer /></template>

<template #template>

@[code{133-171}](../.vuepress/components/file-manager/explorer.vue)

</template>

<template #script>

@[code{1-131}](../.vuepress/components/file-manager/explorer.vue)

</template>

<template #style>

@[code{173-211}](../.vuepress/components/file-manager/explorer.vue)

</template>

</card>

<card>

## Search and toolbar

The toolbar contains name search and one view toggle. Search matches file and folder names in the current directory. Right-click blank content space to sort. Configure criteria with `sortOptions` and optional `compare(a, b)`. Bind `v-model:sort` to `{ key, order }`, with `ascending` or `descending` order. Name ascending is the default; `behavior.foldersFirst` controls folder grouping.

The `toolbar` slot replaces the whole row. It exposes `search` / `setSearch`, `view` / `setView` / `toggleView`, plus `directory`, `selection`, `pending`, `showHidden` / `setShowHidden`, `sort` / `setSort` and `sortOptions`.

<template #example><file-manager-toolbar /></template>

<template #template>

@[code{10-26}](../.vuepress/components/file-manager/toolbar.vue)

</template>

<template #script>

@[code{1-9}](../.vuepress/components/file-manager/toolbar.vue)

</template>

</card>

<card>

## Data and operations

`v-model` is a flat `FileManagerEntry[]`. Each record needs a unique `id`, `parentId`, `name` and `kind` (`folder` / `file`). Root entries use `parentId: null`. Parent links must be acyclic and point to folders. IDs remain stable across renames and moves. `size` is in bytes, `modifiedAt` accepts a date string or timestamp, and `data` holds application metadata.

All entry points share validation. A destination cannot be the source or its descendant; sibling names must be unique, case-insensitively. `permissions` can deny `rename`, `delete`, `move`, `copy` and `create` independently; `disabled` disables the entry. Subtree operations also check descendant permissions.

Use `beforeOperation(operation, context, nextEntries)` for persistence, authorization or deletion confirmation. The third argument contains the proposed array, including IDs allocated for new records. Return `false` to cancel; throw or reject to emit `operation-error`. Only successful operations emit the next array and `operation`. Concurrent mutations are blocked; data replacement or navigation invalidates pending requests. The component does not manage disks, upload files, implement a recycle bin or open/download files itself. Add Upload through `toolbar`, handle `open`, and reload application data on `refresh`.

Copy/cut buffers belong to one manager instance; cross-instance/application and OS-file drops are not internal moves. Name conflicts are rejected without overwriting; applications can expose custom menu actions for their own conflict workflows.

</card>

<card>

## File previews

`folder-preview` customizes directory covers; the example finds four child thumbnails by parentId. Files use `previewRenderers`, selecting the first matching rule in array order. A rule can specify `extensions` (case-insensitive, optional leading dot), `mimeTypes` (including image/*), `match(entry)` and `render(context)`. Return Vue nodes with h() instead of adding a slot for every extension. Context contains entry, view, selected and size. Unmatched files use configured thumbnails or a generic file icon. Renderers own media loading and complex preview behavior; never interpret untrusted text as HTML.

Root navigation uses Home. Customize `icons.home`; `rootLabel` supplies its accessible name and tooltip. `icons.folder` / `folderOpen` distinguish folder states. Enable `treeShowFiles` to include files in the tree. `thumbnails` matches extensions case-insensitively, ignoring a leading dot. Strings are SVG/PNG image URLs; `{ icon: "lo-home" }` uses a registered icon and `{ src: "/file.svg" }` uses an image. Precedence is entry `thumbnail`, extension mapping, `*`, then the generic file icon. Both panes share these rules. Call `renderDefault()` in the folder slot to reuse its glyph.

Files and folders accept `hidden: true`. Omitted values fall back to dot-prefixed names; explicit `hidden: false` overrides this. The upper-left eye toggles both panes. Hide/unhide actions issue `set-hidden` operations, respecting `permissions.hide` and `beforeOperation`. Custom menus can compose `context.defaultItems` to keep built-in actions.

</card>

<card>

## Behavior and global configuration

Set global behavior, view, tileSize, treeShowFiles, icons, thumbnails and sortOptions through SConfigProvider.fileManager or the fileManager installation option. Local props win; behavior merges per field. Toggle drag/drop, wheel zoom and the Delete shortcut below. Entry permissions remain independent.

<template #example><file-manager-behavior /></template>

<template #template>

@[code{20-33}](../.vuepress/components/file-manager/behavior.vue)

</template>

<template #script>

@[code{1-18}](../.vuepress/components/file-manager/behavior.vue)

</template>

<template #style>

@[code{35-48}](../.vuepress/components/file-manager/behavior.vue)

</template>

</card>

<card>

## Keyboard and virtualization

| Option         | Default        | Behavior                                                     |
| -------------- | -------------- | ------------------------------------------------------------ |
| `multiple`     | `true`         | Allow multiple selection                                     |
| `rangeSelect`  | `true`         | Shift + click/arrows selects a range                         |
| `toggleSelect` | `true`         | Ctrl / ⌘ + click toggles selection                           |
| `keyboard`     | `true`         | Enable scoped keyboard shortcuts                             |
| `deleteKey`    | `true`         | Delete removes entries; guard it for confirmation            |
| `renameKey`    | `true`         | F2 renames, Enter saves, Escape cancels                      |
| `clipboard`    | `true`         | Ctrl / ⌘ + X/C/V cuts, copies and pastes                     |
| `dragDrop`     | `true`         | Folder tiles, tree and breadcrumbs are drop targets          |
| `wheelZoom`    | `true`         | Shift + wheel changes tiles; Ctrl + wheel keeps browser zoom |
| `openOn`       | `double-click` | Set click for single-click opening                           |
| `foldersFirst` | `true`         | Sort folders before files                                    |
| `typeahead`    | `true`         | Type a name prefix to focus a matching file                  |
| `showHidden`   | `false`        | Show dot-prefixed files and folders                          |

Space toggles the focused entry and typing a name prefix locates a match. Arrow keys move focus and selection; Ctrl / ⌘ + arrows moves focus only. Home / End and PageUp / PageDown navigate, Enter opens, Ctrl / ⌘ + A selects all, Ctrl / ⌘ + Shift + N creates a folder, F5 requests refresh, Alt + Up opens the parent, and Alt + Left / Right browses history. ContextMenu or Shift + F10 opens the menu. Inputs retain their editing shortcuts.

The icon grid derives columns from container width and tileSize, then virtualizes rows with SVirtualList. Resizing or zooming restores the top entry by stable ID. Selection is independent of mounted DOM, including off-screen range selection. The tree virtualizes expanded rows. Previews use a fixed tile frame; constrain custom content to that frame. Indexing, filtering and sorting still happen in memory; applications should load and replace data for very large remote sources.

</card>

<card>

## Shape

Rounded and square geometry share the same interactions and propagate to internal controls and floating panels.

<template #example><file-manager-shape /></template>

<template #template>

@[code{9-34}](../.vuepress/components/file-manager/shape.vue)

</template>

<template #script>

@[code{1-7}](../.vuepress/components/file-manager/shape.vue)

</template>

<template #style>

@[code{36-47}](../.vuepress/components/file-manager/shape.vue)

</template>

</card>
