<script setup lang="ts">
import { ref } from 'vue'
import type { AgentTask } from 'sax-design-vue'
const expanded = ref(false)
const status = ref<'pending' | 'approved' | 'rejected'>('pending')
const tasks: AgentTask[] = [
  { id: '1', title: '阅读文档', status: 'pending' },
  { id: '2', title: '撰写回答', status: 'pending' },
]
</script>

<template>
  <div class="agent-demo-shapes">
    <div class="agent-demo">
      <s-tag>圆角</s-tag>
      <s-plan-card
        v-model:expanded="expanded"
        shape="rounded"
        :status="status"
        :tasks="tasks"
        title="准备有来源支持的回答"
        description="先核对来源，再整理简洁回答。"
        content="收集两个独立来源，对照结论，并添加直接引用。"
        @approve="status = 'approved'"
        @reject="status = 'rejected'"
      /><s-button type="flat" @click="status = 'pending'">重置决定</s-button>
    </div>
    <div class="agent-demo">
      <s-tag>方角</s-tag>
      <s-plan-card
        v-model:expanded="expanded"
        shape="square"
        :status="status"
        :tasks="tasks"
        title="准备有来源支持的回答"
        description="先核对来源，再整理简洁回答。"
        content="收集两个独立来源，对照结论，并添加直接引用。"
        @approve="status = 'approved'"
        @reject="status = 'rejected'"
      /><s-button type="flat" @click="status = 'pending'">重置决定</s-button>
    </div>
  </div>
</template>

<style scoped>
.agent-demo {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  min-width: 0;
}
.agent-demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.agent-demo-shapes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 24px;
  width: 100%;
}
</style>
