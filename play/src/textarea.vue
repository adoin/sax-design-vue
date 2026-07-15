<template>
  <div class="play-container demo">
    <s-textarea
      v-model="text"
      counter="20"
      label="Counter: 20"
      v-model:counter-danger="counterDanger"
      width="100%"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref('')
const counterDanger = ref(false)
</script>

<style lang="scss" scoped>
.demo {
  flex-direction: column;
  width: min(480px, 90vw);
}
.hint {
  margin: 8px 0 0;
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.55);
}
</style>
