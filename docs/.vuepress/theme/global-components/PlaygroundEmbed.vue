<template>
  <div class="playground-embed">
    <div class="playground-embed__toolbar">
      <label>
        <span>Demo</span>
        <select v-model="activeDemo">
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
          <i :class="copied ? 'bx bx-check' : 'bx bx-copy'" />
          {{ copied ? 'Copied' : 'Copy code' }}
        </button>
        <a
          class="playground-embed__open"
          :href="fullPlaygroundUrl"
          target="_blank"
          rel="noopener"
        >
          Open full playground ↗
        </a>
      </div>
    </div>

    <div class="playground-embed__body">
      <section class="playground-embed__editor">
        <header class="playground-embed__code-header">
          <span>{{ activeDemo }}.vue</span>
          <span class="playground-embed__hint"
            >Edit code below — preview updates live</span
          >
        </header>
        <textarea
          v-model="editedSource"
          class="playground-embed__textarea"
          spellcheck="false"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
        />
      </section>

      <section class="playground-embed__preview">
        <header class="playground-embed__preview-header">Live preview</header>
        <div v-if="compileError" class="playground-embed__error">
          {{ compileError }}
        </div>
        <div class="playground-embed__preview-inner">
          <component
            :is="previewComponent"
            v-if="previewComponent"
            :key="previewKey"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { PLAY_DEMOS } from '../../../../play/demo-list'
import { compileDemoSfc } from '../utils/compile-demo-sfc'

import type { Component } from 'vue'

const rawSources = import.meta.glob('../../../../play/src/*.vue', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const siteBase = import.meta.env.BASE_URL || '/'
const playBase = `${siteBase.replace(/\/$/, '')}/play/`

const demos = PLAY_DEMOS.filter((name) => name !== 'App')

const activeDemo = ref('divider')
const editedSource = ref('')
const copied = ref(false)
const compileError = ref<string | null>(null)
const previewComponent = shallowRef<Component | null>(null)
const previewKey = ref(0)

const sourceMap = computed(() => {
  const map: Record<string, string> = {}
  for (const [path, code] of Object.entries(rawSources)) {
    const name = path.split('/').pop()?.replace('.vue', '') || ''
    map[name] = code
  }
  return map
})

const fullPlaygroundUrl = computed(() => `${playBase}#/${activeDemo.value}`)

const compilePreview = useDebounceFn((source: string, demo: string) => {
  const { component, error } = compileDemoSfc(source, demo)
  compileError.value = error
  previewComponent.value = component
  if (component) previewKey.value += 1
}, 250)

watch(
  activeDemo,
  (demo) => {
    editedSource.value = sourceMap.value[demo] || ''
  },
  { immediate: true }
)

watch([editedSource, activeDemo], ([source, demo]) => {
  compilePreview(source, demo)
})

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

.playground-embed__open {
  font-weight: 600;
  color: rgb(var(--sax-accent-color));
  text-decoration: none;
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

.playground-embed__preview {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 280px;
  background: radial-gradient(
      circle at 15% 20%,
      rgba(var(--sax-accent-color), 0.12),
      transparent 42%
    ),
    rgba(var(--sax-theme-bg), 0.95);
}

.playground-embed__preview-header {
  padding: 10px 14px;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(var(--sax-theme-color), 0.72);
  border-bottom: 1px solid rgba(var(--sax-theme-color), 0.08);
}

.playground-embed__error {
  margin: 12px 14px 0;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(239, 68, 68, 0.35);
  background: rgba(239, 68, 68, 0.08);
  color: #b91c1c;
  font-size: 0.78rem;
  line-height: 1.5;
  white-space: pre-wrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.playground-embed__preview-inner {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  padding: 24px;
  width: 100%;
}
</style>

<style lang="scss">
.playground-embed__preview-inner .play-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>
