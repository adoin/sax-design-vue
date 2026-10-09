<script setup lang="ts">
import { shallowRef } from 'vue'
import { zhCn } from 'sax-design-vue/locales'
const animated = shallowRef(true)
const revision = shallowRef(0)
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="result-demo-stack">
      <div class="result-demo-controls">
        <s-switch v-model="animated" aria-label="启用入场动画"
          >启用入场动画</s-switch
        ><s-button size="small" type="flat" @click="revision++"
          >重新播放</s-button
        >
      </div>
      <s-result
        :key="revision"
        status="success"
        title="操作完成"
        description="确认标记出现后，图案保持稳定。"
        :animated="animated"
      />
    </div>
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
