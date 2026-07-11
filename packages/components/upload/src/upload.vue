<template>
  <div :class="ns.b()">
    <div :class="ns.e('list')">
      <div
        v-for="(file, index) in fileList"
        :key="file.uid"
        :class="[ns.e('item'), ns.is('error', file.error)]"
      >
        <button
          :class="ns.e('remove')"
          type="button"
          @click="removeFile(index)"
        >
          <VsIcon icon="clear" />
        </button>
        <img v-if="file.preview" :src="file.preview" :class="ns.e('preview')" />
        <div v-else :class="ns.e('archive')">
          <VsIcon icon="description" />
          <span>{{ file.name }}</span>
        </div>
        <div
          v-if="showUploadButton && file.uploading"
          :class="ns.e('progress')"
          :style="{ height: `${file.percent}%` }"
        />
      </div>

      <div :class="[ns.e('input-wrap'), ns.is('disabled', isDisabled)]">
        <input
          ref="inputRef"
          :class="ns.e('input')"
          type="file"
          :accept="accept"
          :multiple="multiple"
          :disabled="isDisabled"
          @change="handleChange"
        />
        <span :class="ns.e('text')">{{ inputText }}</span>
        <span :class="ns.e('bar')" :style="{ width: `${totalPercent}%` }" />
        <button
          v-if="showUploadButton"
          :class="ns.e('upload-btn')"
          type="button"
          :disabled="!fileList.length"
          @click="uploadAll"
        >
          <VsIcon icon="cloud_upload" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { VsIcon } from '@vuesax-alpha/components/icon'
import { uploadEmits, uploadProps } from './upload'
import type { UploadFileItem } from './upload'

defineOptions({
  name: 'VsUpload',
  inheritAttrs: false,
})

const props = defineProps(uploadProps)
const emit = defineEmits(uploadEmits)

const ns = useNamespace('upload')
const inputRef = ref<HTMLInputElement>()
const fileList = ref<UploadFileItem[]>([])
const totalPercent = ref(0)
let uid = 0

const isDisabled = computed(() => {
  if (props.disabled) return true
  if (props.limit && fileList.value.length >= Number(props.limit)) return true
  return false
})

const inputText = computed(() =>
  isDisabled.value && props.limit ? props.textMax : props.text
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
    if (props.limit && fileList.value.length >= Number(props.limit)) break
    const preview = await readPreview(file)
    fileList.value.push({
      uid: ++uid,
      raw: file,
      name: file.name,
      preview,
      percent: 0,
      uploading: false,
      error: false,
    })
  }

  emit(
    'change',
    files,
    fileList.value.map((item) => item.raw)
  )
  if (props.automatic && props.action) {
    uploadAll()
  }
  input.value = ''
}

const removeFile = (index: number) => {
  const [removed] = fileList.value.splice(index, 1)
  emit('on-delete', removed.raw)
}

const uploadAll = () => {
  if (!props.action) {
    emit('on-error', new Error('Upload action is required'))
    return
  }

  const pending = fileList.value.filter((item) => !item.error)
  if (!pending.length) return

  pending.forEach((item) => {
    item.uploading = true
    uploadFile(item)
  })
}

const uploadFile = (item: UploadFileItem) => {
  const formData = new FormData()
  const data = props.data || {}
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })
  formData.append(props.fileName || 'file', item.raw, item.name)

  const xhr = new XMLHttpRequest()
  xhr.open('POST', props.action!, true)

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
      return
    }
    item.percent = 100
    emit('on-success', xhr.response)
    setTimeout(() => {
      totalPercent.value = 0
    }, 800)
  }

  xhr.onerror = () => {
    item.uploading = false
    item.error = true
    emit('on-error', xhr.response)
  }

  xhr.send(formData)
}
</script>
