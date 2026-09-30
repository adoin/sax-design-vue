<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const closeAnimation = ref(true)
</script>

<template>
  <div class="dialog-close-animation-example">
    <div class="animation-control">
      <s-switch v-model="closeAnimation" aria-label="Close animation" />
      <span>Close animation</span>
    </div>
    <s-button @click="visible = true">Open dialog</s-button>
    <s-dialog
      v-model="visible"
      :close-animation="closeAnimation"
      :width="440"
      title="Particle dissolve on close"
      minimizable
    >
      <p>
        Only the dialog surface dissolves when closing; the overlay stays
        unchanged. Closing its minimized bubble uses the same effect.
      </p>
    </s-dialog>
  </div>
</template>

<style scoped>
.dialog-close-animation-example {
  display: grid;
  justify-items: start;
  gap: 16px;
}
.animation-control {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dialog-close-animation-example p {
  margin: 0;
  line-height: 1.6;
}
</style>
