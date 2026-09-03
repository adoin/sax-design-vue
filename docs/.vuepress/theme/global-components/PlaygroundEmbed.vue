<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ClientOnly } from '@vuepress/client'
import { useClipboard } from '@vueuse/core'
import { useDocLocaleUi } from '../composables/docLocale'
import buttonEn from '../playground-starters/button.en.vue?raw'
import buttonZh from '../playground-starters/button.zh.vue?raw'
import ExampleSourceEditor from './ExampleSourceEditor.vue'
import LiveExamplePreview from './LiveExamplePreview.vue'

const { t, locale } = useDocLocaleUi()
const starterSource = computed(() =>
  locale.value === 'zh' ? buttonZh : buttonEn,
)
const editedSource = ref(starterSource.value)
const resetVersion = ref(0)
const { copied, copy } = useClipboard({ legacy: true })

const resetSource = () => {
  editedSource.value = starterSource.value
  resetVersion.value += 1
}

watch(starterSource, resetSource)
</script>

<template>
  <ClientOnly>
    <div class="playground-embed">
      <div class="playground-embed__toolbar">
        <strong>Button.vue</strong>
        <div class="playground-embed__actions">
          <s-button size="small" border @click="resetSource">
            {{ t.examples.resetExample }}
          </s-button>
          <s-button size="small" flat @click="copy(editedSource)">
            <s-icon :name="copied ? 'bx:check' : 'bx:copy'" />
            {{ copied ? t.examples.copied : t.examples.copyCode }}
          </s-button>
        </div>
      </div>

      <div class="playground-embed__body">
        <section class="playground-embed__editor">
          <header class="playground-embed__code-header">
            {{ t.examples.editorHint }}
          </header>
          <ExampleSourceEditor v-model="editedSource" aria-label="Button.vue" />
        </section>

        <LiveExamplePreview
          :source="editedSource"
          :scope-key="'button-starter-' + locale + '-' + resetVersion"
        />
      </div>
    </div>

    <template #fallback>
      <div class="playground-embed playground-embed--loading">
        {{ t.examples.loadingPlayground }}
      </div>
    </template>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.playground-embed {
  margin: 24px 0;
  overflow: hidden;
  border: 1px solid hsl(var(--sax-accent-color) / 0.18);
  border-radius: 18px;
  background: hsl(var(--sax-theme-layout));

  &--loading {
    padding: 24px;
    color: hsl(var(--sax-theme-color) / 0.72);
  }
}

.playground-embed__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid hsl(var(--sax-theme-color) / 0.08);
  color: hsl(var(--sax-theme-color));
}

.playground-embed__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;

  :deep(.s-button) {
    min-height: 44px;
    margin: 0;
  }
}

.playground-embed__body {
  display: grid;
  min-width: 0;
  grid-template-columns: minmax(0, 1fr);
}

.playground-embed__editor {
  display: flex;
  min-width: 0;
  min-height: 320px;
  flex-direction: column;
  border-bottom: 1px solid hsl(var(--sax-theme-color) / 0.08);
  background: hsl(var(--sax-theme-code));
}

.playground-embed__code-header {
  padding: 10px 16px;
  border-bottom: 1px solid rgb(255 255 255 / 0.08);
  color: rgb(255 255 255 / 0.72);
  font-size: 0.8rem;
}

@media (min-width: 960px) {
  .playground-embed__body {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  }

  .playground-embed__editor {
    border-right: 1px solid hsl(var(--sax-accent-color) / 0.12);
    border-bottom: 0;
  }
}
</style>
