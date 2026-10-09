<script setup lang="ts">
import { shallowRef } from 'vue'
import { zhCn } from 'sax-design-vue/locales'
const detailsVisible = shallowRef(false)
</script>

<template>
  <s-config-provider :locale="zhCn">
    <s-result status="info">
      <template #icon><s-icon name="cb:cloud-upload" :size="40" /></template>
      <template #title
        >文件已就绪<small class="result-reference">S-2048</small></template
      >
      <p>查看结果详情，或继续处理其他文件。</p>
      <template v-if="detailsVisible" #details
        ><dl class="result-detail-list">
          <div>
            <dt>状态</dt>
            <dd>已完成</dd>
          </div>
          <div>
            <dt>编号</dt>
            <dd>S-2048</dd>
          </div>
        </dl></template
      >
      <template #extra
        ><s-button
          :aria-expanded="detailsVisible"
          @click="detailsVisible = !detailsVisible"
          >{{ detailsVisible ? '收起详情' : '查看详情' }}</s-button
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
