<template>
  <div class="center date-picker-visual-demo">
    <s-date-picker
      v-model="value"
      label="Delivery date"
      label-float
      color="success"
      placeholder="Pick a day"
    />
    <s-date-picker
      v-model="range"
      type="daterange"
      start-label="Start date"
      end-label="End date"
      label-float
      color="#7d33ff"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const range = ref([])
</script>

<style scoped>
.date-picker-visual-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 24px 16px;
}
</style>
