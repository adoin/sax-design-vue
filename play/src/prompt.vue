<template>
  <div class="play-container demo">
    <s-button type="border" @click="open = true">Run prompt</s-button>
    <s-prompt
      v-model="open"
      title="Dialog"
      :is-valid="code.length > 0"
      @cancel="code = ''"
      @accept="open = false"
      @close="open = false"
    >
      <div class="prompt-body">
        Enter the security code
        <s-input v-model="code" placeholder="Code" />
      </div>
    </s-prompt>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const code = ref('')
</script>

<style lang="scss" scoped>
.demo {
  gap: 12px;
}

.prompt-body {
  padding: 10px 10px 0;

  :deep(.s-input) {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
