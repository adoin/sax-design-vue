<script setup lang="ts">
import { ref } from 'vue'
import type { AiEditorInstance, AiEditorMark } from 'sax-design-vue'
const editor = ref<AiEditorInstance>()
const text = ref(
  'Keep the important words visible. Formats can overlap without changing the underlying text.',
)
const marks = ref<AiEditorMark[]>([{ start: 0, end: 4, format: 'bold' }])
</script>

<template>
  <div class="format-demo">
    <s-button size="small" @click="editor?.select(0, 4)"
      >Select the opening words</s-button
    >
    <s-ai-editor
      ref="editor"
      v-model="text"
      v-model:marks="marks"
      title="Controlled inline formatting"
    />
    <div class="format-demo__marks">
      <s-tag v-for="(mark, index) in marks" :key="index" color="primary"
        >{{ mark.format }} · {{ mark.start }}–{{ mark.end }}</s-tag
      >
      <span v-if="!marks.length">No inline formatting</span>
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
