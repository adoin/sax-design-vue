<script lang="ts" setup>
import { reactive, shallowRef } from 'vue'
import { createFormValidator } from 'sax-design-vue'
import type { FormItemConfig, FormValidationResult } from 'sax-design-vue'

const model = reactive({
  name: '',
  code: 'SAX',
})
const result = shallowRef<FormValidationResult>()

const items: FormItemConfig[] = [
  {
    field: 'name',
    title: 'Name',
    rules: { required: true, message: 'Enter a name' },
  },
  {
    field: 'code',
    title: 'Code',
    rules: {
      validator: (value) => value === 'SAX' || 'Code must be SAX',
    },
  },
]

const validator = createFormValidator(model, { items })

const validate = async () => {
  result.value = await validator.validate()
}

const reset = () => {
  model.name = ''
  model.code = 'SAX'
  result.value = undefined
}
</script>

<template>
  <div class="headless-example">
    <div class="headless-fields">
      <label for="headless-name">
        <span>Name</span>
        <s-input id="headless-name" v-model="model.name" placeholder="Name" />
      </label>
      <label for="headless-code">
        <span>Code</span>
        <s-input id="headless-code" v-model="model.code" placeholder="SAX" />
      </label>
    </div>

    <div class="headless-actions">
      <s-button type="border" @click="validate"
        >Validate without SForm</s-button
      >
      <s-button type="flat" @click="reset">Reset</s-button>
    </div>

    <s-alert
      v-if="result"
      type="flat"
      :color="result.valid ? 'success' : 'danger'"
    >
      <template #title>
        {{ result.valid ? 'Validation passed' : 'Validation failed' }}
      </template>
      {{ result.valid ? 'No field errors.' : JSON.stringify(result.errors) }}
    </s-alert>
  </div>
</template>

<style scoped>
.headless-example,
.headless-fields {
  display: grid;
  gap: 16px;
}

.headless-fields {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.headless-fields label {
  display: grid;
  gap: 8px;
  color: var(--sax-text-color, #17233d);
  font-size: 14px;
  font-weight: 600;
}

.headless-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 640px) {
  .headless-fields {
    grid-template-columns: 1fr;
  }
}
</style>
