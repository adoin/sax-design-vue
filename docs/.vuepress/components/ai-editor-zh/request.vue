<script setup lang="ts">
import { ref } from 'vue'
import type { AiEditorInstance, AiEditorRequest } from 'sax-design-vue'
const editor = ref<AiEditorInstance>()
const text = ref(
  '可复用的组件应该让常用流程更简单，同时为应用自己的行为保留扩展空间。',
)
const rejectRequest = ref(false)
const request = async ({ selection, signal, report }: AiEditorRequest) => {
  report({ status: 'thinking' })
  await new Promise((resolve) => setTimeout(resolve, 500))
  if (signal.aborted) throw new Error('请求已取消')
  report({
    status: 'researching',
    sources: [{ label: '组件设计指南' }, { label: '文档上下文' }],
  })
  await new Promise((resolve) => setTimeout(resolve, 600))
  if (signal.aborted) throw new Error('请求已取消')
  if (rejectRequest.value)
    throw new Error('演示服务暂时不可用，请关闭模拟失败后重试。')
  return {
    text: `“${selection.text}”可以简化为：简化常用流程，并提供清晰的扩展入口。`,
    sources: [{ label: '组件设计指南' }],
  }
}
</script>

<template>
  <div class="request-demo">
    <div class="request-demo__controls">
      <s-button size="small" @click="editor?.select(0, text.length)"
        >选中整段</s-button
      >
      <s-checkbox v-model="rejectRequest">模拟请求失败</s-checkbox>
    </div>
    <s-ai-editor
      ref="editor"
      v-model="text"
      title="异步辅助"
      :request="request"
    />
  </div>
</template>

<style scoped>
.request-demo {
  display: grid;
  width: 100%;
  gap: 16px;
}
.request-demo__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
</style>
