<template>
  <div :class="[ns.b(), ns.is(resolvedShape), ns.is('dragging', isDragging)]">
    <div
      v-if="!readonly"
      :class="[
        ns.e('dropzone'),
        ns.is('disabled', isDisabled),
        ns.is('limit', isLimitReached),
      ]"
      role="button"
      :tabindex="isDisabled ? -1 : 0"
      :aria-disabled="isDisabled"
      :aria-label="inputText"
      @click="choose"
      @keydown.enter.prevent="choose"
      @keydown.space.prevent="choose"
      @dragenter.prevent="handleDragEnter"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <input
        ref="inputRef"
        :class="ns.e('input')"
        type="file"
        :accept="effectiveAccept"
        :multiple="multiple"
        :disabled="isDisabled"
        tabindex="-1"
        @change="handleChange"
      />

      <slot
        name="trigger"
        :choose="choose"
        :dragging="isDragging"
        :disabled="isDisabled"
      >
        <span :class="ns.e('upload-icon')" aria-hidden="true">
          <SIcon name="cb:cloud-upload" />
        </span>
        <div :class="ns.e('prompt')">
          <strong :class="ns.e('title')">{{ inputText }}</strong>
          <span v-if="drag" :class="ns.e('description')">
            {{ t('vs.upload.dropHint') }}
          </span>
          <span v-if="restrictionText" :class="ns.e('restriction')">
            {{ restrictionText }}
          </span>
        </div>
      </slot>
    </div>

    <div
      v-if="
        fileList.length &&
        (showList || (showUploadButton && showSubmitButton && !readonly))
      "
      :class="ns.e('queue')"
      aria-live="polite"
    >
      <div :class="ns.e('queue-head')">
        <div>
          <strong :class="ns.e('queue-title')">{{
            t('vs.upload.queue')
          }}</strong>
          <span :class="ns.e('queue-count')">
            {{ fileList.length }} {{ t('vs.upload.files') }}
          </span>
        </div>
        <button
          v-if="showUploadButton && showSubmitButton && hasPending && !readonly"
          :class="ns.e('submit')"
          type="button"
          :disabled="isUploading"
          @click="uploadAll"
        >
          <SIcon v-if="showButtonIcon" name="cb:cloud-upload" />
          <span v-if="showButtonText">
            {{ isUploading ? t('vs.upload.uploading') : t('vs.upload.start') }}
          </span>
        </button>
      </div>

      <div
        v-if="showProgress && isUploading"
        :class="ns.e('overall-progress')"
        role="progressbar"
        :aria-label="`${t('vs.upload.uploading')} ${totalPercent}%`"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="totalPercent"
      >
        <span :style="{ width: `${totalPercent}%` }" />
      </div>

      <UploadFileList
        v-if="showList"
        :files="fileList"
        :list-type="resolvedListType"
        :preview-fit="previewFit"
        :show-preview="showPreview"
        :show-progress="showProgress"
        :show-remove-button="showRemoveButton"
        :show-retry="showRetry"
        :readonly="readonly"
        :ready-label="t('vs.upload.ready')"
        :uploading-label="t('vs.upload.uploading')"
        :success-label="t('vs.upload.success')"
        :error-label="t('vs.upload.error')"
        :retry-label="t('vs.upload.retry')"
        :remove-label="t('vs.upload.delete')"
        @remove="removeFile"
        @retry="retryFile"
      />
    </div>

    <div v-if="showTip || $slots.tip" :class="ns.e('tip')">
      <slot name="tip">{{ tipText }}</slot>
    </div>

    <p v-if="liveMessage" :class="ns.e('sr-only')" aria-live="assertive">
      {{ liveMessage }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { useLocale, useNamespace, useShape } from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'
import UploadFileList from './upload-file-list.vue'
import { useUploadFiles } from './use-upload-files'
import { uploadEmits, uploadProps } from './upload'
import type { UploadFileItem } from './upload'

defineOptions({ name: 'SUpload', inheritAttrs: false })

const props = defineProps(uploadProps)
const emit = defineEmits(uploadEmits)

const ns = useNamespace('upload')
const resolvedShape = useShape()
const { t } = useLocale()
const inputRef = ref<HTMLInputElement>()
const isDragging = ref(false)
const dragDepth = ref(0)
const liveMessage = ref('')

const {
  fileList,
  limitCount,
  effectiveAccept,
  isLimitReached,
  addFiles,
  removeFile: removeFromList,
  clear,
} = useUploadFiles({
  props,
  onModelChange: (files) => {
    emit(UPDATE_MODEL_EVENT, props.multiple ? files : (files[0] ?? null))
  },
  onAdd: (item, files) => emit('add', item, files),
  onRemove: (item, files) => {
    emit('on-delete', item.raw)
    emit('remove', item, files)
  },
  onReject: (file, reason, error) => {
    const rejectionMessage = {
      type: t('vs.upload.invalidType'),
      size: t('vs.upload.tooLarge'),
      limit: t('vs.upload.tooMany'),
      guard: t('vs.upload.rejected'),
    }[reason]
    liveMessage.value = `${file.name}: ${rejectionMessage}`
    emit('reject', file, reason, error)
    emit('on-error', error)
  },
  onExceed: (files, currentFiles) => emit('exceed', files, currentFiles),
})

const shouldAutoSubmit = computed(() => props.automatic || props.autoSubmit)
const isDisabled = computed(() => props.disabled || isLimitReached.value)
const inputText = computed(() =>
  isLimitReached.value
    ? props.textMax || t('vs.upload.limitReached')
    : props.buttonText || props.text || t('vs.upload.uploadFile'),
)
const resolvedListType = computed<'list' | 'card'>(() => {
  if (props.listType !== 'auto') return props.listType
  return props.mode === 'image' ? 'card' : 'list'
})
const restrictionText = computed(() => {
  const parts: string[] = []
  if (effectiveAccept.value) parts.push(effectiveAccept.value)
  if (props.limitSize)
    parts.push(`${t('vs.upload.maxSize')} ${props.limitSize} MB`)
  if (limitCount.value)
    parts.push(`${t('vs.upload.maxFiles')} ${limitCount.value}`)
  return parts.join(' · ')
})
const isUploading = computed(() =>
  fileList.value.some((file) => file.status === 'uploading'),
)
const hasPending = computed(() =>
  fileList.value.some(
    (file) => file.status === 'ready' || file.status === 'error',
  ),
)
const totalPercent = computed(() => {
  if (!fileList.value.length) return 0
  const total = fileList.value.reduce((sum, file) => sum + file.percent, 0)
  return Math.round(total / fileList.value.length)
})

const processFiles = async (files: File[]) => {
  const added = await addFiles(files)
  emit(
    'change',
    files,
    fileList.value.map((item) => item.raw),
  )
  if (!added.length || !shouldAutoSubmit.value) return
  if (props.singleUpload) await uploadFile(added[0])
  else await uploadAll()
}

const handleChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  await processFiles(Array.from(input.files || []))
  input.value = ''
}

