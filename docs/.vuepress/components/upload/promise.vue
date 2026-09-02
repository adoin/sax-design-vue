<script setup lang="ts">
import { shallowRef } from 'vue'
import { SUpload, UploadPickError } from 'sax-design-vue'

const result = shallowRef('No files selected yet.')

const pickFiles = async () => {
  try {
    const files = await SUpload.pick({
      multiple: true,
      accept: ['image/*', '.pdf'],
      limit: 3,
      limitSize: 5,
    })
    result.value = files?.length
      ? `${files.length} selected: ${files.map((file) => file.name).join(', ')}`
      : 'Selection cancelled.'
  } catch (error) {
    result.value =
      error instanceof UploadPickError
        ? `Selection rejected (${error.reason}).`
        : 'Unable to open the file picker.'
  }
}
</script>

<template>
  <div class="promise-upload">
    <s-button @click="pickFiles">
      <s-icon name="cb:upload" />
      Choose with Promise
    </s-button>
    <s-text role="status" aria-live="polite">{{ result }}</s-text>
  </div>
</template>

<style scoped>
.promise-upload {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
</style>
