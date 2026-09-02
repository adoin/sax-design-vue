<template>
  <s-upload
    automatic
    multiple
    text="选择后立即上传"
    :limit="3"
    :upload-method="uploadMethod"
    show-tip
    tip-text="每个选中的文件都会自动进入上传流程。"
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
