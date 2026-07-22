<template>
  <s-tree-select v-model="value" :data="data" clearable />
  <p class="value">Selected: {{ value || 'none' }}</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref<string>()
const data = [
  {
    key: 'workspace',
    label: 'Workspace',
    children: [
      { key: 'components', label: 'Components' },
      { key: 'docs', label: 'Documentation' },
    ],
  },
]
</script>

<style scoped>
.value {
  margin: 10px 2px 0;
  color: var(--s-text-color-secondary);
  font-size: 12px;
}
</style>
