---
PROPS:
  - name: text
    type: String
    values: String
    description: Upload area label.
    default: Upload File
    link: null
    usage: '#default'

  - name: file-name
    type: String
    values: String
    description: Form field name for upload.
    default: file
    link: null
    usage: '#default'

  - name: limit
    type: Number, String
    values: Number
    description: Max number of files.
    default: null
    link: null
    usage: '#multiple'

  - name: multiple
    type: Boolean
    values: true, false
    description: Allow multiple files.
    default: false
    link: null
    usage: '#multiple'

  - name: single-upload
    type: Boolean
    values: true, false
    description: Replace file on each selection.
    default: false
    link: null
    usage: '#default'

  - name: automatic
    type: Boolean
    values: true, false
    description: Upload immediately after select.
    default: false
    link: null
    usage: '#automatic'

  - name: auto-submit
    type: Boolean
    values: true, false
    description: VXE-compatible alias of automatic upload.
    default: false
    link: null
    usage: '#advanced'

  - name: model-value
    type: File | File[]
    values: File
    description: Two-way file list binding.
    default: null
    link: null
    usage: '#advanced'

  - name: file-types / limit-size / limit-count
    type: Array / Number
    values: MIME types / MB / count
    description: Restrict allowed files, file size and file count.
    default: null
    link: null
    usage: '#advanced'

  - name: action
    type: String
    values: URL
    description: Upload endpoint URL.
    default: null
    link: null
    usage: '#automatic'

  - name: accept
    type: String
    values: MIME types
    description: Accepted file types.
    default: null
    link: null
    usage: '#default'

  - name: disabled
    type: Boolean
    values: true, false
    description: Disable upload.
    default: false
    link: null
    usage: '#default'
EVENTS:
  - name: change
    params: File[], File[]
    description: File list changed.

  - name: on-delete
    params: File
    description: File removed.

  - name: on-success
    params: unknown
    description: Upload succeeded.

  - name: on-error
    params: unknown
    description: Upload failed.
EXPOSES: []
description: 'Upload files manually or automatically with preview and limits.'
NEWS:
  - default
  - multiple
  - automatic
---

# Upload

<card>

## Default

Select a single file with the default upload area.

<template #example>
<upload-default />
</template>

<template #template>

@[code{1-3}](../.vuepress/components/upload/default.vue)

</template>

</card>

<card>

## Multiple

Allow several files and enforce a maximum with `limit`.

<template #example>
<upload-multiple />
</template>

<template #template>

@[code{1-3}](../.vuepress/components/upload/multiple.vue)

</template>

</card>

<card>

## Automatic

Upload immediately after selection when `action` is set.

<template #example>
<upload-automatic />
</template>

<template #template>

@[code{1-3}](../.vuepress/components/upload/automatic.vue)

</template>

</card>

<card>

## Advanced

`v-model` receives selected files. Use `before-select-method` for app rules and `upload-method` for a custom request adapter. Existing `action` upload still works.

<template #example>
<upload-advanced />
</template>

<template #template>

@[code{1-15} html{4-12}](../.vuepress/components/upload/advanced.vue)

</template>

<template #script>

@[code{17-31}](../.vuepress/components/upload/advanced.vue)

</template>

## API

</card>
