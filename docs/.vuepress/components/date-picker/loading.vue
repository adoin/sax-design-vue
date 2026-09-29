<template>
  <div class="loading-demo">
    <s-switch v-model="loading">Loading</s-switch>
    <div class="loading-demo__fields">
      <s-date-picker
        v-model="date"
        :loading="loading"
        label="Date"
        label-float
        value-format="YYYY-MM-DD"
      />
      <s-date-picker
        v-model="range"
        type="daterange"
        :loading="loading"
        start-label="Start date"
        end-label="End date"
        label-float
        value-format="YYYY-MM-DD"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(true)
const date = ref('2026-09-18')
const range = ref(['2026-09-18', '2026-09-22'])
</script>

<style scoped>
.loading-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}
.loading-demo__fields {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
}
</style>
