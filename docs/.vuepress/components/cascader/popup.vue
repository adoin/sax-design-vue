<template>
  <div class="demo-row">
    <s-cascader
      v-model="value"
      :options="options"
      :popup-config="{
        full: true,
        maxHeight: 260,
        offset: 8,
        appendTo: 'body',
        className: 'cascader-popup-demo',
      }"
      block
    >
      <template #header>Select a documentation destination</template>
      <template #option="{ option }">
        <span class="custom-option">{{ option.label }}</span>
      </template>
      <template #footer>The popup follows the full trigger width.</template>
    </s-cascader>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref<Array<string | number>>([])
const options = [
  {
    value: 'docs',
    label: 'Documentation',
    children: [
      { value: 'start', label: 'Getting started' },
      { value: 'components', label: 'Components' },
    ],
  },
  { value: 'playground', label: 'Playground' },
]
</script>

<style scoped>
.demo-row {
  width: min(440px, 100%);
}

.custom-option {
  font-weight: 600;
}
</style>
