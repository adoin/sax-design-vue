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
    title: 'Name',
    rules: { required: true, message: 'Enter a name' },
    itemRender: {
      name: '$input',
      props: { placeholder: 'Used for the workspace' },
    },
  },
]
const beforeConfirm = async () => {
  if (!(await form.value?.validate())) return false
  await new Promise((resolve) => setTimeout(resolve, 600))
  return true
}
const confirmed = () => {
  status.value = 'Submitted successfully'
}
const failed = () => {
  status.value = 'Submission failed. Try again.'
}
</script>

<template>
  <div class="dialog-validation-example">
    <s-button @click="visible = true">Open validation example</s-button>
    <p v-if="status" role="status">{{ status }}</p>
    <s-dialog
      v-model="visible"
      title="Create workspace"
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
