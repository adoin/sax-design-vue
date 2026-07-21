<template>
  <div class="center types">
    <s-date-picker v-model="month" type="month" placeholder="Month" />
    <s-date-picker v-model="year" type="year" placeholder="Year" />
    <s-date-picker v-model="week" type="week" placeholder="Week" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const month = ref('')
const year = ref('')
const week = ref('')
</script>

<style scoped>
.types {
  gap: 16px;
}
</style>
