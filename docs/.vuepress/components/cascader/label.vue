<script setup lang="ts">
import { shallowRef } from 'vue'

const labelValue = shallowRef<string[]>([])
const floatingValue = shallowRef<string[]>([])
const placeholderValue = shallowRef<string[]>([])
const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      { value: 'components', label: 'Components' },
      { value: 'theming', label: 'Theming' },
    ],
  },
  { value: 'api', label: 'API' },
]
</script>

<template>
  <div class="cascader-label-demo">
    <s-cascader
      v-model="labelValue"
      label="Label"
      placeholder="Choose a destination"
      :options="options"
      block
    />
    <s-cascader
      v-model="floatingValue"
      label="Label placeholder"
      label-float
      :options="options"
      block
    />
    <s-cascader
      v-model="placeholderValue"
      placeholder="Placeholder"
      :options="options"
      block
    />
  </div>
</template>

<style scoped>
.cascader-label-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr));
  gap: 16px;
  align-items: end;
}
</style>
