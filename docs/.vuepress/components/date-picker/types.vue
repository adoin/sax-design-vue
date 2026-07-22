<template>
  <div class="center types">
    <s-date-picker v-model="month" type="month" placeholder="Month" />
    <s-date-picker v-model="quarter" type="quarter" placeholder="Quarter" />
    <s-date-picker v-model="year" type="year" placeholder="Year" />
    <s-date-picker v-model="week" type="week" placeholder="Week" />
    <s-date-picker
      v-model="multiple"
      multiple
      :limit-count="3"
      placeholder="Multiple dates"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const month = ref('')
const quarter = ref('')
const year = ref('')
const week = ref('')
const multiple = ref<Date[]>([])
</script>

<style scoped>
.types {
  gap: 16px;
}
</style>
