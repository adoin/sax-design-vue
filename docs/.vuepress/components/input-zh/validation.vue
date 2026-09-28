<template>
  <s-form ref="form" :model="model">
    <s-form-item prop="email" label="邮箱" required>
      <s-input
        v-model="model.email"
        type="email"
        required
        placeholder="name@example.com"
      />
    </s-form-item>
    <s-form-item prop="url" label="网址">
      <s-input
        v-model="model.url"
        type="url"
        placeholder="https://example.com"
      />
    </s-form-item>
    <s-form-item prop="tel" label="电话">
      <s-input
        v-model="model.tel"
        type="tel"
        pattern="[0-9]{3}-[0-9]{4}"
        validation-message="请使用示例格式 123-4567。"
        placeholder="123-4567"
      />
    </s-form-item>
    <s-button @click="check">校验</s-button>
    <p role="status">{{ status }}</p>
  </s-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'sax-design-vue'
const form = ref<FormInstance>()
const model = reactive({ email: '', url: '', tel: '' })
const status = ref('')
const check = async () => {
  status.value = (await form.value?.validate())
    ? '校验通过。'
    : '请修正上方字段。'
}
</script>
