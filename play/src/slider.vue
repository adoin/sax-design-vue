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
.hint {
  margin: 0;
  color: rgba(0, 0, 0, 0.55);
  font-size: 0.9rem;
}
</style>
