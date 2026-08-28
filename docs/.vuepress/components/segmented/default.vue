<script lang="ts" setup>
import { reactive } from 'vue'

const values = reactive({
  pill: 'week',
  text: 'week',
  tile: 'week',
})
const options = [
  { label: 'Day view', value: 'day' },
  { label: 'Week view', value: 'week' },
  { label: 'Month view', value: 'month' },
]
</script>

<template>
  <div class="segmented-demo">
    <div v-for="variant in Object.keys(values)" :key="variant">
      <s-text>{{ variant }}</s-text>
      <s-segmented
        v-model="values[variant as keyof typeof values]"
        :options="options"
        :variant="variant"
        :aria-label="`${variant} view`"
      />
    </div>
  </div>
</template>

<style scoped>
.segmented-demo {
  display: grid;
  gap: 18px;
}

.segmented-demo > div {
  display: flex;
  align-items: center;
  gap: 18px;
  text-transform: capitalize;
}
</style>
