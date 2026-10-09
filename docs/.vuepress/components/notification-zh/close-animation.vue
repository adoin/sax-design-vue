<script setup lang="ts">
import { onBeforeUnmount, shallowRef } from 'vue'
import { SNotification } from 'sax-design-vue'
import type { NotificationHandle } from 'sax-design-vue'

const animated = shallowRef(true)
const handles = new Set<NotificationHandle>()
const open = (automatic: boolean) => {
  const handle = SNotification({
    title: '通知',
    content: automatic
      ? '这条通知会在 3 秒后自动关闭。'
      : '点击通知上的关闭按钮即可关闭。',
    duration: automatic ? 3000 : 0,
    closeAnimation: animated.value,
    closeAnimationDuration: 220,
    onClose: () => handles.delete(handle),
  })
  handles.add(handle)
}
onBeforeUnmount(() => handles.forEach((handle) => handle.close()))
</script>

<template>
  <div class="notification-animation-demo">
    <s-switch v-model="animated">粒子关闭动画</s-switch>
    <div class="notification-animation-demo__actions">
      <s-button @click="open(false)">手动关闭</s-button>
      <s-button flat @click="open(true)">自动关闭</s-button>
    </div>
  </div>
</template>

<style scoped>
.notification-animation-demo {
  display: grid;
  justify-items: start;
  gap: 16px;
}
.notification-animation-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
