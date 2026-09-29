<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormItemConfig } from 'sax-design-vue'
const visible = ref(false)
const form = ref<FormInstance>()
const model = reactive({ name: '' })
const status = ref('')
const items: FormItemConfig[] = [
  {
    field: 'name',
    title: '姓名',
    rules: { required: true, message: '请输入姓名' },
    itemRender: { name: '$input', props: { placeholder: '用于创建工作区' } },
  },
]
const beforeConfirm = async () => {
  if (!(await form.value?.validate())) return false
  await new Promise((resolve) => setTimeout(resolve, 600))
  return true
}
const confirmed = () => {
  status.value = '提交成功'
}
const failed = () => {
  status.value = '提交失败，请重试'
}
</script>

<template>
  <div class="dialog-validation-example">
    <s-button @click="visible = true">打开校验示例</s-button>
    <p v-if="status" role="status">{{ status }}</p>
    <s-dialog
      v-model="visible"
      title="创建工作区"
      show-footer
      show-confirm-button
      show-cancel-button
      :before-confirm="beforeConfirm"
      @confirm="confirmed"
      @confirm-error="failed"
    >
      <s-form ref="form" :model="model" :items="items" />
    </s-dialog>
  </div>
</template>

<style scoped>
.dialog-validation-example {
  display: grid;
  justify-items: start;
  gap: 16px;
}
.dialog-validation-example p {
  margin: 0;
}
</style>
