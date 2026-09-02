---
PROPS:
  - name: model-value
    type: File | File[] | null
    values: 已选文件
    description: 通过 v-model 控制已选文件集合。
    default: null
    usage: '#完整流程'
  - name: shape
    type: String
    values: rounded | square
    description: 为上传区、文件队列和操作入口统一设置圆角或方形外观。
    default: rounded
    usage: '#外形'
  - name: drag
    type: Boolean
    values: true | false
    description: 是否接收拖放到上传区的文件。
    default: 'true'
    usage: '#完整流程'
  - name: list-type
    type: String
    values: auto | list | card
    description: 使用紧凑列表或图片卡片展示队列；auto 在图片模式下自动使用卡片。
    default: auto
    usage: '#图片队列'
  - name: preview-fit
    type: String
    values: cover | contain
    description: 控制图片预览在卡片中的适配方式。
    default: cover
    usage: '#图片队列'
  - name: mode
    type: String
    values: all | image
    description: 限制为图片选择，并参与自动队列形态判断。
    default: all
    usage: '#图片队列'
  - name: multiple
    type: Boolean
    values: true | false
    description: 是否允许选择和拖放多个文件。
    default: 'false'
    usage: '#完整流程'
  - name: single-upload
    type: Boolean
    values: true | false
    description: 每次加入有效文件时替换当前队列。
    default: 'false'
    usage: '#完整流程'
  - name: accept
    type: String
    values: MIME 类型或扩展名列表
    description: 同时约束原生选择器和拖放文件的类型。
    default: null
    usage: '#自定义触发区'
  - name: file-types
    type: String[]
    values: MIME 类型或扩展名列表
    description: 未设置 accept 时使用的文件类型规则。
    default: '[]'
    usage: '#图片队列'
  - name: limit
    type: Number | String
    values: 正数
    description: 限制队列最多保留的文件数量。
    default: null
    usage: '#完整流程'
  - name: limit-count
    type: Number | String
    values: 正数
    description: limit 的兼容别名。
    default: null
    usage: '#完整流程'
  - name: limit-size
    type: Number | String
    values: MB
    description: 拒绝超过指定大小的单个文件。
    default: null
    usage: '#完整流程'
  - name: automatic
    type: Boolean
    values: true | false
    description: 文件通过校验后立即开始上传。
    default: 'false'
    usage: '#自动上传'
  - name: auto-submit
    type: Boolean
    values: true | false
    description: automatic 的兼容别名。
    default: 'false'
    usage: '#自动上传'
  - name: action
    type: String
    values: URL
    description: 内置 XMLHttpRequest 适配器使用的 POST 地址。
    default: null
    usage: '#自动上传'
  - name: upload-method
    type: Function
    values: ({ file, option, updateProgress }) => Promise
    description: 替换内置请求，并可通过 updateProgress 回报进度。
    default: null
    usage: '#完整流程'
  - name: file-name
    type: String
    values: 表单字段名
    description: 设置内置 multipart 请求中的文件字段名。
    default: file
    usage: '#自动上传'
  - name: headers
    type: Object
    values: Record<string, string>
    description: 为内置上传请求增加请求头。
    default: null
    usage: '#自动上传'
  - name: data
    type: Object
    values: Record<string, string>
    description: 为内置 multipart 请求增加数据字段。
    default: null
    usage: '#自动上传'
  - name: before-select-method
    type: Function
    values: ({ file }) => boolean | Promise<boolean>
    description: 文件进入队列前执行应用级校验。
    default: null
    usage: '#完整流程'
  - name: before-remove-method
    type: Function
    values: ({ option }) => boolean | Promise<boolean>
    description: 拦截队列文件的移除操作。
    default: null
    usage: '#完整流程'
  - name: text
    type: String
    values: 文本
    description: 设置上传区主标题。
    default: 上传文件
    usage: '#完整流程'
  - name: text-max
    type: String
    values: 文本
    description: 达到文件数量上限后替换上传区标题。
    default: null
    usage: '#完整流程'
  - name: button-text
    type: String
    values: 文本
    description: 优先级高于 text 的兼容标题属性。
    default: null
    usage: '#完整流程'
  - name: show-tip
    type: Boolean
    values: true | false
    description: 是否在组件下方展示辅助说明。
    default: 'false'
    usage: '#完整流程'
  - name: tip-text
    type: String
    values: 文本
    description: 设置内置辅助说明。
    default: null
    usage: '#完整流程'
  - name: show-list
    type: Boolean
    values: true | false
    description: 是否展示已选文件队列。
    default: 'true'
    usage: '#完整流程'
  - name: show-preview
    type: Boolean
    values: true | false
    description: 是否为图片文件展示预览。
    default: 'true'
    usage: '#图片队列'
  - name: show-progress
    type: Boolean
    values: true | false
    description: 是否展示单文件和整体上传进度。
    default: 'true'
    usage: '#自动上传'
  - name: show-retry
    type: Boolean
    values: true | false
    description: 是否为上传失败的文件展示重试入口。
    default: 'true'
    usage: '#自动上传'
  - name: show-remove-button
    type: Boolean
    values: true | false
    description: 是否展示队列项的移除入口。
    default: 'true'
    usage: '#完整流程'
  - name: show-upload-button
    type: Boolean
    values: true | false
    description: 是否展示手动上传队列的操作入口。
    default: 'true'
    usage: '#完整流程'
  - name: show-submit-button
    type: Boolean
    values: true | false
    description: 是否展示手动上传队列的操作入口。
    default: 'true'
    usage: '#完整流程'
  - name: show-button-icon
    type: Boolean
    values: true | false
    description: 是否展示手动上传操作中的图标。
    default: 'true'
    usage: '#完整流程'
  - name: show-button-text
    type: Boolean
    values: true | false
    description: 是否展示手动上传操作中的文字。
    default: 'true'
    usage: '#完整流程'
  - name: readonly
    type: Boolean
    values: true | false
    description: 只展示文件，隐藏选择、移除、重试和上传操作。
    default: 'false'
    usage: '#完整流程'
  - name: disabled
    type: Boolean
    values: true | false
    description: 禁用文件选择和拖放。
    default: 'false'
    usage: '#完整流程'
