<template>
  <s-upload
    automatic
    multiple
    text="Upload immediately"
    :limit="3"
    :upload-method="uploadMethod"
    show-tip
    tip-text="Each selected file starts uploading automatically."
  />
</template>

<script setup lang="ts">
const uploadMethod = async ({
  updateProgress,
}: {
  updateProgress: (percent: number) => void
}) => {
  for (const percent of [20, 55, 85, 100]) {
    updateProgress(percent)
    await new Promise((resolve) => setTimeout(resolve, 180))
  }
  return { ok: true }
}
</script>
