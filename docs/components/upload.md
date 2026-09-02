---
PROPS:
  - name: model-value
    type: File | File[] | null
    values: selected files
    description: Controls the selected file collection through v-model.
    default: null
    usage: '#default'
  - name: shape
    type: String
    values: rounded | square
    description: Applies rounded or square geometry to the upload surface and file queue.
    default: rounded
    usage: '#shape'
  - name: drag
    type: Boolean
    values: true | false
    description: Accepts files dropped on the upload surface.
    default: 'true'
    usage: '#default'
  - name: list-type
    type: String
    values: auto | list | card
    description: Chooses a compact row queue or visual card queue; auto uses cards in image mode.
    default: auto
    usage: '#image-queue'
  - name: preview-fit
    type: String
    values: cover | contain
    description: Controls how image previews fit their card.
    default: cover
    usage: '#image-queue'
  - name: mode
    type: String
    values: all | image
    description: Restricts selection to images and selects the automatic queue presentation.
    default: all
    usage: '#image-queue'
  - name: multiple
    type: Boolean
    values: true | false
    description: Allows selecting and dropping more than one file.
    default: 'false'
    usage: '#default'
  - name: single-upload
    type: Boolean
    values: true | false
    description: Replaces the current queue with each new valid selection.
    default: 'false'
    usage: '#default'
  - name: accept
    type: String
    values: MIME type | extension list
    description: Filters file types for both the native picker and dropped files.
    default: null
    usage: '#custom-trigger'
  - name: file-types
    type: String[]
    values: MIME type | extension list
    description: Provides accepted file rules when accept is not set.
    default: '[]'
    usage: '#image-queue'
  - name: limit
    type: Number | String
    values: positive number
    description: Limits the number of files kept in the queue.
    default: null
    usage: '#default'
  - name: limit-count
    type: Number | String
    values: positive number
    description: Compatibility alias of limit.
    default: null
    usage: '#default'
  - name: limit-size
    type: Number | String
    values: megabytes
    description: Rejects individual files larger than the configured size.
    default: null
    usage: '#default'
  - name: automatic
    type: Boolean
    values: true | false
    description: Starts uploading immediately after files pass validation.
    default: 'false'
    usage: '#automatic-upload'
  - name: auto-submit
    type: Boolean
    values: true | false
    description: Compatibility alias of automatic.
    default: 'false'
    usage: '#automatic-upload'
  - name: action
    type: String
    values: URL
    description: POST endpoint used by the built-in XMLHttpRequest adapter.
    default: null
    usage: '#automatic-upload'
  - name: upload-method
    type: Function
    values: ({ file, option, updateProgress }) => Promise
    description: Replaces the built-in request and can report progress through updateProgress.
    default: null
    usage: '#default'
  - name: file-name
    type: String
    values: form field name
    description: Names the file field in the built-in multipart request.
    default: file
    usage: '#automatic-upload'
  - name: headers
    type: Object
    values: Record<string, string>
    description: Adds headers to the built-in upload request.
    default: null
    usage: '#automatic-upload'
  - name: data
    type: Object
    values: Record<string, string>
    description: Adds fields to the built-in multipart request.
    default: null
    usage: '#automatic-upload'
  - name: before-select-method
    type: Function
    values: ({ file }) => boolean | Promise<boolean>
    description: Applies application validation before a file enters the queue.
    default: null
    usage: '#default'
  - name: before-remove-method
    type: Function
    values: ({ option }) => boolean | Promise<boolean>
    description: Guards removal of a queued file.
    default: null
    usage: '#default'
  - name: text
    type: String
    values: text
    description: Sets the upload surface title.
    default: Upload File
    usage: '#default'
  - name: text-max
    type: String
    values: text
    description: Replaces the title shown after the file limit is reached.
    default: null
    usage: '#default'
  - name: button-text
    type: String
    values: text
    description: Compatibility title that takes precedence over text.
    default: null
    usage: '#default'
  - name: show-tip
    type: Boolean
    values: true | false
    description: Shows the supporting tip below the component.
    default: 'false'
    usage: '#default'
  - name: tip-text
    type: String
    values: text
    description: Sets the built-in supporting tip.
    default: null
    usage: '#default'
  - name: show-list
    type: Boolean
    values: true | false
    description: Shows the selected file queue.
    default: 'true'
    usage: '#default'
  - name: show-preview
    type: Boolean
    values: true | false
    description: Shows generated previews for image files.
    default: 'true'
    usage: '#image-queue'
  - name: show-progress
    type: Boolean
    values: true | false
    description: Shows per-file and aggregate upload progress.
    default: 'true'
    usage: '#automatic-upload'
  - name: show-retry
    type: Boolean
    values: true | false
    description: Shows a retry action for failed uploads.
    default: 'true'
    usage: '#automatic-upload'
  - name: show-remove-button
    type: Boolean
    values: true | false
    description: Shows the remove action on queue items.
    default: 'true'
    usage: '#default'
  - name: show-upload-button
    type: Boolean
    values: true | false
    description: Shows the manual queue upload action.
    default: 'true'
    usage: '#default'
  - name: show-submit-button
    type: Boolean
    values: true | false
    description: Shows the manual queue upload action.
    default: 'true'
    usage: '#default'
  - name: show-button-icon
    type: Boolean
    values: true | false
    description: Shows the icon in the manual upload action.
    default: 'true'
    usage: '#default'
  - name: show-button-text
    type: Boolean
    values: true | false
    description: Shows the label in the manual upload action.
    default: 'true'
    usage: '#default'
  - name: readonly
    type: Boolean
    values: true | false
    description: Displays files without selection, removal, retry, or upload controls.
    default: 'false'
    usage: '#default'
  - name: disabled
    type: Boolean
    values: true | false
    description: Disables file picking and dropping.
    default: 'false'
    usage: '#default'
