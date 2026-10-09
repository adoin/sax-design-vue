<script setup lang="ts">
import { zhCn } from 'sax-design-vue/locales'
const sizes = [
  { value: 'small', label: '小尺寸' },
  { value: 'default', label: '标准尺寸' },
  { value: 'large', label: '大尺寸' },
] as const
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="result-demo-stack">
      <s-result
        v-for="item in sizes"
        :key="item.value"
        status="success"
        :size="item.value"
        :title="item.label"
        description="插画、文字与内容间距随尺寸一起调整。"
        :animated="false"
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
