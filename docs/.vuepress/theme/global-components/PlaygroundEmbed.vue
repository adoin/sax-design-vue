<template>
  <ClientOnly>
    <div class="playground-embed">
      <div class="playground-embed__toolbar">
        <label>
          <span>{{ t.examples.demo }}</span>
          <select :value="activeDemo" @change="onDemoSelect">
            <option v-for="demo in demos" :key="demo" :value="demo">
              {{ demo }}
            </option>
          </select>
        </label>
        <div class="playground-embed__actions">
          <button
            class="playground-embed__copy"
            type="button"
            :class="{ copied }"
            @click="copySource"
          >
            <s-icon :name="copied ? 'bx:check' : 'bx:copy'"  />
            {{ copied ? t.examples.copied : t.examples.copyCode }}
          </button>
        </div>
      </div>

      <div class="playground-embed__body">
        <section class="playground-embed__editor">
          <header class="playground-embed__code-header">
            <span>{{ activeDemo }}.vue</span>
            <span class="playground-embed__hint">{{
              t.examples.editorHint
            }}</span>
          </header>
          <textarea
            :key="activeDemo"
            v-model="editedSource"
            class="playground-embed__textarea"
            spellcheck="false"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
          />
        </section>

        <LiveExamplePreview
          :source="editedSource"
          :scope-key="`catalog-${activeDemo}`"
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

<script setup lang="ts">
import { ref } from 'vue'
import { ClientOnly } from '@vuepress/client'
import {
  PLAYGROUND_DEMOS,
  getDemoSource,
  isPlayDemo,
} from '../../../../play/demo-sources'
import { useDocLocaleUi } from '../composables/docLocale'
import LiveExamplePreview from './LiveExamplePreview.vue'

const { t } = useDocLocaleUi()

const props = withDefaults(
  defineProps<{
    initialDemo?: string
  }>(),
  {
    initialDemo: 'alert',
  },
)

const demos = PLAYGROUND_DEMOS

const resolveInitialDemo = (): string => {
  if (typeof window === 'undefined') {
    return props.initialDemo
  }

  const params = new URLSearchParams(window.location.search)
  const fromQuery = params.get('demo')
  if (fromQuery && isPlayDemo(fromQuery) && fromQuery !== 'App') {
    return fromQuery
  }

  if (isPlayDemo(props.initialDemo) && props.initialDemo !== 'App') {
    return props.initialDemo
  }

  return 'alert'
}

const activeDemo = ref(resolveInitialDemo())
const editedSource = ref(getDemoSource(activeDemo.value))
const copied = ref(false)
const loadDemo = (demo: string) => {
  if (!isPlayDemo(demo) || demo === 'App' || demo === activeDemo.value) {
    return
  }

  activeDemo.value = demo
  editedSource.value = getDemoSource(demo)
}

const onDemoSelect = (event: Event) => {
  const demo = (event.target as HTMLSelectElement).value
  loadDemo(demo)
}

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
.playground-embed {
  margin: 24px 0;
  border: 1px solid rgba(var(--sax-accent-color), 0.18);
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(
    145deg,
    rgba(var(--sax-theme-layout), 0.98),
    rgba(var(--sax-accent-color), 0.06)
  );
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);

  &--loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 240px;
    padding: 24px;
    color: rgba(var(--sax-theme-color), 0.72);
    font-weight: 600;
  }
}

.playground-embed__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(var(--sax-theme-color), 0.08);
  background: rgba(var(--sax-theme-layout), 0.9);

  label {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    color: rgb(var(--sax-theme-color));
  }

  select {
    min-width: 160px;
    padding: 8px 12px;
    border-radius: 10px;
    border: 1px solid rgba(var(--sax-theme-color), 0.12);
    background: rgba(var(--sax-theme-bg), 0.8);
    color: rgb(var(--sax-theme-color));
  }
}

.playground-embed__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.playground-embed__copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(var(--sax-theme-color), 0.12);
  background: rgba(var(--sax-theme-bg), 0.85);
  color: rgb(var(--sax-theme-color));
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover,
  &.copied {
    border-color: rgba(var(--sax-accent-color), 0.35);
    color: rgb(var(--sax-accent-color));
  }
}

.playground-embed__body {
  display: flex;
  flex-direction: column;
  min-height: 560px;
}

.playground-embed__editor {
  display: flex;
  flex-direction: column;
  min-height: 240px;
  border-bottom: 1px solid rgba(var(--sax-theme-color), 0.08);
  background: rgb(var(--sax-theme-code));
}

.playground-embed__code-header {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.72);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.playground-embed__hint {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.45);
}

.playground-embed__textarea {
  flex: 1;
  width: 100%;
  min-height: 220px;
  margin: 0;
  padding: 14px;
  border: 0;
  resize: vertical;
  overflow: auto;
  font-size: 0.8rem;
  line-height: 1.55;
  color: #e2e8f0;
  background: transparent;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  &:focus {
    outline: none;
  }
}
</style>
