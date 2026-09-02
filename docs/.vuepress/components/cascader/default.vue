<template>
  <div class="demo-row">
    <s-cascader v-model="value" :options="options" />
  </div>
  <p class="value">Selected path: {{ value.join(' / ') || 'none' }}</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref(['guide', 'components'])
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

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.value {
  margin: 10px 2px 0;
  color: var(--s-text-color-secondary);
  font-size: 12px;
}
</style>
