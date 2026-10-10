<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import type { AiEditorInstance } from 'sax-design-vue'
const editor = ref<AiEditorInstance>()
const mode = shallowRef('default')
const text = shallowRef('Select this sentence to try your assistant icon.')
const icon = computed(() =>
  mode.value === 'png'
    ? '/vue-logo.png'
    : mode.value === 'svg'
      ? '/vuesax-brand-dark.svg'
      : undefined,
)
</script>

<template>
  <div class="icon-demo">
    <div class="icon-options">
      <s-radio v-model="mode" value="default">Default SVG</s-radio>
      <s-radio v-model="mode" value="png">PNG file</s-radio>
      <s-radio v-model="mode" value="svg">SVG file</s-radio>
      <s-radio v-model="mode" value="slot">Inline SVG slot</s-radio>
      <s-button size="small" @click="editor?.select(0, text.length)"
        >Select text</s-button
      >
    </div>
    <s-ai-editor
      ref="editor"
      v-model="text"
      :ai-icon="icon"
      answer="Your assistant, your visual identity."
    >
      <template v-if="mode === 'slot'" #ai-icon>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        >
          <rect x="4" y="6" width="16" height="13" rx="4" />
          <path d="M12 3v3M8 11h.01M16 11h.01M9 15h6" stroke-linecap="round" />
        </svg>
      </template>
    </s-ai-editor>
  </div>
</template>

<style scoped>
.icon-demo {
  display: grid;
  gap: 16px;
  width: 100%;
}
.icon-options {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
</style>
