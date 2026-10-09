<script setup lang="ts">
import { ref } from 'vue'
import type { DrawerPlacement } from 'sax-design-vue'
const visible = ref(false)
const placement = ref<DrawerPlacement>('right')
const size = ref<string | number>('360px')
const directions = ['left', 'right', 'top', 'bottom'].map((value) => ({
  value,
  label: value,
}))
const sizes = [
  { value: '360px', label: 'Default' },
  { value: 'large', label: 'Large' },
  { value: '50%', label: 'Half the viewport' },
]
</script>

<template>
  <div class="drawer-demo">
    <s-select v-model="placement" :options="directions" label="Placement" />
    <s-select v-model="size" :options="sizes" label="Size" />
    <s-button @click="visible = true">Open selected placement</s-button>
    <s-drawer
      v-model="visible"
      :placement="placement"
      :size="size"
      title="Placement and size"
    >
      <p>Horizontal drawers use width; vertical drawers use height.</p>
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
</style>
