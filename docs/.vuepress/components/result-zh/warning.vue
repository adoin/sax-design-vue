<script setup lang="ts">
import { shallowRef } from 'vue'
import { zhCn } from 'sax-design-vue/locales'
const acknowledged = shallowRef(false)
</script>

<template>
  <s-config-provider :locale="zhCn">
    <s-result
      :status="acknowledged ? 'success' : 'warning'"
      :title="acknowledged ? '确认完成' : '请确认后继续'"
      description="继续之前，请确认相关信息，避免重复操作。"
    >
      <template #extra
        ><s-button :disabled="acknowledged" @click="acknowledged = true"
          >确认继续</s-button
        ><s-button type="flat" @click="acknowledged = false"
          >重置</s-button
        ></template
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
