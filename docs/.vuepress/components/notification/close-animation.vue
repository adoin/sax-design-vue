<script setup lang="ts">
import { onBeforeUnmount, shallowRef } from 'vue'
import { SNotification } from 'sax-design-vue'
import type { NotificationHandle } from 'sax-design-vue'

const animated = shallowRef(true)
const handles = new Set<NotificationHandle>()
const open = (automatic: boolean) => {
  const handle = SNotification({
    title: 'Notification',
    content: automatic
      ? 'This notification closes automatically after 3 seconds.'
      : 'Close this notification with its close button.',
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
    <s-switch v-model="animated">Particle close animation</s-switch>
    <div class="notification-animation-demo__actions">
      <s-button @click="open(false)">Manual close</s-button>
      <s-button flat @click="open(true)">Automatic close</s-button>
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
