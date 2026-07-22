<template>
  <s-form ref="formRef" :model="model" :rules="rules" label-width="72">
    <s-form-item label="Name" prop="name"
      ><s-input v-model="model.name" placeholder="Your name"
    /></s-form-item>
    <s-form-item label="Email" prop="email"
      ><s-input v-model="model.email" placeholder="name@example.com"
    /></s-form-item>
    <s-form-item
      ><s-button type="primary" @click="validate"
        >Validate</s-button
      ></s-form-item
    >
  </s-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const formRef = ref<{ validate: () => Promise<boolean> }>()
const model = ref({ name: '', email: '' })
const rules = {
  name: { required: true, message: 'Name is required' },
  email: {
    validator: (value: unknown) =>
      /.+@.+\..+/.test(String(value)) || 'Enter a valid email',
  },
}
const validate = () => formRef.value?.validate()
</script>
