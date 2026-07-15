<template>
  <div
    class="playground-shell"
    :class="{
      'playground-shell--index': isIndex,
      'playground-shell--preview-only': previewOnly,
    }"
  >
    <template v-if="isIndex">
      <slot />
    </template>
    <template v-else-if="previewOnly">
      <main class="playground-shell__preview">
        <div v-if="compileError" class="playground-shell__error">
          {{ compileError }}
        </div>
        <slot />
      </main>
    </template>
    <template v-else>
      <aside class="playground-shell__code">
        <header class="playground-shell__code-header">
          <span class="playground-shell__filename">{{ demoName }}.vue</span>
          <button
            class="playground-shell__copy"
            type="button"
            :class="{ copied }"
            @click="copySource"
          >
            <i :class="copied ? 'bx bx-check' : 'bx bx-copy'" />
            {{ copied ? 'Copied' : 'Copy' }}
          </button>
        </header>
        <pre class="playground-shell__pre"><code>{{ source }}</code></pre>
      </aside>
      <main class="playground-shell__preview">
        <slot />
      </main>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  demoName: string
  source: string
  isIndex?: boolean
  previewOnly?: boolean
  compileError?: string | null
}>()

const copied = ref(false)

const copySource = async () => {
  try {
    await navigator.clipboard.writeText(props.source)
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
.playground-shell {
  display: grid;
  grid-template-columns: minmax(280px, 42%) 1fr;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 45%, #312e81 100%);

  &--index {
    display: block;
    min-height: 100vh;
    background: linear-gradient(160deg, #f8fafc 0%, #eef2ff 40%, #fdf4ff 100%);
  }

  &--preview-only {
    display: block;
    min-height: 100%;
    background: transparent;
  }
}

.playground-shell__code {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.92);
}

.playground-shell__code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.playground-shell__filename {
  font-size: 0.85rem;
  font-weight: 600;
  color: #c7d2fe;
}

.playground-shell__copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover,
  &.copied {
    border-color: rgba(129, 140, 248, 0.5);
    color: #c7d2fe;
  }
}

.playground-shell__pre {
  flex: 1;
  margin: 0;
  padding: 16px;
  overflow: auto;
  font-size: 0.82rem;
  line-height: 1.6;
  color: #e2e8f0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.playground-shell__preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  min-height: 100%;
  padding: 24px;
  background: radial-gradient(
      circle at 20% 20%,
      rgba(99, 102, 241, 0.18),
      transparent 45%
    ),
    radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.14), transparent 40%),
    rgba(255, 255, 255, 0.96);
}

.playground-shell--preview-only .playground-shell__preview {
  position: relative;
  min-height: 100%;
  background: transparent;
}

.playground-shell__error {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  z-index: 2;
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

@media (max-width: 900px) {
  .playground-shell {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(220px, 38vh) 1fr;
  }

  .playground-shell__code {
    border-right: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
}
</style>
