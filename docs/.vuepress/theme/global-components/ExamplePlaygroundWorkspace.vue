<script setup lang="ts">
import { shallowRef } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useDocLocaleUi } from '../composables/docLocale'
import ExampleSourceEditor from './ExampleSourceEditor.vue'
import LiveExamplePreview from './LiveExamplePreview.vue'
import type { DocExampleRecord } from '../type'

defineProps<{
  example: DocExampleRecord
}>()

defineSlots<{
  actions(): unknown
}>()

const source = defineModel<string>({ required: true })
const copied = shallowRef(false)
const { t } = useDocLocaleUi()
const { copy } = useClipboard({ legacy: true })

const copySource = async () => {
  if (!source.value) return

  await copy(source.value)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1600)
}
</script>

<template>
  <div class="example-playground-workspace">
    <header class="example-playground-workspace__toolbar">
      <div class="example-playground-workspace__identity">
        <span>{{ t.examples.documentationExample }}</span>
        <strong>{{ example.component }} / {{ example.title }}</strong>
      </div>

      <div class="example-playground-workspace__actions">
        <button
          class="example-playground-workspace__copy"
          type="button"
          :class="{ copied }"
          @click="copySource"
        >
          <s-icon :name="copied ? 'bx:check' : 'bx:copy'" />
          {{ copied ? t.examples.copied : t.examples.copyCode }}
        </button>
        <slot name="actions" />
      </div>
    </header>

    <div class="example-playground-workspace__body">
      <section class="example-playground-workspace__editor">
        <header class="example-playground-workspace__code-header">
          <span>{{ example.id }}.vue</span>
          <span>{{ t.examples.loadedFromDocumentation }}</span>
        </header>
        <ExampleSourceEditor
          v-model="source"
          :aria-label="`${example.id}.vue`"
        />
      </section>

      <LiveExamplePreview :source="source" :scope-key="example.id" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.example-playground-workspace {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: clamp(560px, calc(100dvh - 250px), 760px);
  flex-direction: column;
  overflow: hidden;
  background: hsl(var(--sax-theme-layout) / 0.94);
}

.example-playground-workspace__toolbar,
.example-playground-workspace__code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 16px;
}

.example-playground-workspace__toolbar {
  min-height: 66px;
  flex: 0 0 auto;
  padding: 14px 20px;
  border-bottom: 1px solid hsl(var(--sax-accent-color) / 0.12);
}

.example-playground-workspace__identity {
  min-width: 0;

  span,
  strong {
    display: block;
  }

  span {
    color: hsl(var(--sax-theme-color) / 0.58);
    font-size: 0.75rem;
    font-weight: 600;
  }

  strong {
    overflow: hidden;
    margin-top: 2px;
    color: hsl(var(--sax-theme-color));
    font-size: 0.92rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.example-playground-workspace__actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
}

.example-playground-workspace__copy {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  border: 0;
  border-radius: 9px;
  background: hsl(var(--sax-accent-color) / 0.1);
  color: hsl(var(--sax-accent-color));
  font: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
}

.example-playground-workspace__copy:hover,
.example-playground-workspace__copy:focus-visible,
.example-playground-workspace__copy.copied {
  background: hsl(var(--sax-accent-color));
  color: #fff;
}

.example-playground-workspace__copy:focus-visible {
  outline: 2px solid hsl(var(--sax-accent-color) / 0.45);
  outline-offset: 2px;
}

.example-playground-workspace__body {
  display: grid;
  min-width: 0;
  min-height: 0;
  flex: 1;
  grid-template-rows: minmax(300px, 1fr) minmax(260px, 0.8fr);
}

.example-playground-workspace__editor {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  background: hsl(var(--sax-theme-code));
}

.example-playground-workspace__code-header {
  flex: 0 0 auto;
  color: rgba(255, 255, 255, 0.68);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.78rem;
  font-weight: 600;
}

.example-playground-workspace__code-header span:last-child {
  color: rgba(255, 255, 255, 0.42);
  font-weight: 500;
}

@media (min-width: 960px) {
  .example-playground-workspace__body {
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
    grid-template-rows: minmax(0, 1fr);
  }

  .example-playground-workspace__editor {
    border-right: 1px solid hsl(var(--sax-accent-color) / 0.12);
  }
}

@media (min-width: 1440px) {
  .example-playground-workspace__toolbar {
    padding-right: 24px;
    padding-left: 24px;
  }

  .example-playground-workspace__code-header,
  :deep(.live-example-preview > header) {
    padding-right: 20px;
    padding-left: 20px;
  }
}

@media (max-width: 560px) {
  .example-playground-workspace {
    min-height: 100%;
  }

  .example-playground-workspace__toolbar,
  .example-playground-workspace__code-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .example-playground-workspace__toolbar {
    padding: 12px 14px;
  }

  .example-playground-workspace__actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
