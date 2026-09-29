<script setup lang="ts">
import { ref } from 'vue'
const disabled = ref(true)
const value = ref(
  'This content stays in place while the state changes. Resume editing when the control becomes available.',
)
</script>

<template>
  <div class="textarea-state-example">
    <div class="textarea-state-example__control">
      <s-switch v-model="disabled" aria-label="Disabled" />
      <span>Disabled</span>
    </div>
    <s-textarea
      v-model="value"
      :disabled="disabled"
      show-word-count
      aria-label="Description"
    />
  </div>
</template>

<style scoped>
.textarea-state-example {
  display: grid;
  gap: 24px;
  width: 100%;
  min-width: 0;
}
.textarea-state-example__control {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
