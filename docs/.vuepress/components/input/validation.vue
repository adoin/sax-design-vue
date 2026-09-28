<template>
  <s-form ref="form" :model="model">
    <s-form-item prop="email" label="Email" required>
      <s-input
        v-model="model.email"
        type="email"
        required
        placeholder="name@example.com"
      />
    </s-form-item>
    <s-form-item prop="url" label="Website">
      <s-input
        v-model="model.url"
        type="url"
        placeholder="https://example.com"
      />
    </s-form-item>
    <s-form-item prop="tel" label="Phone">
      <s-input
        v-model="model.tel"
        type="tel"
        pattern="[0-9]{3}-[0-9]{4}"
        validation-message="Use the example format 123-4567."
        placeholder="123-4567"
      />
    </s-form-item>
    <s-form-item>
      <s-button @click="check">Validate</s-button>
    </s-form-item>
    <s-form-item>
      <p role="status">{{ status }}</p>
    </s-form-item>
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
    ? 'Validation passed.'
    : 'Please correct the fields above.'
}
</script>
