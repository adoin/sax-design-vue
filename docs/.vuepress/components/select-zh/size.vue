<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive({ small: '', default: '', large: '' })
const options = [
  { label: '设计', value: 'design' },
  { label: '研发', value: 'engineering' },
]
</script>

<template>
  <div class="select-size-demo">
    <s-select
      v-model="values.small"
      size="small"
      placeholder="小号"
      :options="options"
    />
    <s-select v-model="values.default" placeholder="默认" :options="options" />
    <s-select
      v-model="values.large"
      size="large"
      placeholder="大号"
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