EVENTS:
  - name: update:modelValue
    params: File | File[] | null
    description: Emits the controlled file value after add, remove, or clear.
  - name: change
    params: selectedFiles, currentFiles
    description: Emits after a picker or drop interaction is processed.
  - name: add
    params: fileItem, fileItems
    description: Emits for every file added to the queue.
  - name: remove
    params: fileItem, fileItems
    description: Emits after a file is removed from the queue.
  - name: reject
    params: file, reason, error
    description: Emits when type, size, limit, or application validation rejects a file.
  - name: exceed
    params: files, currentFileItems
    description: Emits when a selection exceeds the configured file count.
  - name: progress
    params: fileItem, percent
    description: Emits normalized upload progress from 0 through 100.
  - name: retry
    params: fileItem
    description: Emits before retrying one failed item.
  - name: upload-start
    params: fileItem
    description: Emits when one file starts uploading.
  - name: upload-success
    params: fileItem, response
    description: Emits when one file uploads successfully.
  - name: upload-error
    params: fileItem, error
    description: Emits when one file upload fails.
  - name: upload-end
    params: fileItem
    description: Emits when one file upload settles.
  - name: upload-queue-start
    params: fileItems
    description: Emits before a manual or automatic batch begins.
  - name: upload-queue-end
    params: fileItems
    description: Emits after every item in the batch settles.
  - name: on-delete
    params: File
    description: Compatibility event emitted after file removal.
  - name: on-success
    params: response
    description: Compatibility event emitted after upload success.
  - name: on-error
    params: error
    description: Compatibility event emitted after validation or upload failure.
SLOTS:
  - name: trigger
    description: Replaces the dropzone content. Receives choose, dragging, and disabled.
  - name: tip
    description: Replaces the supporting tip below the upload flow.
EXPOSES:
  - name: choose
    description: Opens the native file picker.
  - name: submit
    description: Uploads every ready or failed queue item.
  - name: clear
    description: Clears the file queue and synchronizes v-model.
  - name: remove
    description: Removes a queue item by index or item reference.
  - name: retry
    description: Retries one failed queue item.
  - name: getPendingFiles
    description: Returns raw files that have not uploaded successfully.
description: 'Accessible file selection, drag and drop, validation, previews, progress, and retryable upload queues.'
NEWS:
  - default
  - promise
  - multiple
  - automatic
---

# Upload

<card>

## Complete flow

The default surface supports mouse, keyboard, and drag-and-drop selection. Valid files enter a clear queue, where upload progress, success, errors, removal, and retry remain visible.

<template #example>
<upload-default />
</template>

<template #template>

@[code{1-12}](../.vuepress/components/upload/default.vue)

</template>

<template #script>

@[code{14-30}](../.vuepress/components/upload/default.vue)

</template>

</card>

<card>

## Promise picker

Call `SUpload.pick(options)` without rendering an Upload component. It opens the native file picker and resolves with `File` or `File[]`; cancelling resolves `undefined`. Validation failures reject with `UploadPickError`, whose `reason` is `type`, `size`, `limit`, `guard`, or `unsupported`.

This API selects files only. Continue with your own request after the Promise resolves, or use the component when users need a visible queue, progress, removal, and retry flow.

<template #example>
<upload-promise />
</template>

<template #template>

@[code{27-35}](../.vuepress/components/upload/promise.vue)

</template>

<template #script>

@[code{1-25}](../.vuepress/components/upload/promise.vue)

</template>

<template #style>

@[code{37-44}](../.vuepress/components/upload/promise.vue)

</template>

### Promise API

| API                        | Return                                 | Notes                                                                   |
| -------------------------- | -------------------------------------- | ----------------------------------------------------------------------- |
| `SUpload.pick(options)`    | `Promise<File \| File[] \| undefined>` | `multiple` or `directory` returns an array; cancel returns `undefined`. |
| `pickUploadFiles(options)` | Same as above                          | Named export with the same implementation.                              |

</card>

<card>

## Image queue

Set `mode="image"` for image-only selection. `list-type="card"` and `preview-fit` control the visual queue without changing upload behavior.

<template #example>
<upload-multiple />
</template>

<template #template>

@[code{1-12}](../.vuepress/components/upload/multiple.vue)

</template>

<template #script>

@[code{14-16}](../.vuepress/components/upload/multiple.vue)

</template>

</card>

<card>

## Automatic upload

Use `automatic` to start each accepted file immediately. A custom request reports progress through `updateProgress`; failed items keep an explicit retry action.

<template #example>
<upload-automatic />
</template>

<template #template>

@[code{1-11}](../.vuepress/components/upload/automatic.vue)

</template>

<template #script>

@[code{13-25}](../.vuepress/components/upload/automatic.vue)

</template>

</card>

<card>

## Custom trigger

The `trigger` slot receives `choose`, `dragging`, and `disabled`, so branded entry points can reuse the same picker, validation, and drop behavior.

<template #example>
<upload-advanced />
</template>

<template #template>

@[code{1-19}](../.vuepress/components/upload/advanced.vue)

</template>

<template #script>

@[code{21-23}](../.vuepress/components/upload/advanced.vue)

</template>

<template #style>

@[code{25-44}](../.vuepress/components/upload/advanced.vue)

</template>

</card>

<card>

## Shape

Use `shape="square"` to align the upload surface, queue, previews, and actions with the global square geometry.

<template #example>
<upload-shape />
</template>

<template #template>

@[code{1-21}](../.vuepress/components/upload/shape.vue)

</template>

<template #style>

@[code{23-35}](../.vuepress/components/upload/shape.vue)

</template>

</card>
