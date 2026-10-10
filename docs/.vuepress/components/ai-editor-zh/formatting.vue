<script setup lang="ts">
import { ref } from 'vue'
import type { AiEditorInstance, AiEditorMark } from 'sax-design-vue'
const editor = ref<AiEditorInstance>()
const text = ref(
  '关键成果：登录成功率提升至 99.2%，客服工单减少 18%。\n\n当前风险：12 家企业客户尚未完成权限迁移，需要在扩大灰度前逐一确认。\n\n下周计划：周三完成账号迁移校验，周五评估全量发布条件。',
)
const answer = '本周登录体验明显改善：成功率达到 99.2%，客服工单下降 18%。'
const marks = ref<AiEditorMark[]>([{ start: 0, end: 4, format: 'bold' }])
</script>

<template>
  <div class="format-demo">
    <s-button size="small" @click="editor?.select(0, text.indexOf('\n\n'))"
      >选中关键成果</s-button
    >
    <s-ai-editor
      ref="editor"
      v-model="text"
      v-model:marks="marks"
      :answer="answer"
      title="突出成果与风险"
    />
    <div class="format-demo__marks">
      <s-tag v-for="(mark, index) in marks" :key="index" color="primary"
        >{{ mark.format }} · {{ mark.start }}–{{ mark.end }}</s-tag
      >
      <span v-if="!marks.length">暂无行内格式</span>
    </div>
  </div>
</template>

<style scoped>
.format-demo {
  display: grid;
  width: 100%;
  gap: 16px;
}
.format-demo > .s-button {
  justify-self: start;
}
.format-demo__marks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13px;
}
</style>
