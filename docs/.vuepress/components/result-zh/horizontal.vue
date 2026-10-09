<script setup lang="ts">
import { shallowRef } from 'vue'
import { zhCn } from 'sax-design-vue/locales'
const acknowledged = shallowRef(false)
</script>

<template>
  <s-config-provider :locale="zhCn">
    <s-result
      layout="horizontal"
      status="info"
      title="结果已就绪"
      description="横向布局适合页面内的结果反馈，窄屏时会自动排列为上下结构。"
    >
      <template #extra
        ><s-button :disabled="acknowledged" @click="acknowledged = true">{{
          acknowledged ? '已确认' : '确认结果'
        }}</s-button></template
      >
    </s-result>
  </s-config-provider>
</template>

<style scoped>
.result-demo-stack {
  display: grid;
  gap: 24px;
  width: 100%;
}
.result-demo-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}
.result-reference {
  display: inline-block;
  margin-left: 12px;
  font-size: 12px;
  font-weight: 400;
  color: var(--sax-css-text-color-secondary);
}
.result-detail-list {
  margin: 0;
  padding: 16px 20px;
  display: grid;
  gap: 12px;
  border-radius: var(--sax-radius-lg);
  background: color-mix(in srgb, var(--sax-css-primary) 5%, transparent);
}
.result-detail-list div {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
}
.result-detail-list dt {
  color: var(--sax-css-text-color-secondary);
}
.result-detail-list dd {
  margin: 0;
}
</style>
