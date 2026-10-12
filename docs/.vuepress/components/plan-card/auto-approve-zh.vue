<script setup lang="ts">
import { ref } from 'vue'
import type { AgentTask } from 'sax-design-vue'
const expanded = ref(false)
const status = ref<'pending' | 'approved' | 'rejected'>('pending')
const run = ref(0)
const tasks: AgentTask[] = [
  { id: '0', title: '提取文档页面内容', status: 'pending' },
  { id: '1', title: '建立全文检索索引', status: 'pending' },
  { id: '2', title: '添加搜索接口', status: 'pending' },
  { id: '3', title: '接入搜索快捷键', status: 'pending' },
  { id: '4', title: '优化缓存策略', status: 'pending' },
  { id: '5', title: '验证搜索结果排序', status: 'pending' },
]
function replay() {
  status.value = 'pending'
  run.value++
}
</script>
<template>
  <div class="agent-demo">
    <s-plan-card
      :key="run"
      v-model:expanded="expanded"
      :status="status"
      :tasks="tasks"
      :auto-approve="5"
      title="为文档接入全文搜索"
      description="索引所有文档页面，按标题和正文相关度排序，并缓存搜索结果。"
      content="使用统一索引提供检索接口，为搜索面板返回带摘要的结果。"
      @approve="status = 'approved'"
      @reject="status = 'rejected'"
    />
    <div class="agent-demo-actions">
      <s-button type="flat" @click="replay">重播倒计时</s-button>
    </div>
  </div>
</template>
<style scoped>
.agent-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  min-width: 0;
}
.agent-demo-actions {
  display: flex;
  align-items: center;
}
</style>
