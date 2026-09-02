<template>
  <s-upload
    v-model="files"
    multiple
    text="选择文件"
    :limit="4"
    :limit-size="5"
    :upload-method="uploadMethod"
    show-tip
    tip-text="最多 4 个文件，单个不超过 5 MB，支持点击或拖放。"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const files = ref<File[]>([])

const uploadMethod = async ({
  updateProgress,
}: {
  updateProgress: (percent: number) => void
}) => {
  updateProgress(35)
  await new Promise((resolve) => setTimeout(resolve, 300))
  updateProgress(78)
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { ok: true }
}
</script>
