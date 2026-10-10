<script setup lang="ts">
import { ref } from 'vue'
import type { AiEditorInstance } from 'sax-design-vue'
const editor = ref<AiEditorInstance>()
const text = ref(
  '本周完成了客户门户的登录改版，灰度覆盖 30% 的用户，登录成功率由 96.8% 提升至 99.2%。\n\n项目进展：完成单点登录接入与异常监控，客服工单较上周减少 18%。剩余的旧账号迁移将在下周三完成。\n\n风险与计划：少量企业账号仍依赖旧权限模型。下周将先补齐迁移校验，再扩大灰度，并在周五复盘转化数据。',
)
const answer =
  '本周交付客户门户登录改版，已覆盖 30% 用户；登录成功率提升 2.4 个百分点，达到 99.2%。'
const selectSentence = () => {
  const end = text.value.search(/[!?。！？]|\.(?=\s|$)/)
  editor.value?.select(0, end < 0 ? Math.min(36, text.value.length) : end + 1)
}
</script>

<template>
  <div class="editor-demo">
    <s-button size="small" @click="selectSentence">选中第一句话</s-button>
    <s-ai-editor
      ref="editor"
      v-model="text"
      title="客户门户 · 本周工作汇报"
      :answer="answer"
    />
  </div>
</template>

<style scoped>
.editor-demo {
  display: grid;
  width: 100%;
  gap: 16px;
}
.editor-demo > .s-button {
  justify-self: start;
}
</style>
