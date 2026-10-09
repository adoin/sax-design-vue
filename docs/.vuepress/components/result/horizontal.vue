<script setup lang="ts">
import { shallowRef } from 'vue'
const acknowledged = shallowRef(false)
</script>

<template>
  <s-result
    layout="horizontal"
    status="info"
    title="Your result is ready"
    description="Horizontal layout fits inline result feedback and stacks vertically on small screens."
  >
    <template #extra
      ><s-button :disabled="acknowledged" @click="acknowledged = true">{{
        acknowledged ? 'Acknowledged' : 'Acknowledge'
      }}</s-button></template
    >
  </s-result>
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
