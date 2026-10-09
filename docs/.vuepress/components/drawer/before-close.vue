<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
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
  if (!allowed.value) throw new Error('Allow closing first.')
}
onBeforeUnmount(() => {
  clearTimeout(timer)
  release?.()
})
</script>

<template>
  <div class="drawer-demo">
    <s-button @click="visible = true">Try async approval</s-button>
    <s-drawer
      v-model="visible"
      title="Close approval"
      :before-close="beforeClose"
      :mask-closable="allowMask"
    >
      <div class="drawer-fields">
        <s-checkbox v-model="allowed">Allow this drawer to close</s-checkbox
        ><s-checkbox v-model="allowMask">Allow overlay clicks</s-checkbox>
      </div>
      <template #footer="{ close, closePending }"
        ><s-button :disabled="closePending" @click="close()"
          >Request closing</s-button
        ></template
      >
    </s-drawer>
  </div>
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
