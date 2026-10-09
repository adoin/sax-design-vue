<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { zhCn } from 'sax-design-vue/locales'
import type { DrawerBeforeCloseFn } from 'sax-design-vue'
const visible = ref(false)
const allowed = ref(false)
const allowMask = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
let release: (() => void) | undefined
const beforeClose: DrawerBeforeCloseFn = async () => {
  await new Promise<void>((resolve) => {
    release = resolve
    timer = setTimeout(resolve, 450)
  })
  release = undefined
  if (!allowed.value) throw new Error('请先允许关闭。')
}
onBeforeUnmount(() => {
  clearTimeout(timer)
  release?.()
})
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="drawer-demo">
      <s-button @click="visible = true">体验异步校验</s-button>
      <s-drawer
        v-model="visible"
        title="关闭校验"
        :before-close="beforeClose"
        :mask-closable="allowMask"
      >
        <div class="drawer-fields">
          <s-checkbox v-model="allowed">允许关闭此抽屉</s-checkbox
          ><s-checkbox v-model="allowMask">允许点击遮罩申请关闭</s-checkbox>
        </div>
        <template #footer="{ close, closePending }"
          ><s-button :disabled="closePending" @click="close()"
            >申请关闭</s-button
          ></template
        >
      </s-drawer>
    </div>
  </s-config-provider>
</template>

<style scoped>
.drawer-demo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.drawer-fields {
  display: grid;
  gap: 16px;
}
</style>
