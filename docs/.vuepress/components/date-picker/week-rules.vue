<template>
  <s-config-provider
    :first-day-of-week="monday ? 1 : 0"
    :first-week-contains-date="4"
  >
    <s-switch v-model="monday">Start weeks on Monday</s-switch>
    <s-date-picker
      v-model="value"
      type="week"
      value-format="gggg-[W]ww"
      placeholder="Choose a week"
    />
  </s-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const monday = ref(true)
const value = ref('')
</script>
