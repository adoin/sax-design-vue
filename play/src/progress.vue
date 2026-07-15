<template>
  <div class="play-container demo">
    <s-progress :percent="percent" color="primary" />
    <s-progress :percent="percent" color="success" :height="8" />
    <s-progress indeterminate color="warn" :height="6" />
    <s-button @click="percent = percent >= 100 ? 0 : percent + 10">
      Update {{ percent }}%
    </s-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const percent = ref(40)
</script>

<style lang="scss" scoped>
.demo {
  flex-direction: column;
  gap: 16px;
  width: min(480px, 90vw);
}
</style>
