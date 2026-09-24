<script setup lang="ts">
import { ref } from 'vue'

const plainDate = ref('')
const floatingDate = ref('2026-09-24')
const range = ref<[Date, Date] | ''>('')
</script>

<template>
  <div class="labels-demo">
    <s-date-picker
      v-model="plainDate"
      label="Appointment date"
      placeholder="Choose a date"
    />
    <s-date-picker v-model="floatingDate" label="Delivery date" label-float />
    <s-date-picker
      v-model="range"
      type="daterange"
      start-label="Start date"
      end-label="End date"
      label-float
    />
  </div>
</template>

<style scoped>
.labels-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
  gap: 20px;
  width: 100%;
}

.labels-demo > :last-child {
  grid-column: 1 / -1;
}
</style>
