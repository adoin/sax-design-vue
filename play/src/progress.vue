<template>
  <div class="play-container demo">
    <vs-progress :percent="percent" color="primary" />
    <vs-progress :percent="percent" color="success" :height="8" />
    <vs-progress indeterminate color="warn" :height="6" />
    <vs-button @click="percent = percent >= 100 ? 0 : percent + 10">
      Update {{ percent }}%
    </vs-button>
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
