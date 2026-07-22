<template>
  <s-upload
    v-model="files"
    multiple
    auto-submit
    mode="image"
    :limit-count="3"
    :limit-size="2"
    :file-types="['image/png', 'image/jpeg']"
    show-tip
    tip-text="PNG/JPG only, up to 2 MB each."
    :before-select-method="beforeSelect"
    :upload-method="uploadMethod"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const files = ref<File[]>([])

const beforeSelect = ({ file }: { file: File }) =>
  file.type.startsWith('image/')

const uploadMethod = async ({
  updateProgress,
}: {
  updateProgress: (percent: number) => void
}) => {
  updateProgress(40)
  await new Promise((resolve) => setTimeout(resolve, 350))
  updateProgress(100)
  return { ok: true }
}
</script>
