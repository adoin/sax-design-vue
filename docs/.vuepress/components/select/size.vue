<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive({ small: '', default: '', large: '' })
const options = [
  { label: 'Design', value: 'design' },
  { label: 'Engineering', value: 'engineering' },
]
</script>

<template>
  <div class="select-size-demo">
    <s-select
      v-model="values.small"
      size="small"
      placeholder="Small"
      :options="options"
    />
    <s-select
      v-model="values.default"
      placeholder="Default"
      :options="options"
    />
    <s-select
      v-model="values.large"
      size="large"
      placeholder="Large"
      :options="options"
    />
  </div>
</template>

<style scoped>
.select-size-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  align-items: center;
  gap: 12px;
}
</style>
