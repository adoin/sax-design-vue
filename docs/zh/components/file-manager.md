---
description: '带目录树、面包屑、虚拟图标网格与列表的文件管理器。'
PROPS:
  - name: 'v-model'
    type: 'FileManagerEntry[]'
    description: '文件与目录记录；根目录的 parentId 为 null。'
    usage: '#explorer'
    default: []
  - name: 'v-model:directory-id'
    type: 'FileManagerId | null'
    description: '当前打开目录的 ID；null 为根目录。'
    usage: '#explorer'
    default: null
  - name: 'v-model:selected-ids'
    type: 'FileManagerId[]'
    description: '当前选择的稳定 ID。'
    usage: '#explorer'
    default: []
  - name: 'v-model:view'
    type: 'FileManagerView'
    description: '图标网格或列表视图。'
    usage: '#explorer'
    default: 'grid'
  - name: 'v-model:tile-size'
    type: 'Number'
    description: '图标宽度，限制在 88–280 px；Shift + 滚轮可调整。'
    usage: '#explorer'
    default: 144
  - name: 'height'
    type: 'String | Number'
    description: '整个管理器高度。'
    usage: '#explorer'
    default: 560
  - name: 'tree-width'
    type: 'Number'
    description: '左侧树宽度，最小 140 px。'
    usage: '#explorer'
    default: 216
  - name: 'show-tree'
    type: 'Boolean'
    description: '显示目录树。'
    usage: '#explorer'
    default: true
  - name: 'root-label'
    type: 'String'
    description: '根目录名称，省略时使用语言包。'
    usage: '#explorer'
  - name: 'behavior'
    type: 'FileManagerBehavior'
    description: '覆盖全局 fileManager.behavior 中对应的操作习惯。'
    usage: '#explorer'
  - name: 'preview-renderers'
    type: 'FileManagerPreviewRenderer[]'
    description: '按数组顺序匹配文件后缀、MIME 或自定义条件。'
    usage: '#explorer'
    default: []
  - name: 'context-menu'
    type: 'false | FileManagerMenuItem[] | ((context: FileManagerContext) => FileManagerMenuItem[])'
    description: '关闭或替换默认右键菜单；自定义条目通过 menu-select 响应。'
    usage: '#explorer'
  - name: 'before-operation'
    type: '(operation: FileManagerOperation, context: FileManagerContext, nextEntries: readonly FileManagerEntry[]) => boolean | void | Promise<boolean | void>'
    description: '执行数据变更前的异步钩子；false 取消，抛错触发 operation-error。'
    usage: '#explorer'
  - name: 'create-id'
    type: '() => FileManagerId'
    description: '新建和复制时分配唯一 ID；默认使用 crypto.randomUUID。'
    usage: '#explorer'
  - name: 'shape'
    type: 'ComponentShape'
    description: '外形，继承 ConfigProvider 或安装配置。'
    usage: '#shape'
    default: 'rounded'
EVENTS:
  - name: 'selection-change'
    type: '(entries: FileManagerEntry[]) => void'
    description: '选择变化。'
    usage: '#explorer'
  - name: 'navigate'
    type: '(id: FileManagerId | null) => void'
    description: '打开目录。'
    usage: '#explorer'
  - name: 'open'
    type: '(entry: FileManagerEntry) => void'
    description: '打开文件，由业务负责预览或下载。'
    usage: '#explorer'
  - name: 'operation'
    type: '(operation: FileManagerOperation, entries: FileManagerEntry[]) => void'
    description: '成功的数据操作与完整新数组。'
    usage: '#explorer'
  - name: 'operation-error'
    type: '(error: unknown, operation: FileManagerOperation) => void'
    description: '验证或异步持久化失败。'
    usage: '#explorer'
  - name: 'menu-select'
    type: '(item: FileManagerMenuItem, context: FileManagerContext) => void'
    description: '右键菜单点击；action 字段可执行内置操作。'
    usage: '#explorer'
  - name: 'refresh'
    type: '(id: FileManagerId | null) => void'
    description: '请求业务重新拉取当前目录。'
    usage: '#explorer'
