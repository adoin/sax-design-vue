<template>
  <div class="play-container demo">
    <vs-textarea
      v-model="text"
      label="Description"
      color="primary"
      :counter="120"
      height="120px"
      width="100%"
    />
    <p class="hint">Length: {{ text.length }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref('Hello Vuesax Textarea')
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
