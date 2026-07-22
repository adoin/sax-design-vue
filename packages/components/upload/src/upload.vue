<template>
  <div :class="ns.b()">
    <div :class="ns.e('list')">
      <template v-if="showList">
        <div
          v-for="(file, index) in fileList"
          :key="file.uid"
          :class="[ns.e('item'), ns.is('error', file.error)]"
        >
          <button
            v-if="showRemoveButton && !readonly"
            :class="ns.e('remove')"
            type="button"
            @click="removeFile(index)"
          >
            <SIcon icon="clear" />
          </button>
          <img
            v-if="showPreview && file.preview"
            :src="file.preview"
            :class="ns.e('preview')"
          />
          <div v-else :class="ns.e('archive')">
            <SIcon icon="description" />
            <span>{{ file.name }}</span>
          </div>
          <div
            v-if="showProgress && file.uploading"
            :class="ns.e('progress')"
            :style="{ height: `${file.percent}%` }"
          />
        </div>
      </template>

      <div
        v-if="!isLimitReached && !readonly"
        :class="[ns.e('input-wrap'), ns.is('disabled', isDisabled)]"
      >
        <input
          ref="inputRef"
          :class="ns.e('input')"
          type="file"
          :accept="effectiveAccept"
          :multiple="multiple"
          :disabled="isDisabled"
          @change="handleChange"
        />
        <span v-if="showButtonText" :class="ns.e('text')">{{ inputText }}</span>
        <span :class="ns.e('bar')" :style="{ width: `${totalPercent}%` }" />
        <button
          v-if="showUploadButton && showSubmitButton"
          :class="ns.e('upload-btn')"
          type="button"
          :disabled="!fileList.length"
          @click="uploadAll"
        >
          <SIcon v-if="showButtonIcon" icon="cloud_upload" />
        </button>
      </div>
      <div v-else :class="[ns.e('input-wrap'), ns.is('disabled', true)]">
        <span :class="ns.e('text')">{{ textMax }}</span>
      </div>
    </div>
    <div v-if="showTip || $slots.tip" :class="ns.e('tip')">
      <slot name="tip">{{ tipText }}</slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { useNamespace } from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'
import { uploadEmits, uploadProps } from './upload'
import type { UploadFileItem } from './upload'

defineOptions({
  name: 'SUpload',
  inheritAttrs: false,
})

const props = defineProps(uploadProps)
const emit = defineEmits(uploadEmits)

const ns = useNamespace('upload')
const inputRef = ref<HTMLInputElement>()
const fileList = ref<UploadFileItem[]>([])
const totalPercent = ref(0)
let uid = 0

const isLimitReached = computed(() => {
  const count = props.limitCount ?? props.limit
  return count && fileList.value.length >= Number(count)
})

const limitCount = computed(() => Number(props.limitCount ?? props.limit ?? 0))
const shouldAutoSubmit = computed(() => props.automatic || props.autoSubmit)
const effectiveAccept = computed(() => {
  if (props.accept) return props.accept
  if (props.mode === 'image') return 'image/*'
  return props.fileTypes.join(',')
})

const isDisabled = computed(() => {
  if (props.disabled) return true
  if (isLimitReached.value) return true
  return false
})

const inputText = computed(() =>
  isDisabled.value && limitCount.value
    ? props.textMax
    : props.buttonText || props.text,
)

const readPreview = (file: File) =>
  new Promise<string | undefined>((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(undefined)
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.readAsDataURL(file)
  })

const handleChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
  if (!files.length) return

  if (props.singleUpload || !props.multiple) {
    fileList.value = []
  }

  for (const file of files) {
    if (limitCount.value && fileList.value.length >= limitCount.value) break
    if (props.beforeSelectMethod) {
      const allowed = await props.beforeSelectMethod({ file })
      if (!allowed) continue
    }
    if (props.limitSize && file.size > Number(props.limitSize) * 1024 * 1024) {
      emit('on-error', new Error(`File exceeds ${props.limitSize} MB limit`))
      continue
    }
    const preview = await readPreview(file)
    const item: UploadFileItem = {
      uid: ++uid,
      raw: file,
      name: file.name,
      preview,
      percent: 0,
      uploading: false,
      error: false,
    }
    fileList.value.push(item)
    emit('add', item, fileList.value)

    if (shouldAutoSubmit.value && props.singleUpload) {
      uploadFile(item)
    }
  }

  emit(
    'change',
    files,
    fileList.value.map((item) => item.raw),
  )
  emitModelValue()
  if (shouldAutoSubmit.value && !props.singleUpload) {
    uploadAll()
  }
  input.value = ''
}

