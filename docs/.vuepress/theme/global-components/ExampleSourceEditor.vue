<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { highlightVueSource } from '../util/highlightVueSource'

const model = defineModel<string>({ required: true })

defineProps<{
  ariaLabel: string
}>()

const highlightedSegments = computed(() => highlightVueSource(model.value))
const highlightRef = useTemplateRef<HTMLElement>('highlight')

const syncScroll = (event: Event) => {
  const textarea = event.currentTarget as HTMLTextAreaElement
  const highlight = highlightRef.value
  if (!highlight) return

  highlight.scrollTop = textarea.scrollTop
  highlight.scrollLeft = textarea.scrollLeft
}
</script>

<template>
  <div class="example-source-editor">
    <pre
      ref="highlight"
      class="example-source-editor__highlight language-markup"
      aria-hidden="true"
    ><code><span
      v-for="(segment, index) in highlightedSegments"
      :key="index"
      :class="segment.classes"
    >{{ segment.text }}</span></code></pre>
    <textarea
      v-model="model"
      class="example-source-editor__textarea"
      :aria-label="ariaLabel"
      spellcheck="false"
      autocapitalize="off"
      autocomplete="off"
      autocorrect="off"
      @scroll="syncScroll"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '../styles/syntax-tokens' as *;

.example-source-editor {
  position: relative;
  min-width: 0;
  min-height: 0;
  flex: 1;
  overflow: hidden;
  background: hsl(var(--sax-theme-code));
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8rem;
  line-height: 1.6;
  tab-size: 2;

  &:focus-within {
    box-shadow: inset 0 0 0 2px hsl(var(--sax-accent-color) / 0.6);
  }
}

.example-source-editor__highlight,
.example-source-editor__textarea {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 16px;
  overflow: auto;
  border: 0;
  border-radius: 0;
  font: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  tab-size: inherit;
  white-space: pre;
  word-break: normal;
  overflow-wrap: normal;
}

.example-source-editor__highlight {
  z-index: 0;
  pointer-events: none;
  background: transparent;
  color: #e2e8f0;

  code {
    display: block;
    min-width: max-content;
    color: inherit;
    font: inherit;
    line-height: inherit;
  }

  @include syntax-tokens(true);
}

.example-source-editor__textarea {
  z-index: 1;
  resize: none;
  background: transparent;
  caret-color: #f8fafc;
  color: transparent;
  outline: none;
  -webkit-text-fill-color: transparent;

  &::selection {
    background: hsl(var(--sax-accent-color) / 0.42);
    color: transparent;
    -webkit-text-fill-color: transparent;
  }
}

@media (min-width: 1440px) {
  .example-source-editor {
    font-size: 0.84rem;
  }

  .example-source-editor__highlight,
  .example-source-editor__textarea {
    padding: 20px 22px;
  }
}
</style>
