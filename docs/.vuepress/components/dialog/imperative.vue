<script setup lang="ts">
import { ref } from 'vue'
import { SDialogBox } from 'sax-design-vue'
const result = ref('')
const notify = async () => {
  await SDialogBox.alert('Your draft has been saved.', 'Notice', {
    confirmButtonText: 'Got it',
  })
}
const confirm = async () => {
  try {
    await SDialogBox.confirm('Archive this draft?', 'Confirm archive', {
      confirmButtonText: 'Archive',
      cancelButtonText: 'Cancel',
    })
    result.value = 'Archive confirmed'
  } catch {
    result.value = 'Operation cancelled'
  }
}
</script>

<template>
  <div class="dialog-service-example">
    <div class="dialog-service-example__actions">
      <s-button @click="notify">Show notice</s-button>
      <s-button @click="confirm">Request confirmation</s-button>
    </div>
    <p v-if="result" role="status">{{ result }}</p>
  </div>
</template>

<style scoped>
.dialog-service-example {
  display: grid;
  gap: 16px;
}
.dialog-service-example__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.dialog-service-example p {
  margin: 0;
}
</style>
