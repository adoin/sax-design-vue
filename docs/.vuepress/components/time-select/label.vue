<template>
  <div class="center label-demo">
    <s-time-select
      v-model="fixedLabelValue"
      label="Start time"
      placeholder="Select time"
    />
    <s-time-select
      v-model="floatingLabelValue"
      label="End time"
      label-float
      placeholder="End time"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fixedLabelValue = ref('09:00')
const floatingLabelValue = ref('')
</script>

<style scoped>
.label-demo {
  align-items: flex-end;
  gap: 28px;
}
</style>
