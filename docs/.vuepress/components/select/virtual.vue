<template>
  <div class="select-virtual-demo">
    <s-select
      v-model="value"
      filterable
      virtual
      :virtual-config="{ threshold: 100, estimateSize: 36, overscan: 8 }"
      :options="options"
      :option-props="{ value: 'id', label: 'text' }"
      placeholder="Search 1,000 cities"
      :popup-config="{ width: 280, height: 260 }"
    />
    <small>Selected: {{ value || '—' }}</small>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')
const options = Array.from({ length: 1000 }, (_, index) => ({
  id: `city-${index + 1}`,
  text: `City ${String(index + 1).padStart(4, '0')}`,
  disabled: index % 97 === 0,
}))
</script>

<style scoped>
.select-virtual-demo {
  display: grid;
  gap: 10px;
  max-width: 280px;
}
.select-virtual-demo small {
  color: #637083;
}
</style>