EVENTS:
  - name: update:modelValue
    params: File | File[] | null
    description: 添加、移除或清空后同步受控文件值。
  - name: change
    params: selectedFiles, currentFiles
    description: 一次选择或拖放处理完成后触发。
  - name: add
    params: fileItem, fileItems
    description: 每个文件加入队列时触发。
  - name: remove
    params: fileItem, fileItems
    description: 文件从队列移除后触发。
  - name: reject
    params: file, reason, error
    description: 文件因类型、大小、数量或业务校验被拒绝时触发。
  - name: exceed
    params: files, currentFileItems
    description: 一次选择超过文件数量限制时触发。
  - name: progress
    params: fileItem, percent
    description: 上传进度变化时触发，进度会规范到 0 至 100。
  - name: retry
    params: fileItem
    description: 重试单个失败文件前触发。
  - name: upload-start
    params: fileItem
    description: 单个文件开始上传时触发。
  - name: upload-success
    params: fileItem, response
    description: 单个文件上传成功时触发。
  - name: upload-error
    params: fileItem, error
    description: 单个文件上传失败时触发。
  - name: upload-end
    params: fileItem
    description: 单个文件上传结束时触发。
  - name: upload-queue-start
    params: fileItems
    description: 手动或自动批次开始前触发。
  - name: upload-queue-end
    params: fileItems
    description: 批次中的所有文件结束后触发。
  - name: on-delete
    params: File
    description: 文件移除后的兼容事件。
  - name: on-success
    params: response
    description: 上传成功后的兼容事件。
  - name: on-error
    params: error
    description: 校验或上传失败后的兼容事件。
SLOTS:
  - name: trigger
    description: 替换上传区内容，提供 choose、dragging 和 disabled。
  - name: tip
    description: 替换上传流程下方的辅助说明。
