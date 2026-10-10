<script setup lang="ts">
import { ref } from 'vue'
import type { AiEditorInstance, AiEditorRequest } from 'sax-design-vue'
const editor = ref<AiEditorInstance>()
const text = ref(
  '下周计划：继续推进客户门户发布，补齐权限迁移，观察登录数据，并向业务团队同步进展。',
)
async function* request({ signal, report }: AiEditorRequest) {
  report({ status: 'researching', sources: [{ label: '周度项目计划' }] })
  const answer =
    '下周重点分为三项：\n1. 周三前完成 12 家企业客户的权限迁移与联合验收。\n2. 灰度从 30% 扩大至 60%，持续观察登录成功率与异常告警。\n3. 周五提交发布评估，向业务团队同步结果、风险和下一步安排。'
  const pieces = answer.match(/.{1,8}/g) || []
  for (const piece of pieces) {
    await new Promise((resolve) => setTimeout(resolve, 120))
    if (signal.aborted) return
    yield piece
  }
}
</script>

<template>
  <div class="stream-demo">
    <s-button size="small" @click="editor?.select(0, text.length)"
      >选中整段</s-button
    >
    <s-ai-editor
      ref="editor"
      v-model="text"
      title="补充下周行动计划"
      :request="request"
    />
  </div>
</template>

<style scoped>
.stream-demo {
  display: grid;
  width: 100%;
  gap: 16px;
}
.stream-demo > .s-button {
  justify-self: start;
}
</style>
