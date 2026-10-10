<script setup lang="ts">
import { ref } from 'vue'
import type { AiEditorInstance, AiEditorRequest } from 'sax-design-vue'
const editor = ref<AiEditorInstance>()
const text = ref('流式回答可以逐步到达，让读者始终看到正在讨论的原文。')
async function* request({ signal, report }: AiEditorRequest) {
  report({ status: 'researching', sources: [{ label: '当前原文' }] })
  const answer =
    '保留原文可见，以小段、易读的内容逐步呈现新信息，并给读者一个明确的停止或应用回答的入口。'
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
      title="逐步显示回答"
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
