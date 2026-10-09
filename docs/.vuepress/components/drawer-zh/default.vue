<script setup lang="ts">
import { ref } from 'vue'
import { zhCn } from 'sax-design-vue/locales'
const visible = ref(false)
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="drawer-demo">
      <s-button @click="visible = true">打开抽屉</s-button>
      <s-drawer v-model="visible" title="工作区设置">
        <p>将相关设置保留在当前任务附近。</p>
        <template #footer="{ close }"
          ><s-button @click="close()">完成</s-button></template
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
