<script setup lang="ts">
import { shallowRef } from 'vue'

const committedValue = shallowRef('')
</script>

<template>
  <div class="input-action-demo">
    <s-input
      v-model="committedValue"
      :immediate="false"
      label="Profile name"
      placeholder="Type, then click outside"
    />
    <span class="input-action-demo__status" aria-live="polite">
      Committed: {{ committedValue || '—' }}
    </span>
  </div>
</template>

<style scoped>
.input-action-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.input-action-demo__status {
  color: rgba(var(--sax-text), 0.62);
  font-size: 0.78rem;
}
</style>