SLOTS:
  - name: 'folder-preview'
    type: '(context: FileManagerPreviewContext)'
    description: '文件夹封面，例如四图拼贴。'
    usage: '#explorer'
  - name: 'toolbar'
    type: '(context: { directory: FileManagerEntry | null; selection: FileManagerEntry[]; pending: boolean })'
    description: '上传或业务操作等工具栏扩展。'
    usage: '#explorer'
  - name: 'status'
    type: '(context: { count: number; selected: number })'
    description: '底部项目与选择计数。'
    usage: '#explorer'
EXPOSES:
  - name: 'navigate'
    type: '(id: FileManagerId | null) => void'
    description: '打开目录。'
    usage: '#explorer'
  - name: 'execute'
    type: '(operation: FileManagerOperation) => Promise<boolean>'
    description: '通过统一校验与异步钩子执行变更。'
    usage: '#explorer'
  - name: 'select'
    type: '(ids: FileManagerId[]) => void'
    description: '改变选择。'
    usage: '#explorer'
  - name: 'rename'
    type: '(entry: FileManagerEntry) => void'
    description: '进入名称编辑。'
    usage: '#explorer'
  - name: 'scroll-to'
    type: '(id: FileManagerId) => Promise<void>'
    description: '滚动到当前目录内的项目。'
    usage: '#explorer'
---

# File Manager（文件管理）

<card>

## 资源浏览器

双击进入文件夹。单击选择，Ctrl / ⌘ + 单击复选，Shift + 单击范围选择。可拖到目录卡片、目录树或面包屑移动；Shift + 滚轮缩放图标。点击工具栏打开 10,000 个文件，在图标和列表间切换。右键菜单根据当前数据生成，“查看信息”演示自定义操作。

<template #example><file-manager-zh-explorer /></template>

<template #template>

@[code{97-142}](../../.vuepress/components/file-manager-zh/explorer.vue)

</template>

<template #script>

@[code{1-95}](../../.vuepress/components/file-manager-zh/explorer.vue)

</template>

<template #style>

@[code{144-187}](../../.vuepress/components/file-manager-zh/explorer.vue)

</template>

</card>

<card>

## 数据与操作

`v-model` 使用扁平 `FileManagerEntry[]`。每个记录需要唯一 `id`、`parentId`、`name` 和 `kind`（`folder` / `file`）。根目录用 `parentId: null`；目录关系必须无环且父级必须是文件夹。ID 不随名称和位置改变。`size` 为字节，`modifiedAt` 支持日期字符串或时间戳，`data` 可保存业务元数据。

所有入口都调用同一套操作校验；目标目录不能是自身或子目录，同级名称不区分大小写且必须唯一。`permissions` 可分别拒绝 `rename`、`delete`、`move`、`copy`、`create`，`disabled` 完全禁用项目。父目录操作也检查整个子树的权限。

`beforeOperation(operation, context, nextEntries)` 可调用接口、检查权限或弹出删除确认；第三个参数包含待提交的新数组及新建记录的 ID。返回 `false` 取消，拒绝 Promise 或抛错触发 `operation-error`；只有成功后才发出新数组和 `operation`。等待时阻止重复变更，期间数据替换或目录切换会使旧请求失效。组件不上传文件、不管理磁盘或回收站，也不会自动下载或预览文件。通过 `toolbar` 接入 Upload，监听 `open` 处理文件打开，监听 `refresh` 拉取数据。

复制／剪切缓冲区只属于当前管理器实例；跨应用、跨实例与系统文件拖入不在内置移动范围。复制遇到重名会拒绝，不会静默覆盖；业务可通过自定义菜单提供自己的冲突处理流程。

</card>

<card>

## 文件预览

