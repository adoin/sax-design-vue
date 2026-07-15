<template>
  <div class="prompt-programmatic-demo">
    <s-button type="border" @click="runAlert">Alert (JS)</s-button>
    <s-button type="border" @click="runConfirm">Confirm (JS)</s-button>
    <p v-if="message" class="result">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SPromptBox } from 'sax-design-vue'

const message = ref('')

const runAlert = async () => {
  await SPromptBox.alert('Saved successfully.', 'Notice')
  message.value = 'Alert closed'
}

const runConfirm = async () => {
  try {
    await SPromptBox.confirm('Do you want to continue?', 'Confirm action')
    message.value = 'Confirmed'
  } catch {
    message.value = 'Cancelled'
  }
}
</script>

<style scoped lang="scss">
.prompt-programmatic-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.result {
  width: 100%;
  margin: 8px 0 0;
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.65);
}
</style>
