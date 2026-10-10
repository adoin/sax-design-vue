<script setup lang="ts">
import { ref } from 'vue'
import type { AiEditorInstance, AiEditorRequest } from 'sax-design-vue'
const editor = ref<AiEditorInstance>()
const text = ref(
  '当前风险：12 家企业客户尚未完成权限迁移，可能影响下周的全量发布。计划由客户成功团队逐一确认账号映射，研发提供迁移校验工具，周三前完成联合验收。',
)
const rejectRequest = ref(false)
const request = async ({ signal, report }: AiEditorRequest) => {
  report({ status: 'thinking' })
  await new Promise((resolve) => setTimeout(resolve, 500))
  if (signal.aborted) throw new Error('请求已取消')
  report({
    status: 'researching',
    sources: [{ label: '项目进度台账' }, { label: '权限迁移清单' }],
  })
  await new Promise((resolve) => setTimeout(resolve, 600))
  if (signal.aborted) throw new Error('请求已取消')
  if (rejectRequest.value)
    throw new Error('演示服务暂时不可用，请关闭模拟失败后重试。')
  return {
    text: '当前风险：12 家企业客户的权限迁移尚未完成。应对措施：客户成功团队确认账号映射，研发补齐校验工具；双方在周三前联合验收，验收通过后再扩大灰度。',
    sources: [{ label: '项目进度台账' }],
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
      title="完善风险与应对措施"
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