`folder-preview` 为目录提供插槽，上例按 `parentId` 查找四张图片组成封面。文件使用 `previewRenderers`，按数组顺序选择首个匹配项；每项可设置 `extensions`（忽略大小写与开头的点）、`mimeTypes`（支持 `image/*`）、`match(entry)` 和 `render(context)`。通过 Vue 的 `h()` 返回节点，避免根据任意扩展名创建插槽。渲染器接收 `entry`、`view`、`selected`、`size`。未匹配时使用 `thumbnail`，否则显示文件类型。图片加载、媒体播放器或复杂预览需由渲染器自行处理；不要把不可信文本作为 HTML。

</card>

<card>

## 操作习惯与全局配置

通过 `SConfigProvider.fileManager` 或安装选项的 `fileManager` 配置全局 `behavior`、`view`、`tileSize`，组件属性优先；`behavior` 按字段合并。下例可关闭拖放、滚轮缩放或 Delete 快捷键。只读条目的权限仍独立生效。

<template #example><file-manager-zh-behavior /></template>

<template #template>

@[code{20-33}](../../.vuepress/components/file-manager-zh/behavior.vue)

</template>

<template #script>

@[code{1-18}](../../.vuepress/components/file-manager-zh/behavior.vue)

</template>

<template #style>

@[code{35-48}](../../.vuepress/components/file-manager-zh/behavior.vue)

</template>

</card>

<card>

## 键盘与虚拟滚动

| 配置项         | 默认值         | 行为                                            |
| -------------- | -------------- | ----------------------------------------------- |
| `multiple`     | `true`         | 允许多选                                        |
| `rangeSelect`  | `true`         | Shift + 单击／方向键范围选择                    |
| `toggleSelect` | `true`         | Ctrl / ⌘ + 单击切换选择                         |
| `keyboard`     | `true`         | 启用区域内快捷键                                |
| `deleteKey`    | `true`         | Delete 删除；可用钩子确认                       |
| `renameKey`    | `true`         | F2 重命名，Enter 保存，Escape 取消              |
| `clipboard`    | `true`         | Ctrl / ⌘ + X、C、V 剪切、复制、粘贴             |
| `dragDrop`     | `true`         | 目录卡片、树、面包屑可作为目标                  |
| `wheelZoom`    | `true`         | Shift + 滚轮调整图标，Ctrl + 滚轮保留浏览器缩放 |
| `openOn`       | `double-click` | 可改为 click 单击打开                           |
| `foldersFirst` | `true`         | 排序时目录在前                                  |
| `typeahead`    | `true`         | 输入名称前缀快速定位                            |
| `showHidden`   | `false`        | 显示以点开头的文件与目录                        |

空格切换焦点项选择，输入名称前缀快速定位。方向键移动焦点与选择，Ctrl / ⌘ + 方向键只移动焦点。Home / End 与 PageUp / PageDown 定位，Enter 打开，Ctrl / ⌘ + A 全选，Ctrl / ⌘ + Shift + N 新建文件夹，F5 请求刷新，Alt + ↑ 返回上级，Alt + ← / → 浏览历史。菜单键或 Shift + F10 打开右键菜单。输入框保留自身编辑快捷键。

图标网格根据实际容器宽度与 tileSize 计算列数，把每一排交给 SVirtualList。缩放或改变容器宽度后按稳定项目 ID 恢复顶部锚点；选择不依赖 DOM，离屏项目仍能参与范围选择。目录树只渲染展开的虚拟行。预览使用统一图标框，复杂内容应限制在框内。数组索引、过滤与排序仍在内存进行；超大远程数据应由业务加载并替换当前数据。

</card>

<card>

## 外形

圆角与方形使用相同的交互。外形会传给内部输入框、按钮与浮层。

<template #example><file-manager-zh-shape /></template>

<template #template>

@[code{9-34}](../../.vuepress/components/file-manager-zh/shape.vue)

</template>

<template #script>

@[code{1-7}](../../.vuepress/components/file-manager-zh/shape.vue)

</template>

<template #style>

@[code{36-47}](../../.vuepress/components/file-manager-zh/shape.vue)

</template>

</card>
