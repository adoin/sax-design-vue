<script setup lang="ts">
import { ref } from 'vue'
import { zhCn } from 'sax-design-vue/locales'
const visible = ref(false)
const size = ref<string | number>(420)
const eventText = ref('')
const update = (event: { size: number }) => {
  eventText.value = `当前尺寸: ${event.size}px`
}
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="drawer-demo">
      <s-button @click="visible = true">打开可调整尺寸的抽屉</s-button>
      <s-drawer
        v-model="visible"
        v-model:size="size"
        title="可调整尺寸的抽屉"
        resizable
        :min-size="260"
        max-size="80%"
        resize-label="调整抽屉尺寸"
        @resize="update"
      >
        <p>
          拖动边缘，或聚焦后使用方向键。Shift 增大步长，Home 和 End
          移动到最小和最大尺寸。
        </p>
        <p role="status">{{ eventText }}</p>
        <template #footer="{ close }"
          ><s-button @click="close()">关闭</s-button></template
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
</style>
