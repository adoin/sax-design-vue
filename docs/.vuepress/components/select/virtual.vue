<template>
  <div class="select-virtual-demo">
    <s-select
      v-model="value"
      filterable
      virtual
      :virtual-config="{
        threshold: 100,
        estimateSize: 40,
        overscan: 8,
        dynamic: true,
      }"
      :options="options"
      :option-props="{ value: 'id', label: 'text' }"
      placeholder="Search 1,000 cities"
      :popup-config="{ width: 280, height: 260 }"
    >
      <template #option="{ option }">
        <span class="virtual-option">
          <strong>{{ option.text }}</strong>
          <small v-if="option.description">{{ option.description }}</small>
        </span>
      </template>
    </s-select>
    <small>Selected: {{ value || '—' }}</small>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')
const options = Array.from({ length: 1000 }, (_, index) => ({
  id: `city-${index + 1}`,
  text: `City ${String(index + 1).padStart(4, '0')}`,
  description:
    index % 7 === 0
      ? 'A longer secondary line makes this row taller and is measured after rendering.'
      : '',
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
.virtual-option {
  display: grid;
  min-width: 0;
  line-height: 1.35;
}
.virtual-option small {
  white-space: normal;
}
</style>
