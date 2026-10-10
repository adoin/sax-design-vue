<script setup lang="ts">
import { ref } from 'vue'
import type { AiEditorInstance, AiEditorMark } from 'sax-design-vue'
const editor = ref<AiEditorInstance>()
const text = ref(
  'Key results: sign-in success reached 99.2% and support tickets fell 18%.\n\nCurrent risk: 12 enterprise customers still need permission migration before the rollout expands.\n\nNext week: complete migration checks on Wednesday and assess full-release readiness on Friday.',
)
const answer =
  'The sign-in redesign improved this week’s results: success reached 99.2%, while support tickets fell 18%.'
const marks = ref<AiEditorMark[]>([{ start: 0, end: 11, format: 'bold' }])
</script>

<template>
  <div class="format-demo">
    <s-button size="small" @click="editor?.select(0, text.indexOf('\n\n'))"
      >Select key results</s-button
    >
    <s-ai-editor
      ref="editor"
      v-model="text"
      v-model:marks="marks"
      :answer="answer"
      title="Highlight results and risks"
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
