<template>
  <div class="center label-demo">
    <s-time-picker
      v-model="fixedLabelValue"
      label="Meeting time"
      placeholder="Select time"
    />
    <s-time-picker
      v-model="floatingLabelValue"
      label="Reminder time"
      label-float
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fixedLabelValue = ref('10:30:00')
const floatingLabelValue = ref('')
</script>

<style scoped>
.label-demo {
  align-items: flex-end;
  gap: 28px;
}
</style>
