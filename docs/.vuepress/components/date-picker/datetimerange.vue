<template>
  <div class="center">
    <s-date-picker
      v-model="value"
      type="datetimerange"
      start-placeholder="Start"
      end-placeholder="End"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref<[Date, Date] | ''>('')
</script>
