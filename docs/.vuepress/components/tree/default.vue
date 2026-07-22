<template>
  <s-tree
    v-model="current"
    :data="data"
    show-checkbox
    :default-expanded-keys="['workspace']"
    :default-checked-keys="['ui']"
    @update:checked-keys="checked = $event"
  />
  <p class="state">
    Current: {{ current }} · Checked: {{ checked.join(', ') || 'none' }}
  </p>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const current = ref<string>()
const checked = ref<string[]>(['ui'])
const data = [
  {
    key: 'workspace',
    label: 'Workspace',
    children: [
      { key: 'ui', label: 'UI components' },
      {
        key: 'docs',
        label: 'Documentation',
        children: [{ key: 'api', label: 'API reference' }],
      },
    ],
  },
]
</script>

<style scoped>
.state {
  margin: 10px 4px 0;
  color: var(--s-text-color-secondary);
  font-size: 12px;
}
</style>
