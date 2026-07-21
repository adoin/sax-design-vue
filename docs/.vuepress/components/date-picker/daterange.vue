<template>
  <div class="center">
    <s-date-picker
      v-model="value"
      type="daterange"
      start-placeholder="Start date"
      end-placeholder="End date"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref<[Date, Date] | ''>('')
</script>
