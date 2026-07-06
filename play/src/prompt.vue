<template>
  <div class="play-container demo">
    <vs-button @click="open = true">Open Prompt</vs-button>
    <vs-prompt
      v-model="open"
      title="Confirm action"
      text="Are you sure you want to continue?"
      type="confirm"
      color="primary"
      @accept="accepted = true"
      @cancel="accepted = false"
    />
    <p v-if="accepted !== null" class="hint">
      Result: {{ accepted ? 'Accepted' : 'Cancelled' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const accepted = ref<boolean | null>(null)
</script>

<style lang="scss" scoped>
.demo {
  flex-direction: column;
  gap: 12px;
}
.hint {
  margin: 0;
  color: rgba(0, 0, 0, 0.65);
}
</style>
