<template>
  <s-config-provider
    :first-day-of-week="monday ? 1 : 0"
    :first-week-contains-date="4"
  >
    <s-switch v-model="monday">周一作为每周第一天</s-switch>
    <s-date-picker
      v-model="value"
      type="week"
      value-format="gggg-[W]ww"
      placeholder="选择一周"
    />
  </s-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const monday = ref(true)
const value = ref('')
</script>
