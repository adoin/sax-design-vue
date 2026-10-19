<script setup lang="ts">
import { reactive, shallowRef } from 'vue'
import { SInput, SWindow } from 'sax-design-vue'
import type { WindowRect } from 'sax-design-vue'
const active = shallowRef(1)
const windows = reactive([
  {
    id: 1,
    title: 'Order draft',
    text: '',
    rect: { x: 12, y: 12, width: 320, height: 210 } as WindowRect,
  },
  {
    id: 2,
    title: 'Working notes',
    text: '',
    rect: { x: 180, y: 150, width: 320, height: 210 } as WindowRect,
  },
])
</script>

<template>
  <div class="window-workspace">
    <SWindow
      v-for="item in windows"
      :key="item.id"
      v-model:rect="item.rect"
      v-model:title="item.title"
      :active="active === item.id"
      :z-index="active === item.id ? 2 : 1"
      :min-width="240"
      :min-height="160"
      title-editable
      @activate="active = item.id"
    >
      <div class="window-content">
        <SInput
          v-model="item.text"
          block
          :placeholder="'Type, then move this window'"
          :aria-label="item.title"
        />
      </div>
    </SWindow>
  </div>
</template>

<style scoped>
.window-workspace {
  position: relative;
  height: 400px;
  isolation: isolate;
}
.window-content {
  padding: 16px;
}
</style>