const handleDragEnter = () => {
  if (!props.drag || isDisabled.value) return
  dragDepth.value += 1
  isDragging.value = true
}
const handleDragOver = (event: DragEvent) => {
  if (!props.drag || isDisabled.value) return
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
}
const handleDragLeave = () => {
  if (!props.drag) return
  dragDepth.value = Math.max(0, dragDepth.value - 1)
  if (!dragDepth.value) isDragging.value = false
}
const handleDrop = async (event: DragEvent) => {
  dragDepth.value = 0
  isDragging.value = false
  if (!props.drag || isDisabled.value) return
  await processFiles(Array.from(event.dataTransfer?.files || []))
}

const removeFile = async (file: UploadFileItem | number) => {
  await removeFromList(file)
}

const uploadAll = async () => {
  if (!props.action && !props.uploadMethod) {
    const error = new Error('Upload action is required')
    liveMessage.value = error.message
    emit('on-error', error)
    return
  }
  const pending = fileList.value.filter(
    (item) => item.status === 'ready' || item.status === 'error',
  )
  if (!pending.length) return
  emit('upload-queue-start', pending)
  await Promise.all(pending.map((item) => uploadFile(item)))
  emit('upload-queue-end', pending)
}

const updateProgress = (item: UploadFileItem, percent: number) => {
  item.percent = Math.max(0, Math.min(100, Math.trunc(percent)))
  emit('progress', item, item.percent)
}

const markSuccess = (item: UploadFileItem, response: unknown) => {
  item.uploading = false
  item.error = false
  item.success = true
  item.status = 'success'
  item.response = response
  item.errorMessage = undefined
  updateProgress(item, 100)
  liveMessage.value = `${item.name}: ${t('vs.upload.success')}`
  emit('on-success', response)
  emit('upload-success', item, response)
  emit('upload-end', item)
}

const markError = (item: UploadFileItem, error: unknown) => {
  item.uploading = false
  item.error = true
  item.success = false
  item.status = 'error'
  item.errorMessage =
    error instanceof Error ? error.message : t('vs.upload.error')
  liveMessage.value = `${item.name}: ${item.errorMessage}`
  emit('on-error', error)
  emit('upload-error', item, error)
  emit('upload-end', item)
}

const uploadFile = async (item?: UploadFileItem) => {
  if (!item || item.status === 'uploading') return
  item.uploading = true
  item.error = false
  item.success = false
  item.status = 'uploading'
  item.errorMessage = undefined
  updateProgress(item, 0)
  emit('upload-start', item)

  if (props.uploadMethod) {
    try {
      const response = await props.uploadMethod({
        file: item.raw,
        option: item,
        updateProgress: (percent) => updateProgress(item, percent),
      })
      markSuccess(item, response)
    } catch (error) {
      markError(item, error)
    }
    return
  }

  await new Promise<void>((resolve) => {
    const formData = new FormData()
    Object.entries(props.data || {}).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
    formData.append(props.fileName || 'file', item.raw, item.name)
    const xhr = new XMLHttpRequest()
    xhr.open('POST', props.action!, true)
    xhr.withCredentials = true
    Object.entries(props.headers || {}).forEach(([key, value]) => {
      if (value != null) xhr.setRequestHeader(key, String(value))
    })
    xhr.upload.onprogress = (event) => {
      if (event.total > 0)
        updateProgress(item, (event.loaded / event.total) * 100)
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) markSuccess(item, xhr.response)
      else markError(item, xhr.response)
      resolve()
    }
    xhr.onerror = () => {
      markError(item, xhr.response)
      resolve()
    }
    xhr.send(formData)
  })
}

const retryFile = async (file: UploadFileItem) => {
  emit('retry', file)
  await uploadFile(file)
}
const choose = () => {
  if (!isDisabled.value) inputRef.value?.click()
}
const getPendingFiles = () =>
  fileList.value
    .filter((item) => item.status !== 'success')
    .map((item) => item.raw)

defineExpose({
  choose,
  submit: uploadAll,
  clear,
  remove: removeFile,
  retry: retryFile,
  getPendingFiles,
})
</script>
