<template>
  <div class="play-container demo">
    <vs-button type="border" @click="open = true">Run prompt</vs-button>
    <vs-prompt
      v-model="open"
      title="Dialog"
      :is-valid="code.length > 0"
      @cancel="code = ''"
      @accept="open = false"
      @close="open = false"
    >
      <div class="prompt-body">
        Enter the security code
        <vs-input v-model="code" placeholder="Code" />
      </div>
    </vs-prompt>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const code = ref('')
</script>

<style lang="scss" scoped>
.demo {
  flex-direction: column;
  gap: 12px;
  width: min(520px, 90vw);
}

.prompt-body {
  padding: 10px 10px 0;

  :deep(.vs-input) {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
