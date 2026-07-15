<template>
  <div class="play-container demo">
    <s-slider v-model="value" :min="0" :max="100" :step="5" color="primary" />
    <p class="hint">Value: {{ value }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref(35)
</script>

<style lang="scss" scoped>
.demo {
  flex-direction: column;
  width: min(480px, 90vw);
}
.hint {
  margin: 12px 0 0;
}
</style>
