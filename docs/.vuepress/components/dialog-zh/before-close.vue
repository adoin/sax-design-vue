<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import type { DialogBeforeCloseFn } from 'sax-design-vue'
const visible = ref(false)
const allowed = ref(false)
const maskClosable = ref(false)
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
    throw new Error('还有未完成的操作，请先勾选“允许关闭此弹窗”。')
}
onBeforeUnmount(() => {
  clearTimeout(timer)
  finishWait?.()
})
</script>

<template>
  <div class="dialog-close-guard-example">
    <s-button @click="visible = true">体验关闭校验</s-button>
    <p role="status">关闭校验次数： {{ checks }}</p>
    <s-dialog
      v-model="visible"
      global
      minimizable
      :width="460"
      title="关闭前异步校验"
      :before-close="beforeClose"
      :mask-closable="maskClosable"
    >
      <div class="close-guard-content">
        <p>
          未勾选时，关闭会被拒绝并弹出原因；勾选后才能关闭。也可以最小化后点击气泡的关闭按钮。
        </p>
        <s-checkbox v-model="allowed">允许关闭此弹窗</s-checkbox>
        <s-checkbox v-model="maskClosable">允许点击遮罩申请关闭</s-checkbox>
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