const removeFile = async (index: number) => {
  const current = fileList.value[index]
  if (!current) return
  if (props.beforeRemoveMethod) {
    const allowed = await props.beforeRemoveMethod({ option: current })
    if (!allowed) return
  }
  const [removed] = fileList.value.splice(index, 1)
  if (!removed) return
  emit('on-delete', removed.raw)
  emit('remove', removed, fileList.value)
  emitModelValue()
}

const uploadAll = async () => {
  if (!props.action && !props.uploadMethod) {
    emit('on-error', new Error('Upload action is required'))
    return
  }

  const pending = fileList.value.filter((item) => !item.error && !item.success)
  if (!pending.length) return

  emit('upload-queue-start', pending)
  await Promise.all(pending.map((item) => uploadFile(item)))
  emit('upload-queue-end', pending)
}

const uploadFile = async (item: UploadFileItem) => {
  item.uploading = true
  item.error = false
  emit('upload-start', item)
  if (props.uploadMethod) {
    try {
      item.response = await props.uploadMethod({
        file: item.raw,
        option: item,
        updateProgress: (percent: number) => {
          item.percent = Math.max(0, Math.min(100, Math.trunc(percent)))
          totalPercent.value = item.percent
        },
      })
      item.percent = 100
      item.success = true
      emit('on-success', item.response)
      emit('upload-success', item, item.response)
    } catch (error) {
      item.error = true
      emit('on-error', error)
      emit('upload-error', item, error)
    } finally {
      item.uploading = false
      emit('upload-end', item)
    }
    return
  }

  await new Promise<void>((resolve) => {
    const formData = new FormData()
    const data = props.data || {}
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
    formData.append(props.fileName || 'file', item.raw, item.name)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', props.action!, true)
    xhr.withCredentials = true

    const headers = props.headers || {}
    Object.entries(headers).forEach(([key, value]) => {
      if (value != null) xhr.setRequestHeader(key, String(value))
    })

    xhr.upload.onprogress = (event) => {
      if (event.total > 0) {
        item.percent = Math.trunc((event.loaded / event.total) * 100)
        totalPercent.value = item.percent
      }
    }

    xhr.onload = () => {
      item.uploading = false
      if (xhr.status < 200 || xhr.status >= 300) {
        item.error = true
        emit('on-error', xhr.response)
        emit('upload-error', item, xhr.response)
        emit('upload-end', item)
        resolve()
        return
      }
      item.percent = 100
      item.success = true
      item.response = xhr.response
      emit('on-success', xhr.response)
      emit('upload-success', item, xhr.response)
      emit('upload-end', item)
      setTimeout(() => {
        totalPercent.value = 0
      }, 800)
      resolve()
    }

    xhr.onerror = () => {
      item.uploading = false
      item.error = true
      emit('on-error', xhr.response)
      emit('upload-error', item, xhr.response)
      emit('upload-end', item)
      resolve()
    }

    xhr.send(formData)
  })
}

const emitModelValue = () => {
  const files = fileList.value.map((item) => item.raw)
  emit(UPDATE_MODEL_EVENT, props.multiple ? files : (files[0] ?? null))
}

const choose = () => inputRef.value?.click()
const clear = async () => {
  fileList.value = []
  emitModelValue()
}
const getPendingFiles = () =>
  fileList.value.filter((item) => !item.success).map((item) => item.raw)

onMounted(async () => {
  const initial = (
    Array.isArray(props.modelValue)
      ? props.modelValue
      : props.modelValue
        ? [props.modelValue]
        : []
  ) as File[]
  for (const raw of initial) {
    const preview = await readPreview(raw)
    fileList.value.push({
      uid: ++uid,
      raw,
      name: raw.name,
      preview,
      percent: 100,
      uploading: false,
      error: false,
      success: true,
    })
  }
})

defineExpose({
  choose,
  submit: uploadAll,
  clear,
  remove: removeFile,
  getPendingFiles,
})
</script>
