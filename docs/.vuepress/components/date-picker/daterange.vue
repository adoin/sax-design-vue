<template>
  <div class="center">
    <s-date-picker v-model="value" type="daterange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref<[Date, Date] | ''>('')
</script>
