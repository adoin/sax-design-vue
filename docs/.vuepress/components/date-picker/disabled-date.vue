<template>
  <div class="center">
    <s-date-picker
      v-model="value"
      :disabled-date="disabledDate"
      placeholder="Pick a day"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')

const disabledDate = (time: Date) => time.getTime() > Date.now()
</script>
