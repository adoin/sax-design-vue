---
PROPS:
  - name: before-remove-method / data / file-types / headers / limit-count / limit-size
    type: Function / Object / String[] / Number
    values: 上传请求数据和文件限制
    description: 配置移除拦截、请求数据、可接受文件及文件限制。
    default: '-'
  - name: show-button-icon / show-button-text / show-list / show-preview / show-progress / show-remove-button / show-submit-button / show-upload-button / text-max
    type: Boolean / Number
    values: 显示开关和文字限制
    description: 控制上传按钮、文件列表、预览、进度和操作入口显示。
    default: '-'
  - name: text
    type: String
    values: String
    description: 上传区域标签。
    default: Upload File
    link: null
    usage: '#default'

  - name: file-name
    type: String
    values: String
    description: 上传表单字段名称。
    default: file
    link: null
    usage: '#default'

  - name: limit
    type: Number, String
    values: Number
    description: 最大文件数。
    default: null
    link: null
    usage: '#multiple'

  - name: multiple
    type: Boolean
    values: true, false
    description: 允许多个文件。
    default: false
    link: null
    usage: '#multiple'

  - name: single-upload
    type: Boolean
    values: true, false
    description: 每次选择替换文件。
    default: false
    link: null
    usage: '#default'

  - name: automatic
    type: Boolean
    values: true, false
    description: 选择后立即上传。
    default: false
    link: null
    usage: '#automatic'

  - name: action
    type: String
    values: URL
    description: 上传接口 URL。
    default: null
    link: null
    usage: '#automatic'

  - name: accept
    type: String
    values: MIME types
    description: 接受的文件类型。
    default: null
    link: null
    usage: '#default'

  - name: disabled
    type: Boolean
    values: true, false
    description: 禁用上传。
    default: false
    link: null
    usage: '#default'
EVENTS:
  - name: change
    params: File[], File[]
    description: 文件列表变化时触发。

  - name: on-delete
    params: File
    description: 文件移除时触发。

  - name: on-success
    params: unknown
    description: 上传成功时触发。

  - name: on-error
    params: unknown
    description: 上传失败时触发。
EXPOSES: []
description: '手动或自动上传文件，支持预览与数量限制。'
NEWS:
  - default
  - multiple
  - automatic
---

# Upload（上传）

<card>

## 默认

使用默认上传区域选择单个文件。

<template #example>
<upload-default />
</template>

<template #template>

@[code{1-3}](../../.vuepress/components/upload/default.vue)

</template>

</card>

<card>

## 多选

允许多文件并通过 `limit` 限制数量。

<template #example>
<upload-multiple />
</template>

<template #template>

@[code{1-3}](../../.vuepress/components/upload/multiple.vue)

</template>

</card>

<card>

## 自动上传

设置 `action` 后选择即自动上传。

<template #example>
<upload-automatic />
</template>

<template #template>

@[code{1-3}](../../.vuepress/components/upload/automatic.vue)

</template>

</card>

<card>

## 高级能力

`v-model` 双向绑定已选文件。通过 `before-select-method` 接入业务校验，通过 `upload-method` 接入自定义请求；原有 `action` 上传方式保持兼容。

<template #example>
<upload-advanced />
</template>

<template #template>

@[code{1-15} html{4-12}](../../.vuepress/components/upload/advanced.vue)

</template>

<template #script>

@[code{17-31}](../../.vuepress/components/upload/advanced.vue)

</template>

## API

</card>
