<template>
  <ClientOnly>
    <div v-if="example" class="example-playground">
      <header class="example-playground__toolbar">
        <div class="example-playground__identity">
          <span>{{ t.examples.documentationExample }}</span>
          <strong>{{ example.component }} / {{ example.title }}</strong>
        </div>
        <button
          class="example-playground__copy"
          type="button"
          :class="{ copied }"
          @click="copySource"
        >
          <s-icon :name="copied ? 'bx:check' : 'bx:copy'" />
          {{ copied ? t.examples.copied : t.examples.copyCode }}
        </button>
      </header>

      <div class="example-playground__body">
        <section class="example-playground__editor">
          <header class="example-playground__code-header">
            <span>{{ example.id }}.vue</span>
            <span>{{ t.examples.loadedFromDocumentation }}</span>
          </header>
          <textarea
            v-model="editedSource"
            class="example-playground__textarea"
            spellcheck="false"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
          />
        </section>

        <LiveExamplePreview :source="editedSource" :scope-key="example.id" />
      </div>
    </div>

    <div v-else class="example-playground example-playground--missing">
      <strong>{{ t.examples.unavailable }}</strong>
      <p>{{ t.examples.unavailableDescription }}</p>
    </div>

    <template #fallback>
      <div class="example-playground example-playground--missing">
        {{ t.examples.loadingExample }}
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ClientOnly } from '@vuepress/client'
import { useDocLocaleUi } from '../composables/docLocale'
import LiveExamplePreview from './LiveExamplePreview.vue'

interface DocExampleRecord {
  id: string
  component: string
  section: string
  title: string
  source: string
}

const copied = ref(false)
const { t } = useDocLocaleUi()

const readExample = (): DocExampleRecord | null => {
  if (typeof window === 'undefined') return null

  const exampleId = new URLSearchParams(window.location.search).get('exampleId')
  if (!exampleId) return null

  try {
    const raw = window.sessionStorage.getItem(`sax-doc-example:${exampleId}`)
    if (!raw) return null
    const value = JSON.parse(raw) as DocExampleRecord
    return value.id === exampleId && value.source ? value : null
  } catch {
    return null
  }
}

const example = ref<DocExampleRecord | null>(readExample())
const editedSource = ref(example.value?.source || '')

const copySource = async () => {
  try {
    await navigator.clipboard.writeText(editedSource.value)
    copied.value = true
    window.setTimeout(() => {
      copied.value = false
    }, 1600)
  } catch {
    /* clipboard unavailable */
  }
}
</script>

<style lang="scss" scoped>
.example-playground {
  margin: 14px auto 30px;
  overflow: hidden;
  border: 1px solid hsl(var(--sax-accent-color) / 0.13);
  border-radius: 20px;
  background: hsl(var(--sax-theme-layout) / 0.88);
  box-shadow: 0 20px 60px rgba(55, 43, 145, 0.12);
}

.example-playground__toolbar,
.example-playground__code-header,
.example-playground__preview > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 16px;
}

.example-playground__toolbar {
  min-height: 66px;
  padding: 14px 20px;
  border-bottom: 1px solid hsl(var(--sax-accent-color) / 0.12);
}

.example-playground__identity {
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

.example-playground__copy {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
  min-height: 36px;
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

.example-playground__copy:hover,
.example-playground__copy.copied {
  background: hsl(var(--sax-accent-color));
  color: #fff;
}

.example-playground__body {
  display: grid;
  min-height: clamp(560px, calc(100vh - 250px), 760px);
  grid-template-rows: minmax(300px, 1fr) minmax(260px, 0.8fr);
}

.example-playground__editor,
.example-playground__preview {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.example-playground__editor {
  background: hsl(var(--sax-theme-code));
}

.example-playground__code-header {
  color: rgba(255, 255, 255, 0.68);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.78rem;
  font-weight: 600;
}

.example-playground__code-header span:last-child {
  color: rgba(255, 255, 255, 0.42);
  font-weight: 500;
}

.example-playground__textarea {
  width: 100%;
  min-height: 0;
  flex: 1;
  margin: 0;
  padding: 16px;
  border: 0;
  resize: vertical;
  background: transparent;
  color: #e2e8f0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8rem;
  line-height: 1.6;

  &:focus {
    outline: none;
  }
}

.example-playground--missing {
  padding: 28px;
  color: hsl(var(--sax-theme-color));

  p {
    margin-bottom: 0;
    color: hsl(var(--sax-theme-color) / 0.66);
  }
}

@media (min-width: 960px) {
  .example-playground__body {
    grid-template-columns: minmax(540px, 1.08fr) minmax(460px, 0.92fr);
    grid-template-rows: minmax(560px, 1fr);
  }

  .example-playground__editor {
    border-right: 1px solid hsl(var(--sax-accent-color) / 0.12);
  }
}

@media (min-width: 1440px) {
  .example-playground__toolbar {
    padding-right: 24px;
    padding-left: 24px;
  }

  .example-playground__code-header,
  :deep(.live-example-preview > header) {
    padding-right: 20px;
    padding-left: 20px;
  }

  .example-playground__textarea {
    padding: 20px 22px;
    font-size: 0.84rem;
  }
}

@media (max-width: 560px) {
  .example-playground__toolbar,
  .example-playground__code-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
