<template>
  <div class="demo-row">
    <s-cascader
      v-model="parentValues"
      :options="options"
      multiple
      show-search
      placeholder="SHOW_PARENT"
    />
    <s-cascader
      v-model="childValues"
      :options="options"
      multiple
      show-search
      show-checked-strategy="SHOW_CHILD"
      :max-tag-count="2"
      placeholder="SHOW_CHILD"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const parentValues = ref<Array<Array<string | number>>>([])
const childValues = ref<Array<Array<string | number>>>([
  ['documents', 'guides'],
  ['documents', 'api'],
  ['assets', 'icons'],
])
const options = [
  {
    value: 'documents',
    label: 'Documents',
    children: [
      { value: 'guides', label: 'Guides' },
      { value: 'api', label: 'API reference' },
      { value: 'releases', label: 'Release notes' },
    ],
  },
  {
    value: 'assets',
    label: 'Assets',
    children: [
      { value: 'icons', label: 'Icons' },
      { value: 'tokens', label: 'Design tokens' },
    ],
  },
]
</script>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
