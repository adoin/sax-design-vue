<script setup lang="ts">
import { ref } from 'vue'
import type { AiEditorInstance } from 'sax-design-vue'
const editor = ref<AiEditorInstance>()
const text = ref(
  '好的文档会给每个想法留一点思考的空间。选中一句话，可以调整强调方式、解释含义，或探索另一种表达。\n\n编辑器将正文和行内格式分开保存，让它们都能跟随文档持久化。',
)
const answer =
  '先表达一个清晰的观点，再用一句简短的话补充说明。这样既能保留原意，也能让段落更易阅读。'
const selectSentence = () => {
  const end = text.value.search(/[.!?。！？]/)
  editor.value?.select(0, end < 0 ? Math.min(36, text.value.length) : end + 1)
}
</script>

<template>
  <div class="editor-demo">
    <s-button size="small" @click="selectSentence">选中第一句话</s-button>
    <s-ai-editor
      ref="editor"
      v-model="text"
      title="留一点思考的空间"
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
