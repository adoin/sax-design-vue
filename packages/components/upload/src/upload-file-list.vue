<template>
  <div
    v-if="files.length"
    :class="[ns.e('files'), ns.em('files', listType)]"
    role="list"
  >
    <article
      v-for="file in files"
      :key="file.uid"
      :class="[
        ns.e('item'),
        ns.is(file.status),
        ns.is('image', Boolean(file.preview)),
      ]"
      role="listitem"
    >
      <div :class="ns.e('visual')">
        <img
          v-if="showPreview && file.preview"
          :src="file.preview"
          :alt="file.name"
          :class="ns.e('preview')"
          :style="{ objectFit: previewFit }"
        />
        <SIcon v-else name="cb:document" />
      </div>

      <div :class="ns.e('meta')">
        <strong :class="ns.e('name')" :title="file.name">{{
          file.name
        }}</strong>
        <span :class="ns.e('detail')">
          {{ formatFileSize(file.raw.size) }} · {{ statusText(file) }}
        </span>
        <div
          v-if="showProgress && file.status === 'uploading'"
          :class="ns.e('progress-track')"
          role="progressbar"
          :aria-label="`${file.name}: ${file.percent}%`"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="file.percent"
        >
          <span
            :class="ns.e('progress-value')"
            :style="{ width: `${file.percent}%` }"
          />
        </div>
        <span
          v-if="file.errorMessage"
          :class="ns.e('error-message')"
          role="alert"
        >
          {{ file.errorMessage }}
        </span>
      </div>

      <div :class="ns.e('actions')">
        <button
          v-if="showRetry && file.status === 'error' && !readonly"
          :class="ns.e('action')"
          type="button"
          :aria-label="`${retryLabel}: ${file.name}`"
          :title="retryLabel"
          @click="$emit('retry', file)"
        >
          <SIcon name="cb:renew" />
        </button>
        <button
          v-if="showRemoveButton && !readonly"
          :class="[ns.e('action'), ns.em('action', 'remove')]"
          type="button"
          :aria-label="`${removeLabel}: ${file.name}`"
          :title="removeLabel"
          @click="$emit('remove', file)"
        >
          <SIcon name="cb:close" />
        </button>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { useNamespace } from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'
import type { UploadFileItem } from './upload'

interface Props {
  files: UploadFileItem[]
  listType: 'list' | 'card'
  previewFit: 'cover' | 'contain'
  showPreview: boolean
  showProgress: boolean
  showRemoveButton: boolean
  showRetry: boolean
  readonly: boolean
  readyLabel: string
  uploadingLabel: string
  successLabel: string
  errorLabel: string
  retryLabel: string
  removeLabel: string
}

const props = defineProps<Props>()

defineEmits<{
  remove: [file: UploadFileItem]
  retry: [file: UploadFileItem]
}>()

const ns = useNamespace('upload')

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const statusText = (file: UploadFileItem) => {
  if (file.status === 'uploading')
    return `${props.uploadingLabel} ${file.percent}%`
  if (file.status === 'success') return props.successLabel
  if (file.status === 'error') return props.errorLabel
  return props.readyLabel
}
</script>
