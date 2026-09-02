<template>
  <s-upload
    v-model="files"
    multiple
    text="Choose files"
    :limit="4"
    :limit-size="5"
    :upload-method="uploadMethod"
    show-tip
    tip-text="Up to 4 files, 5 MB each. Drag and drop is supported."
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
