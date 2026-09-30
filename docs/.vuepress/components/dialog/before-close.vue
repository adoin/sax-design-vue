<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import type { DialogBeforeCloseFn } from 'sax-design-vue'
const visible = ref(false)
const allowed = ref(false)
const checks = ref(0)
let timer: ReturnType<typeof setTimeout> | undefined
let finishWait: (() => void) | undefined
const beforeClose: DialogBeforeCloseFn = async () => {
  checks.value++
  await new Promise<void>((resolve) => {
    finishWait = resolve
    timer = setTimeout(resolve, 600)
  })
  finishWait = undefined
  if (!allowed.value)
    throw new Error(
      'There is unfinished work. Check “Allow this dialog to close” first.',
    )
}
onBeforeUnmount(() => {
  clearTimeout(timer)
  finishWait?.()
})
</script>

<template>
  <div class="dialog-close-guard-example">
    <s-button @click="visible = true">Try the close guard</s-button>
    <p role="status">Close checks: {{ checks }}</p>
    <s-dialog
      v-model="visible"
      global
      minimizable
      :width="460"
      title="Async close approval"
      :before-close="beforeClose"
    >
      <div class="close-guard-content">
        <p>
          Closing is rejected with a notification until permission is checked.
          You can also minimize the dialog and try closing its bubble.
        </p>
        <s-checkbox v-model="allowed">Allow this dialog to close</s-checkbox>
      </div>
    </s-dialog>
  </div>
</template>

<style scoped>
.dialog-close-guard-example,
.close-guard-content {
  display: grid;
  gap: 16px;
}
.dialog-close-guard-example {
  justify-items: start;
}
.dialog-close-guard-example p {
  margin: 0;
  line-height: 1.6;
}
</style>
