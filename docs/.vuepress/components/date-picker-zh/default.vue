<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const range = ref([])
</script>

<template>
  <div class="center date-picker-visual-demo">
    <s-date-picker
      v-model="value"
      label="交付日期"
      label-float
      color="success"
      placeholder="选择日期"
    />
    <s-date-picker
      v-model="range"
      type="daterange"
      start-label="开始日期"
      end-label="结束日期"
      label-float
      color="#7d33ff"
    />
  </div>
</template>

<style scoped>
.date-picker-visual-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 24px 16px;
}
</style>
