<script setup lang="ts">
import { ref } from 'vue'
import { zhCn } from 'sax-design-vue/locales'
import type { DrawerPlacement } from 'sax-design-vue'
const visible = ref(false)
const placement = ref<DrawerPlacement>('right')
const size = ref<string | number>('360px')
const directions = [
  { value: 'left', label: '左侧' },
  { value: 'right', label: '右侧' },
  { value: 'top', label: '顶部' },
  { value: 'bottom', label: '底部' },
]
const sizes = [
  { value: '360px', label: '默认' },
  { value: 'large', label: '大尺寸' },
  { value: '50%', label: '视口一半' },
]
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="drawer-demo">
      <s-select v-model="placement" :options="directions" label="方向" />
      <s-select v-model="size" :options="sizes" label="尺寸" />
      <s-button @click="visible = true">打开所选方向</s-button>
      <s-drawer
        v-model="visible"
        :placement="placement"
        :size="size"
        title="方向与尺寸"
      >
        <p>左右抽屉调整宽度，上下抽屉调整高度。</p>
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
</style>
