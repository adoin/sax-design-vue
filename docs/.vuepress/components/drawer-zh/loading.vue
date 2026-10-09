<script setup lang="ts">
import { ref } from 'vue'
import { zhCn } from 'sax-design-vue/locales'
const visible = ref(false)
const loading = ref(true)
const input = ref('')
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="drawer-demo">
      <s-button @click="visible = true">打开加载示例</s-button>
      <s-drawer v-model="visible" title="加载反馈" :loading="loading">
        <template #extra
          ><s-switch v-model="loading">加载状态</s-switch></template
        >
        <s-input v-model="input" label="保留的输入" block />
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
