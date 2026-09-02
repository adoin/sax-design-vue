<script setup lang="ts">
import { shallowRef } from 'vue'
import { SUpload, UploadPickError } from 'sax-design-vue'

const result = shallowRef('尚未选择文件。')

const reasonText = {
  type: '文件类型不符合要求',
  size: '文件超过大小限制',
  limit: '文件数量超过限制',
  guard: '文件未通过业务校验',
  unsupported: '当前环境不支持文件选择',
}

const pickFiles = async () => {
  try {
    const files = await SUpload.pick({
      multiple: true,
      accept: ['image/*', '.pdf'],
      limit: 3,
      limitSize: 5,
    })
    result.value = files?.length
      ? `已选择 ${files.length} 个文件：${files
          .map((file) => file.name)
          .join('、')}`
      : '已取消选择。'
  } catch (error) {
    result.value =
      error instanceof UploadPickError
        ? reasonText[error.reason]
        : '无法唤起文件选择器。'
  }
}
</script>

<template>
  <div class="promise-upload">
    <s-button @click="pickFiles">
      <s-icon name="cb:upload" />
      Promise 选择文件
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