EXPOSES:
  - name: choose
    description: 打开原生文件选择器。
  - name: submit
    description: 上传所有等待中或失败的队列项。
  - name: clear
    description: 清空文件队列并同步 v-model。
  - name: remove
    description: 通过索引或队列项引用移除文件。
  - name: retry
    description: 重试单个失败文件。
  - name: getPendingFiles
    description: 返回尚未上传成功的原始文件。
description: '提供可访问的文件选择、拖放、校验、预览、进度与可重试上传队列。'
NEWS:
  - default
  - promise
  - multiple
  - automatic
---

# Upload（上传）

<card>

## 完整流程

默认上传区同时支持鼠标、键盘和拖放选择。有效文件进入清晰的队列，上传进度、成功、失败、移除和重试状态都能直接确认。

<template #example>
<upload-zh-default />
</template>

<template #template>

@[code{1-12}](../../.vuepress/components/upload-zh/default.vue)

</template>

<template #script>

@[code{14-30}](../../.vuepress/components/upload-zh/default.vue)

</template>

</card>

<card>

## Promise 调用

无需渲染 Upload 组件，直接调用 `SUpload.pick(options)` 即可唤起系统文件选择器。选择完成后 Promise 返回 `File` 或 `File[]`，取消则返回 `undefined`。校验失败会抛出 `UploadPickError`，其 `reason` 为 `type`、`size`、`limit`、`guard` 或 `unsupported`。

这个 API 只负责选择文件。Promise 返回后可继续调用业务上传请求；需要可视队列、进度、移除和重试流程时仍使用组件形态。

<template #example>
<upload-zh-promise />
</template>

<template #template>

@[code{37-45}](../../.vuepress/components/upload-zh/promise.vue)

</template>

<template #script>

@[code{1-35}](../../.vuepress/components/upload-zh/promise.vue)

</template>

<template #style>

@[code{47-54}](../../.vuepress/components/upload-zh/promise.vue)

</template>

### Promise API

| API                        | 返回值                                 | 说明                                                       |
| -------------------------- | -------------------------------------- | ---------------------------------------------------------- |
| `SUpload.pick(options)`    | `Promise<File \| File[] \| undefined>` | `multiple` 或 `directory` 返回数组；取消返回 `undefined`。 |
| `pickUploadFiles(options)` | 同上                                   | 与静态方法实现一致的具名导出。                             |

</card>

<card>

## 图片队列

设置 `mode="image"` 仅接收图片；`list-type="card"` 和 `preview-fit` 负责卡片队列的呈现，不改变上传逻辑。

<template #example>
<upload-zh-multiple />
</template>

<template #template>

@[code{1-12}](../../.vuepress/components/upload-zh/multiple.vue)

</template>

<template #script>

@[code{14-16}](../../.vuepress/components/upload-zh/multiple.vue)

</template>

</card>

<card>

## 自动上传

设置 `automatic` 后，有效文件会立即开始上传。自定义请求通过 `updateProgress` 回报进度；失败项会保留明确的重试入口。

<template #example>
<upload-zh-automatic />
</template>

<template #template>

@[code{1-11}](../../.vuepress/components/upload-zh/automatic.vue)

</template>

<template #script>

@[code{13-25}](../../.vuepress/components/upload-zh/automatic.vue)

</template>

</card>

<card>

## 自定义触发区

`trigger` 插槽提供 `choose`、`dragging` 和 `disabled`，品牌化入口仍复用相同的选择器、校验与拖放流程。

<template #example>
<upload-zh-advanced />
</template>

<template #template>

@[code{1-14}](../../.vuepress/components/upload-zh/advanced.vue)

</template>

<template #script>

@[code{16-18}](../../.vuepress/components/upload-zh/advanced.vue)

</template>

<template #style>

@[code{20-39}](../../.vuepress/components/upload-zh/advanced.vue)

</template>

</card>

<card>

## 外形

设置 `shape="square"`，上传区、队列、预览和操作入口会一起遵循全局方形外观。

<template #example>
<upload-zh-shape />
</template>

<template #template>

@[code{1-21}](../../.vuepress/components/upload-zh/shape.vue)

</template>

<template #style>

@[code{23-35}](../../.vuepress/components/upload-zh/shape.vue)

</template>

</card>
